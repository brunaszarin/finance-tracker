package com.financetracker.api.controller;

import com.financetracker.api.model.TransactionType;
import com.financetracker.api.model.User;
import com.financetracker.api.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.Map;

@RestController
@RequestMapping("/api/summary")
@RequiredArgsConstructor
public class SummaryController {

    private final TransactionRepository transactionRepository;

    @GetMapping
    public ResponseEntity<Map<String, Object>> getSummary(
            @AuthenticationPrincipal User user,
            @RequestParam String month) {

        LocalDate start = LocalDate.parse(month + "-01");
        LocalDate end = start.withDayOfMonth(start.lengthOfMonth());

        BigDecimal income = transactionRepository.sumByUserAndTypeAndDateBetween(
                user, TransactionType.INCOME, start, end);
        BigDecimal expense = transactionRepository.sumByUserAndTypeAndDateBetween(
                user, TransactionType.EXPENSE, start, end);
        BigDecimal balance = income.subtract(expense);

        return ResponseEntity.ok(Map.of(
                "income", income,
                "expense", expense,
                "balance", balance,
                "month", month
        ));
    }
}