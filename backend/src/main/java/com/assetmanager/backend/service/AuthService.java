package com.assetmanager.backend.service;

import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.assetmanager.backend.dto.JwtResponse;
import com.assetmanager.backend.dto.LoginRequest;
import com.assetmanager.backend.dto.RegisterRequest;
import com.assetmanager.backend.model.User;
import com.assetmanager.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    public JwtResponse register(RegisterRequest request) {
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already exists");
        }

        // Normalize role to uppercase and ensure it starts with "ROLE_"
        String inputRole = request.getRole();
        String role = "ROLE_USER"; // default

        if (inputRole != null && !inputRole.isBlank()) {
            inputRole = inputRole.toUpperCase();
            if (!inputRole.startsWith("ROLE_")) {
                inputRole = "ROLE_" + inputRole;
            }

            if (inputRole.equals("ROLE_ADMIN")) {
                role = "ROLE_ADMIN";
            }
        }

        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(role)
                .build();

        userRepository.save(user);

        String token = jwtService.generateToken(user);
        return new JwtResponse(token);
    }

    public JwtResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtService.generateToken(user);
        return new JwtResponse(token);
    }
}
