package com.secure360.policy.controller;

import com.secure360.common.dto.ApiResponse;
import com.secure360.policy.dto.IssueEquipmentPolicyRequest;
import com.secure360.policy.dto.IssueIncomeAssurancePolicyRequest;
import com.secure360.policy.entity.EquipmentPolicy;
import com.secure360.policy.entity.IncomeAssurancePolicy;
import com.secure360.policy.service.PolicyService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/policies")
@RequiredArgsConstructor
public class PolicyController {

    private final PolicyService policyService;

    // ── Equipment Policies ────────────────────────────────────────────────────

    @PostMapping("/equipment")
    public ResponseEntity<ApiResponse<EquipmentPolicy>> issueEquipmentPolicy(
            @RequestBody IssueEquipmentPolicyRequest request) {
        EquipmentPolicy policy = policyService.issueEquipmentPolicy(request);
        return ResponseEntity.ok(ApiResponse.ok("Equipment policy issued: " + policy.getPolicyNumber(), policy));
    }

    @GetMapping("/equipment")
    public ResponseEntity<ApiResponse<List<EquipmentPolicy>>> getAllEquipmentPolicies() {
        return ResponseEntity.ok(ApiResponse.ok("Equipment policies fetched", policyService.getAllEquipmentPolicies()));
    }

    @GetMapping("/equipment/user/{userId}")
    public ResponseEntity<ApiResponse<List<EquipmentPolicy>>> getEquipmentPoliciesForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok("User equipment policies", policyService.getEquipmentPoliciesForUser(userId)));
    }

    @GetMapping("/equipment/{id}")
    public ResponseEntity<ApiResponse<EquipmentPolicy>> getEquipmentPolicyById(@PathVariable Long id) {
        return policyService.getEquipmentPolicyById(id)
                .map(p -> ResponseEntity.ok(ApiResponse.<EquipmentPolicy>ok("Policy found", p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/equipment/number/{policyNumber}")
    public ResponseEntity<ApiResponse<EquipmentPolicy>> getEquipmentPolicyByNumber(@PathVariable String policyNumber) {
        return policyService.getEquipmentPolicyByNumber(policyNumber)
                .map(p -> ResponseEntity.ok(ApiResponse.<EquipmentPolicy>ok("Policy found", p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/equipment/{id}/cancel")
    public ResponseEntity<ApiResponse<EquipmentPolicy>> cancelEquipmentPolicy(@PathVariable Long id) {
        EquipmentPolicy cancelled = policyService.cancelEquipmentPolicy(id);
        return ResponseEntity.ok(ApiResponse.ok("Policy cancelled", cancelled));
    }

    // ── Income Assurance Policies ─────────────────────────────────────────────

    @PostMapping("/income")
    public ResponseEntity<ApiResponse<IncomeAssurancePolicy>> issueIncomeAssurancePolicy(
            @RequestBody IssueIncomeAssurancePolicyRequest request) {
        IncomeAssurancePolicy policy = policyService.issueIncomeAssurancePolicy(request);
        return ResponseEntity.ok(ApiResponse.ok("Income assurance policy issued: " + policy.getPolicyNumber(), policy));
    }

    @GetMapping("/income")
    public ResponseEntity<ApiResponse<List<IncomeAssurancePolicy>>> getAllIncomePolicies() {
        return ResponseEntity.ok(ApiResponse.ok("Income policies fetched", policyService.getAllIncomePolicies()));
    }

    @GetMapping("/income/user/{userId}")
    public ResponseEntity<ApiResponse<List<IncomeAssurancePolicy>>> getIncomePoliciesForUser(@PathVariable Long userId) {
        return ResponseEntity.ok(ApiResponse.ok("User income policies", policyService.getIncomePoliciesForUser(userId)));
    }

    @GetMapping("/income/{id}")
    public ResponseEntity<ApiResponse<IncomeAssurancePolicy>> getIncomePolicyById(@PathVariable Long id) {
        return policyService.getIncomePolicyById(id)
                .map(p -> ResponseEntity.ok(ApiResponse.<IncomeAssurancePolicy>ok("Policy found", p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @GetMapping("/income/number/{policyNumber}")
    public ResponseEntity<ApiResponse<IncomeAssurancePolicy>> getIncomePolicyByNumber(@PathVariable String policyNumber) {
        return policyService.getIncomePolicyByNumber(policyNumber)
                .map(p -> ResponseEntity.ok(ApiResponse.<IncomeAssurancePolicy>ok("Policy found", p)))
                .orElse(ResponseEntity.notFound().build());
    }

    @PatchMapping("/income/{id}/cancel")
    public ResponseEntity<ApiResponse<IncomeAssurancePolicy>> cancelIncomePolicy(@PathVariable Long id) {
        IncomeAssurancePolicy cancelled = policyService.cancelIncomePolicy(id);
        return ResponseEntity.ok(ApiResponse.ok("Policy cancelled", cancelled));
    }
}
