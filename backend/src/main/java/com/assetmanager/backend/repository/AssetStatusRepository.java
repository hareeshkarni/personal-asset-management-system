package com.assetmanager.backend.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.assetmanager.backend.model.AssetStatus;

public interface AssetStatusRepository extends JpaRepository<AssetStatus, Long> {
    // Optional<AssetStatus> findByName(String name);
    Optional<AssetStatus> findByNameIgnoreCase(String name);

    boolean existsByName(String name);
}
