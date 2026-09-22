package com.secure360.claim.dto;

import com.secure360.common.enums.IncidentType;
import lombok.Data;

import java.time.LocalDate;

@Data
public class SubmitEquipmentClaimRequest {
    private String policyNumber;
    private Long userId;
    private Long projectId;
    private Long equipmentId;
    private String equipmentName;
    private IncidentType incidentType;
    private LocalDate incidentDate;
    private String incidentDescription;
    private String incidentLocation;
    private Double claimedAmount;
    private String reportingPolice; // "YES" or "NO"
    private String policeReportNumber;
    private String documentRefs; // comma-separated
}
