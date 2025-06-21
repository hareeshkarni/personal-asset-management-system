package com.assetmanager.backend.service;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Service;

import com.assetmanager.backend.dto.AssetRequest;
import com.assetmanager.backend.dto.AssetResponse;
import com.assetmanager.backend.dto.PaginatedResponse;
import com.assetmanager.backend.exception.CustomException;
import com.assetmanager.backend.model.Asset;
import com.assetmanager.backend.model.AssetCategory;
import com.assetmanager.backend.model.AssetStatus;
import com.assetmanager.backend.model.User;
import com.assetmanager.backend.repository.AssetCategoryRepository;
import com.assetmanager.backend.repository.AssetRepository;
import com.assetmanager.backend.repository.AssetStatusRepository;
import com.assetmanager.backend.repository.UserRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AssetService {
        private final AssetRepository assetRepository;
        private final UserRepository userRepository;
        private final AssetCategoryRepository assetCategoryRepository;
        private final AssetStatusRepository assetStatusRepository;

        public AssetResponse createAsset(AssetRequest request) {
                String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
                User user = userRepository.findByUsername(currentUsername)
                                .orElseThrow(() -> new EntityNotFoundException("User not found"));
                User assignedUser = user;
                if ("ROLE_ADMIN".equals(user.getRole()) && request.getUsername() != null
                                && !request.getUsername().isBlank()) {
                        assignedUser = userRepository.findByUsername(request.getUsername())
                                        .orElseThrow(() -> new EntityNotFoundException(
                                                        "Target user not found: " + request.getUsername()));
                }

                // Get the category from the DB
                AssetCategory category = assetCategoryRepository
                                .findByName(request.getCategory())
                                .orElseThrow(() -> new CustomException(
                                                "Invalid category: " + request.getCategory()));

                AssetStatus status = assetStatusRepository
                                .findByNameIgnoreCase(request.getStatus())
                                .orElseThrow(() -> new CustomException("Invalid status"));

                Asset asset = Asset.builder()
                                .name(request.getName())
                                .description(request.getDescription())
                                .cost(request.getCost())
                                .purchaseDate(request.getPurchaseDate())
                                .warrantyExpiryDate(request.getWarrantyExpiryDate())
                                .imageUrl(request.getAssetImageUrl())
                                .category(category)
                                .status(status)
                                .user(assignedUser)
                                .build();

                Asset saved = assetRepository.save(asset);
                return mapToResponse(saved);
        }

        public PaginatedResponse<AssetResponse> getMyAssets(int page, int size) {
                String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
                User user = userRepository.findByUsername(currentUsername)
                                .orElseThrow(() -> new CustomException("User not found"));

                Pageable pageable = PageRequest.of(page, size);
                Page<Asset> assetPage;

                if ("ROLE_ADMIN".equals(user.getRole())) {
                        assetPage = assetRepository.findAll(pageable);
                } else {
                        assetPage = assetRepository.findByUser(user, pageable);
                }

                List<AssetResponse> content = assetPage.getContent().stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());

                return new PaginatedResponse<>(
                                content,
                                assetPage.getTotalPages(),
                                assetPage.getTotalElements(),
                                assetPage.getNumber());
        }

        private AssetResponse mapToResponse(Asset asset) {
                return AssetResponse.builder()
                                .id(asset.getId())
                                .name(asset.getName())
                                .description(asset.getDescription())
                                .cost(asset.getCost())
                                .purchaseDate(asset.getPurchaseDate())
                                .warrantyExpiryDate(asset.getWarrantyExpiryDate())
                                .assetImageUrl(asset.getImageUrl())
                                .category(asset.getCategory().getName())
                                .status(asset.getStatus().getName())
                                .createdAt(asset.getCreatedAt())
                                .updatedAt(asset.getUpdatedAt())
                                .assignedTo(asset.getUser().getUsername())
                                .build();
        }

        public AssetResponse getAssetById(Long id) {
                Asset asset = assetRepository.findById(id)
                                .orElseThrow(() -> new EntityNotFoundException("Asset not found with id " + id));
                return mapToResponse(asset);
        }

        public void deleteAsset(Long id) {
                if (!assetRepository.existsById(id)) {
                        throw new EntityNotFoundException("Asset not found");
                }
                assetRepository.deleteById(id);
        }

        public AssetResponse updateAsset(Long id, AssetRequest request) {
                Asset asset = assetRepository.findById(id)
                                .orElseThrow(() -> new EntityNotFoundException("Asset not found with id " + id));

                // Ensure the user updating it is the owner (optional but recommended)
                String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
                User user = userRepository.findByUsername(currentUsername)
                                .orElseThrow(() -> new EntityNotFoundException("User not found"));

                if (!user.getId().equals(asset.getUser().getId()) && !"ROLE_ADMIN".equals(user.getRole())) {
                        throw new CustomException("Unauthorized to update this asset");
                }

                AssetCategory category = assetCategoryRepository.findByName(request.getCategory())
                                .orElseThrow(() -> new CustomException("Invalid category: " + request.getCategory()));

                AssetStatus status = assetStatusRepository.findByNameIgnoreCase(request.getStatus())
                                .orElseThrow(() -> new CustomException("Invalid status"));
                if ("ROLE_ADMIN".equals(user.getRole()) && request.getUsername() != null
                                && !request.getUsername().isBlank()) {
                        User targetUser = userRepository.findByUsername(request.getUsername())
                                        .orElseThrow(() -> new EntityNotFoundException(
                                                        "Target user not found: " + request.getUsername()));
                        asset.setUser(targetUser);
                }

                asset.setName(request.getName());
                asset.setDescription(request.getDescription());
                asset.setCost(request.getCost());
                asset.setPurchaseDate(request.getPurchaseDate());
                asset.setWarrantyExpiryDate(request.getWarrantyExpiryDate());
                asset.setImageUrl(request.getAssetImageUrl());
                asset.setCategory(category);
                asset.setStatus(status);

                Asset updated = assetRepository.save(asset);
                return mapToResponse(updated);

        }

}
