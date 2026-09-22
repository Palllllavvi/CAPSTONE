package com.secure360.common.dto;

import com.secure360.common.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDTO {
    private Long id;
    private String name;
    private String email;
    private String phone;
    private String profession;
    private Integer experienceYears;
    private String city;
    private Double averageMonthlyIncome;
    private Role role;
    private Boolean kycVerified;
    private LocalDateTime createdAt;
}
