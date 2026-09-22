package com.secure360.risk.controller;

import com.secure360.common.dto.ApiResponse;
import com.secure360.common.dto.EquipmentQuoteRequest;
import com.secure360.common.dto.EquipmentQuoteResponse;
import com.secure360.common.dto.IncomeQuoteRequest;
import com.secure360.common.dto.IncomeQuoteResponse;
import com.secure360.risk.service.EquipmentRiskRatingService;
import com.secure360.risk.service.IncomeUnderwritingService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/risk")
@RequiredArgsConstructor
public class RiskController {

    private final EquipmentRiskRatingService equipmentRiskRatingService;
    private final IncomeUnderwritingService incomeUnderwritingService;

    @PostMapping("/equipment-quote")
    public ResponseEntity<ApiResponse<EquipmentQuoteResponse>> getEquipmentQuote(
            @Valid @RequestBody EquipmentQuoteRequest request) {
        EquipmentQuoteResponse response = equipmentRiskRatingService.calculateEquipmentQuote(request);
        return ResponseEntity.ok(ApiResponse.ok("Equipment quote generated", response));
    }

    @PostMapping("/income-quote")
    public ResponseEntity<ApiResponse<IncomeQuoteResponse>> getIncomeQuote(
            @Valid @RequestBody IncomeQuoteRequest request) {
        IncomeQuoteResponse response = incomeUnderwritingService.calculateIncomeQuote(request);
        return ResponseEntity.ok(ApiResponse.ok("Income assurance quote generated", response));
    }
}
