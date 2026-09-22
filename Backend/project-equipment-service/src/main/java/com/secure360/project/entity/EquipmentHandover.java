package com.secure360.project.entity;

import com.secure360.common.enums.EquipmentCondition;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "equipment_handovers")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class EquipmentHandover {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private Long projectId;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "equipment_id", nullable = false)
    private Equipment equipment;

    @Column(nullable = false)
    private LocalDate handoverDate;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EquipmentCondition handoverCondition;

    @Builder.Default
    private Boolean clientConfirmation = false;

    @Builder.Default
    private Boolean freelancerConfirmation = false;

    private String handoverNotes;

    // Return flow
    private LocalDate returnDate;

    @Enumerated(EnumType.STRING)
    private EquipmentCondition returnCondition;

    @Builder.Default
    private Boolean returnConfirmed = false;

    private String returnNotes;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
}
