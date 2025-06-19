package com.assetmanager.backend.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.assetmanager.backend.model.AssetCategory;
import com.assetmanager.backend.repository.AssetCategoryRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AssetCategoryService {
    private final AssetCategoryRepository repository;

    public AssetCategory createCategory(AssetCategory category) {
        if (repository.existsByName(category.getName()))
            throw new RuntimeException("Category already exists");
        return repository.save(category);
    }

    public List<AssetCategory> getAllCategoriesPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findAll(pageable).getContent();
    }


    public void deleteCategory(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("Category not found");
        repository.deleteById(id);
    }
}
