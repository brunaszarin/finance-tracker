package com.financetracker.api.dto;

import com.financetracker.api.model.Transaction;
import com.financetracker.api.model.TransactionType;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class TransactionResponse {
    private UUID id;
    private String description;
    private BigDecimal amount;
    private LocalDate date;
    private TransactionType type;
    private UUID categoryId;
    private String categoryName;

    public static TransactionResponse from(Transaction transaction) {
        TransactionResponse response = new TransactionResponse();
        response.setId(transaction.getId());
        response.setDescription(transaction.getDescription());
        response.setAmount(transaction.getAmount());
        response.setDate(transaction.getDate());
        response.setType(transaction.getType());
        response.setCategoryId(transaction.getCategory().getId());
        response.setCategoryName(transaction.getCategory().getName());
        return response;
    }
}