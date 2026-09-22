package com.secure360.claim.controller;

import com.secure360.claim.dto.ReviewClaimRequest;
import com.secure360.claim.dto.SubmitEquipmentClaimRequest;
import com.secure360.claim.dto.SubmitIncomeClaimRequest;
import com.secure360.claim.entity.EquipmentClaim;
import com.secure360.claim.entity.IncomeClaim;
import com.secure360.claim.service.ClaimService;
import com.secure360.common.dto.ApiResponse;
import com.secure360.common.enums.ClaimStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/claims")
@RequiredArgsConstructor
public class ClaimController {

    private final ClaimService claimService;

    // ── Equipment Claims ──────────────────────────────────────────────────────

    @PostMapping("/equipment")
    public ResponseEntity<ApiResponse<EquipmentClaim>> submitEquipmentClaim(
            @RequestBody SubmitEquipmentClaimRequest request) {
        EquipmentClaim claim = claimService.submitEquipmentClaim(request);
        return ResponseEntity.ok(ApiResponse.ok("Equipment claim submitted: " + claim.getClaimNumber(), claim));
    }

    @GetMapping("/equipment")
    public ResponseEntity<ApiResponse<List<EquipmentClaim>>> getAllEquipmentClaims() {
        return ResponseEntity.ok(ApiResponse.ok("All equipment claims", claimService.getAllEquipmentClaims()));
    }

    @GetMapping("/equipment/user/{userId}")
    public ResponseEntity<ApiResponse<List<EquipmentClaim>>> getEquipmentClaimsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok("User equipment claims", claimService.getEquipmentClaimsForUser(userId)));
    }

    @GetMapping("/equipment/{id}")
    public ResponseEntity<ApiResponse<EquipmentClaim>> getEquipmentClaimById(@PathVariable Long id) {
        return claimService.getEquipmentClaimById(id)
                .map(c -> ResponseEntity.ok(ApiResponse.<EquipmentClaim>ok("Claim found", c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/equipment/status/{status}")
    public ResponseEntity<ApiResponse<List<EquipmentClaim>>> getEquipmentClaimsByStatus(@PathVariable ClaimStatus status) {
        return ResponseEntity.ok(ApiResponse.ok("Claims by status", claimService.getEquipmentClaimsByStatus(status)));
    }

    @PatchMapping("/equipment/{id}/review")
    public ResponseEntity<ApiResponse<EquipmentClaim>> reviewEquipmentClaim(
            @PathVariable Long id, @RequestBody ReviewClaimRequest request) {
        EquipmentClaim reviewed = claimService.reviewEquipmentClaim(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Claim reviewed", reviewed));
    }

    // ── Income Claims ─────────────────────────────────────────────────────────

    @PostMapping("/income")
    public ResponseEntity<ApiResponse<IncomeClaim>> submitIncomeClaim(
            @RequestBody SubmitIncomeClaimRequest request) {
        IncomeClaim claim = claimService.submitIncomeClaim(request);
        return ResponseEntity.ok(ApiResponse.ok("Income claim submitted: " + claim.getClaimNumber(), claim));
    }

    @GetMapping("/income")
    public ResponseEntity<ApiResponse<List<IncomeClaim>>> getAllIncomeClaims() {
        return ResponseEntity.ok(ApiResponse.ok("All income claims", claimService.getAllIncomeClaims()));
    }

    @GetMapping("/income/user/{userId}")
    public ResponseEntity<ApiResponse<List<IncomeClaim>>> getIncomeClaimsForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok("User income claims", claimService.getIncomeClaimsForUser(userId)));
    }

    @GetMapping("/income/{id}")
    public ResponseEntity<ApiResponse<IncomeClaim>> getIncomeClaimById(@PathVariable Long id) {
        return claimService.getIncomeClaimById(id)
                .map(c -> ResponseEntity.ok(ApiResponse.<IncomeClaim>ok("Claim found", c)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/income/status/{status}")
    public ResponseEntity<ApiResponse<List<IncomeClaim>>> getIncomeClaimsByStatus(@PathVariable ClaimStatus status) {
        return ResponseEntity.ok(ApiResponse.ok("Claims by status", claimService.getIncomeClaimsByStatus(status)));
    }

    @PatchMapping("/income/{id}/review")
    public ResponseEntity<ApiResponse<IncomeClaim>> reviewIncomeClaim(
            @PathVariable Long id, @RequestBody ReviewClaimRequest request) {
        IncomeClaim reviewed = claimService.reviewIncomeClaim(id, request);
        return ResponseEntity.ok(ApiResponse.ok("Claim reviewed", reviewed));
    }
}
