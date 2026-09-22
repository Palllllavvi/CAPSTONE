package com.secure360.claim.entity;

import com.secure360.common.enums.ClaimStatus;
import com.secure360.common.enums.IncidentType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment_claims")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentClaim {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String claimNumber; // e.g. EC-2026-000001

    @Column(nullable = false)
    private String policyNumber; // references equipment policy

    @Column(nullable = false)
    private Long userId;

    private Long projectId;
    private Long equipmentId;
    private String equipmentName;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private IncidentType incidentType; // THEFT, DAMAGE, LOSS, etc.

    @Column(nullable = false)
    private LocalDate incidentDate;

    @Column(columnDefinition = "TEXT")
    private String incidentDescription;

    private String incidentLocation;

    @Column(nullable = false)
    private Double claimedAmount;

    private Double approvedAmount;

    @Column(nullable = false)
    private String reportingPolice; // YES/NO

    private String policeReportNumber;

    // Document references (comma-separated file paths / URLs)
    @Column(columnDefinition = "TEXT")
    private String documentRefs;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    @Builder.Default
    private ClaimStatus status = ClaimStatus.SUBMITTED;

    // Assessor notes
    @Column(columnDefinition = "TEXT")
    private String assessorNotes;

    private String assessorId;

    @Builder.Default
    private LocalDateTime submittedAt = LocalDateTime.now();

    private LocalDateTime reviewedAt;
    private LocalDateTime settledAt;
}
