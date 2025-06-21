package com.assetmanager.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import jakarta.validation.constraints.Positive;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class AssetRequest {

    @NotBlank(message = "Asset name is required")
    private String name;

    @NotBlank(message = "Description is required")
    private String description;

    @NotNull(message = "Cost is required")
    @Positive(message = "Cost must be greater than zero")
    private BigDecimal cost;

    @NotBlank(message = "Category is required")
    private String category; // e.g., "LAPTOP", "MOBILE", etc.

    @NotBlank(message = "Status is required")
    private String status;   // e.g., "ASSIGNED", "AVAILABLE"

    @NotNull(message = "Purchase date is required")
    private LocalDate purchaseDate;    

    @NotNull(message = "Warranty expiry date is required")
    private LocalDate warrantyExpiryDate; // Nullable

    @NotBlank(message = "Asset image URL is required")
    private String assetImageUrl; 

    private String username; 

}
