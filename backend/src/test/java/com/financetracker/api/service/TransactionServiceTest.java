package com.financetracker.api.service;

import com.financetracker.api.dto.TransactionRequest;
import com.financetracker.api.dto.TransactionResponse;
import com.financetracker.api.model.Category;
import com.financetracker.api.model.Transaction;
import com.financetracker.api.model.TransactionType;
import com.financetracker.api.model.User;
import com.financetracker.api.repository.CategoryRepository;
import com.financetracker.api.repository.TransactionRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TransactionServiceTest {

    @Mock
    private TransactionRepository transactionRepository;

    @Mock
    private CategoryRepository categoryRepository;

    @InjectMocks
    private TransactionService transactionService;

    private User user;
    private Category category;
    private Transaction transaction;
    private TransactionRequest request;

    @BeforeEach
    void setUp() {
        user = User.builder()
                .id(UUID.randomUUID())
                .name("Bruna")
                .email("bruna@email.com")
                .password("hashed")
                .build();

        category = Category.builder()
                .id(UUID.randomUUID())
                .name("Alimentação")
                .type(TransactionType.EXPENSE)
                .user(user)
                .build();

        transaction = Transaction.builder()
                .id(UUID.randomUUID())
                .description("Supermercado")
                .amount(new BigDecimal("150.00"))
                .date(LocalDate.of(2026, 6, 1))
                .type(TransactionType.EXPENSE)
                .category(category)
                .user(user)
                .build();

        request = new TransactionRequest();
        request.setDescription("Supermercado");
        request.setAmount(new BigDecimal("150.00"));
        request.setDate(LocalDate.of(2026, 6, 1));
        request.setType(TransactionType.EXPENSE);
        request.setCategoryId(category.getId());
    }

    @Test
    void findAll_shouldReturnUserTransactions() {
        // Arrange
        when(transactionRepository.findByUserOrderByDateDesc(user))
                .thenReturn(List.of(transaction));

        // Act
        List<TransactionResponse> result = transactionService.findAll(user);

        // Assert
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getDescription()).isEqualTo("Supermercado");
        assertThat(result.get(0).getAmount()).isEqualTo(new BigDecimal("150.00"));
    }

    @Test
    void create_shouldReturnTransactionWhenCategoryExists() {
        // Arrange
        when(categoryRepository.findByIdAndUser(category.getId(), user))
                .thenReturn(Optional.of(category));
        when(transactionRepository.save(any(Transaction.class)))
                .thenReturn(transaction);

        // Act
        TransactionResponse result = transactionService.create(user, request);

        // Assert
        assertThat(result.getDescription()).isEqualTo("Supermercado");
        assertThat(result.getAmount()).isEqualTo(new BigDecimal("150.00"));
        verify(transactionRepository).save(any(Transaction.class));
    }

    @Test
    void create_shouldThrowWhenCategoryNotFound() {
        // Arrange
        when(categoryRepository.findByIdAndUser(any(), any()))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> transactionService.create(user, request))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Categoria não encontrada");

        verify(transactionRepository, never()).save(any());
    }

    @Test
    void delete_shouldDeleteWhenTransactionExists() {
        // Arrange
        when(transactionRepository.findByIdAndUser(transaction.getId(), user))
                .thenReturn(Optional.of(transaction));

        // Act
        transactionService.delete(user, transaction.getId());

        // Assert
        verify(transactionRepository).delete(transaction);
    }

    @Test
    void delete_shouldThrowWhenTransactionNotFound() {
        // Arrange
        when(transactionRepository.findByIdAndUser(any(), any()))
                .thenReturn(Optional.empty());

        // Act & Assert
        assertThatThrownBy(() -> transactionService.delete(user, UUID.randomUUID()))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Transação não encontrada");

        verify(transactionRepository, never()).delete(any());
    }
}