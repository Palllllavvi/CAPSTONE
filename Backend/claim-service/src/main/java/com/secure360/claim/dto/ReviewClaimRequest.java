package com.secure360.claim.dto;

import com.secure360.common.enums.ClaimStatus;
import lombok.Data;

@Data
public class ReviewClaimRequest {
    private ClaimStatus status; // UNDER_REVIEW, APPROVED, REJECTED, SETTLED
    private String assessorNotes;
    private String assessorId;
    private Double approvedAmount; // for APPROVED/SETTLED
}
