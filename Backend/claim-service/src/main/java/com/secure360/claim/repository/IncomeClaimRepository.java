package com.secure360.claim.repository;

import com.secure360.claim.entity.IncomeClaim;
import com.secure360.common.enums.ClaimStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface IncomeClaimRepository extends JpaRepository<IncomeClaim, Long> {
    List<IncomeClaim> findByUserId(Long userId);
    List<IncomeClaim> findByPolicyNumber(String policyNumber);
    List<IncomeClaim> findByStatus(ClaimStatus status);
    Optional<IncomeClaim> findByClaimNumber(String claimNumber);
    List<IncomeClaim> findAllByOrderBySubmittedAtDesc();
}
