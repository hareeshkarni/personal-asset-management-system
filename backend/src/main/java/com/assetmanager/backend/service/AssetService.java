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

                // ✅ Get the category from the DB
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
                                .user(user)
                                .build();

                Asset saved = assetRepository.save(asset);
                return mapToResponse(saved);
        }

        public List<AssetResponse> getMyAssets(int page, int size) {
                String currentUsername = SecurityContextHolder.getContext().getAuthentication().getName();
                User user = userRepository.findByUsername(currentUsername)
                                .orElseThrow(() -> new CustomException("User not found"));

                Pageable pageable = PageRequest.of(page, size);
                Page<Asset> assetPage = assetRepository.findByUser(user, pageable);

                return assetPage.getContent().stream()
                                .map(this::mapToResponse)
                                .collect(Collectors.toList());
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
                                .build();
        }
}
