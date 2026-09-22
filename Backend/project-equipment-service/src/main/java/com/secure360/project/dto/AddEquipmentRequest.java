package com.secure360.project.dto;

import com.secure360.common.enums.EquipmentCondition;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AddEquipmentRequest {
    @NotBlank(message = "Equipment type is required")
    private String equipmentType;

    @NotBlank(message = "Brand is required")
    private String brand;

    @NotBlank(message = "Model is required")
    private String model;

    @NotBlank(message = "Serial number is required")
    private String serialNumber;

    @NotNull(message = "Declared value is required")
    private Double declaredValue;

    @Builder.Default
    private EquipmentCondition condition = EquipmentCondition.GOOD;

    private String ownershipEvidence;
    private String photoUrl;
}
