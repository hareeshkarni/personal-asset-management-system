package com.assetmanager.backend.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.assetmanager.backend.dto.AssetRequest;
import com.assetmanager.backend.dto.AssetResponse;
import com.assetmanager.backend.service.AssetService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/assets")
@RequiredArgsConstructor
public class AssetController {
    private final AssetService assetService;

    // 🔐 Only authenticated users can add assets
    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<AssetResponse> createAsset(@RequestBody AssetRequest request) {
        AssetResponse response = assetService.createAsset(request);
        return ResponseEntity.ok(response);
    }

    // 🔐 Only authenticated users can view their assets
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<AssetResponse>> getMyAssets(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {

        List<AssetResponse> assets = assetService.getMyAssets(page, size);
        return ResponseEntity.ok(assets);
    }
}
