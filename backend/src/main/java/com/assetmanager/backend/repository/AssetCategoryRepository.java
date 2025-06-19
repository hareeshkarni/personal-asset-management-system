package com.assetmanager.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.assetmanager.backend.model.AssetCategory;



public interface AssetCategoryRepository extends JpaRepository<AssetCategory, Long>{
    Optional<AssetCategory> findByName(String name);
    
    boolean existsByName(String name);
}
