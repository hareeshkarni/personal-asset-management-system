package com.assetmanager.backend.service;

import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.assetmanager.backend.model.AssetStatus;
import com.assetmanager.backend.repository.AssetStatusRepository;

import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AssetStatusService {
    private final AssetStatusRepository repository;

    public AssetStatus createStatus(AssetStatus status) {
        if (repository.existsByName(status.getName()))
            throw new RuntimeException("Status already exists");
        return repository.save(status);
    }

    public List<AssetStatus> getAllStatusesPaginated(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        return repository.findAll(pageable).getContent();
    }

    public void deleteStatus(Long id) {
        if (!repository.existsById(id))
            throw new EntityNotFoundException("Status not found");
        repository.deleteById(id);
    }
}
