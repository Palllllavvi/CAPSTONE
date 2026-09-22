package com.secure360.auth.controller;

import com.secure360.auth.service.AuthService;
import com.secure360.common.dto.ApiResponse;
import com.secure360.common.dto.UserDTO;
import com.secure360.common.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@RequiredArgsConstructor
public class UserController {

    private final AuthService authService;

    @GetMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> getMyProfile(@AuthenticationPrincipal UserPrincipal principal) {
        UserDTO profile = authService.getUserProfile(principal.getId());
        return ResponseEntity.ok(ApiResponse.ok(profile));
    }

    @PutMapping("/profile")
    public ResponseEntity<ApiResponse<UserDTO>> updateMyProfile(
            @AuthenticationPrincipal UserPrincipal principal,
            @RequestBody UserDTO dto) {
        UserDTO updated = authService.updateUserProfile(principal.getId(), dto);
        return ResponseEntity.ok(ApiResponse.ok("Profile updated successfully", updated));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<UserDTO>> getUserById(@PathVariable Long id) {
        UserDTO user = authService.getUserProfile(id);
        return ResponseEntity.ok(ApiResponse.ok(user));
    }
}
