package com.secure360.project.controller;

import com.secure360.common.dto.ApiResponse;
import com.secure360.common.security.UserPrincipal;
import com.secure360.project.dto.*;
import com.secure360.project.service.ProjectService;
import jakarta.validation.Valid;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;

    @PostMapping
    public ResponseEntity<ApiResponse<ProjectDetailsDTO>> createProject(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody CreateProjectRequest request) {
        Long userId = principal != null ? principal.getId() : 1L;
        ProjectDetailsDTO created = projectService.createProject(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("Project created successfully", created));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<ProjectDetailsDTO>>> getMyProjects(
            @AuthenticationPrincipal UserPrincipal principal) {
        Long userId = principal != null ? principal.getId() : 1L;
        List<ProjectDetailsDTO> list = projectService.getProjectsByUser(userId);
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/all")
    public ResponseEntity<ApiResponse<List<ProjectDetailsDTO>>> getAllProjects() {
        List<ProjectDetailsDTO> list = projectService.getAllProjects();
        return ResponseEntity.ok(ApiResponse.ok(list));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<ProjectDetailsDTO>> getProjectById(@PathVariable Long id) {
        ProjectDetailsDTO dto = projectService.getProjectDetails(id);
        return ResponseEntity.ok(ApiResponse.ok(dto));
    }

    @PostMapping("/{id}/agreement")
    public ResponseEntity<ApiResponse<ProjectDetailsDTO>> uploadAgreement(
            @PathVariable Long id,
            @RequestBody AgreementUploadRequest req) {
        ProjectDetailsDTO updated = projectService.uploadAgreement(id, req.getDocumentName(), req.getDocumentText());
        return ResponseEntity.ok(ApiResponse.ok("Agreement processed and liability clauses extracted", updated));
    }

    @PostMapping("/{id}/equipment")
    public ResponseEntity<ApiResponse<ProjectDetailsDTO>> addEquipment(
            @PathVariable Long id,
            @Valid @RequestBody AddEquipmentRequest req) {
        ProjectDetailsDTO updated = projectService.addEquipment(id, req);
        return ResponseEntity.ok(ApiResponse.ok("Client equipment registered successfully", updated));
    }

    @PostMapping("/{id}/handover")
    public ResponseEntity<ApiResponse<ProjectDetailsDTO>> recordHandover(
            @PathVariable Long id,
            @Valid @RequestBody HandoverRequest req) {
        req.setProjectId(id);
        ProjectDetailsDTO updated = projectService.recordHandover(req);
        return ResponseEntity.ok(ApiResponse.ok("Handover confirmed and chain of custody recorded", updated));
    }

    @PostMapping("/{id}/return")
    public ResponseEntity<ApiResponse<ProjectDetailsDTO>> recordReturn(
            @PathVariable Long id,
            @Valid @RequestBody ReturnEquipmentRequest req) {
        req.setProjectId(id);
        ProjectDetailsDTO updated = projectService.recordReturn(req);
        return ResponseEntity.ok(ApiResponse.ok("Equipment return recorded and project completed", updated));
    }

    @PutMapping("/{id}/policy-link")
    public ResponseEntity<ApiResponse<String>> linkPolicy(
            @PathVariable Long id,
            @RequestParam String policyNumber) {
        projectService.updateProjectPolicy(id, policyNumber);
        return ResponseEntity.ok(ApiResponse.ok("Project policy linked successfully", policyNumber));
    }

    @Data
    public static class AgreementUploadRequest {
        private String documentName;
        private String documentText;
    }
}
