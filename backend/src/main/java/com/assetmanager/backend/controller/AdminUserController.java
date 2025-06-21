// src/main/java/com/assetmanager/backend/controller/AdminUserController.java
package com.assetmanager.backend.controller;

import com.assetmanager.backend.model.User;
import com.assetmanager.backend.repository.UserRepository;
import lombok.RequiredArgsConstructor;

import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/usernames")
@RequiredArgsConstructor
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<List<String>> getAllUsernames() {
        List<String> usernames = userRepository.findAll()
                .stream()
                .map(User::getUsername)
                .toList();
        return ResponseEntity.ok(usernames);
    }
}
