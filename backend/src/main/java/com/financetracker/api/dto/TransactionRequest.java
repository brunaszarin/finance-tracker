package com.financetracker.api.dto;

import com.financetracker.api.model.TransactionType;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Data
public class TransactionRequest {

    @NotBlank(message = "Descrição é obrigatória")
    private String description;

    @NotNull(message = "Valor é obrigatório")
    @DecimalMin(value = "0.01", message = "Valor deve ser maior que zero")
    private BigDecimal amount;

    @NotNull(message = "Data é obrigatória")
    private LocalDate date;

    @NotNull(message = "Tipo é obrigatório")
    private TransactionType type;

    @NotNull(message = "Categoria é obrigatória")
    private UUID categoryId;
}