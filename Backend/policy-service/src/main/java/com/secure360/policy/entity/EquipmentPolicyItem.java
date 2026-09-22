package com.secure360.policy.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "equipment_policy_items")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentPolicyItem {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "equipment_policy_id", nullable = false)
    private EquipmentPolicy equipmentPolicy;

    private Long equipmentId;
    private String equipmentName;
    private String serialNumber;
    private Double insuredValue;
    private String condition; // EXCELLENT, GOOD, FAIR
}
