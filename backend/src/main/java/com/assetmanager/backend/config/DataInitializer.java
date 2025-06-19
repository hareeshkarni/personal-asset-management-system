package com.assetmanager.backend.config;

import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import com.assetmanager.backend.model.AssetCategory;
import com.assetmanager.backend.model.AssetStatus;
import com.assetmanager.backend.repository.AssetCategoryRepository;
import com.assetmanager.backend.repository.AssetStatusRepository;

import lombok.RequiredArgsConstructor;

@Configuration
@RequiredArgsConstructor
public class DataInitializer {
    private final AssetCategoryRepository categoryRepository;
    private final AssetStatusRepository statusRepository;

    @Bean
    public CommandLineRunner initializeData() {
        return args -> {
            if (!categoryRepository.existsByName("LAPTOP")) {
                categoryRepository.save(AssetCategory.builder().name("LAPTOP").build());
            }
            if (!categoryRepository.existsByName("MOBILE")) {
                categoryRepository.save(AssetCategory.builder().name("MOBILE").build());
            }
            if (!categoryRepository.existsByName("CAMERA")) {
                categoryRepository.save(AssetCategory.builder().name("CAMERA").build()); // ✅ corrected
            }

            if (!statusRepository.existsByName("AVAILABLE")) {
                statusRepository.save(AssetStatus.builder().name("AVAILABLE").build());
            }
            if (!statusRepository.existsByName("ASSIGNED")) {
                statusRepository.save(AssetStatus.builder().name("ASSIGNED").build());
            }
        };
    }
}
