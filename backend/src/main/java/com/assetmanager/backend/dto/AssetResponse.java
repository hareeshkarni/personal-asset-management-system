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
public class AssetResponse {
    private Long id;
    private String name;
    private String description;
    private BigDecimal cost;
    private String category;
    private String status;
    private LocalDate purchaseDate;
    private LocalDate warrantyExpiryDate;
    private String assetImageUrl;
    private LocalDate createdAt;
    private LocalDate updatedAt;
}
