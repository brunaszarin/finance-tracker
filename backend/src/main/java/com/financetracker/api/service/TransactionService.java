package com.financetracker.api.service;

import com.financetracker.api.dto.TransactionRequest;
import com.financetracker.api.dto.TransactionResponse;
import com.financetracker.api.model.Category;
import com.financetracker.api.model.Transaction;
import com.financetracker.api.model.User;
import com.financetracker.api.repository.CategoryRepository;
import com.financetracker.api.repository.TransactionRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TransactionService {

    private final TransactionRepository transactionRepository;
    private final CategoryRepository categoryRepository;

    public List<TransactionResponse> findAll(User user) {
        return transactionRepository.findByUserOrderByDateDesc(user)
                .stream()
                .map(TransactionResponse::from)
                .toList();
    }

    public TransactionResponse create(User user, TransactionRequest request) {
        Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        Transaction transaction = Transaction.builder()
                .description(request.getDescription())
                .amount(request.getAmount())
                .date(request.getDate())
                .type(request.getType())
                .category(category)
                .user(user)
                .build();

        return TransactionResponse.from(transactionRepository.save(transaction));
    }

    public TransactionResponse update(User user, UUID id, TransactionRequest request) {
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada"));

        Category category = categoryRepository.findByIdAndUser(request.getCategoryId(), user)
                .orElseThrow(() -> new RuntimeException("Categoria não encontrada"));

        transaction.setDescription(request.getDescription());
        transaction.setAmount(request.getAmount());
        transaction.setDate(request.getDate());
        transaction.setType(request.getType());
        transaction.setCategory(category);

        return TransactionResponse.from(transactionRepository.save(transaction));
    }

    public void delete(User user, UUID id) {
        Transaction transaction = transactionRepository.findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Transação não encontrada"));
        transactionRepository.delete(transaction);
    }
}