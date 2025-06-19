package com.assetmanager.backend.dto;

import java.math.BigDecimal;
import java.time.LocalDate;


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
    private String name;
    private String description;
    private BigDecimal cost;
    private String category; // e.g., "LAPTOP", "MOBILE", etc.
    private String status;   // e.g., "ASSIGNED", "AVAILABLE"
    private LocalDate purchaseDate;    
    private LocalDate warrantyExpiryDate; // Nullable
    private String assetImageUrl; 
}
