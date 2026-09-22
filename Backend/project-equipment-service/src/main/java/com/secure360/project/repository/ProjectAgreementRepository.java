package com.secure360.project.repository;

import com.secure360.project.entity.ProjectAgreement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProjectAgreementRepository extends JpaRepository<ProjectAgreement, Long> {
    Optional<ProjectAgreement> findByProjectId(Long projectId);
}
