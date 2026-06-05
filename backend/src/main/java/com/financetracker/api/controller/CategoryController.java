package com.financetracker.api.controller;

import com.financetracker.api.dto.CategoryResponse;
import com.financetracker.api.model.Category;
import com.financetracker.api.model.TransactionType;
import com.financetracker.api.model.User;
import com.financetracker.api.repository.CategoryRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@RequiredArgsConstructor
public class CategoryController {

    private final CategoryRepository categoryRepository;

    @GetMapping
    public ResponseEntity<List<CategoryResponse>> findAll(@AuthenticationPrincipal User user) {
        return ResponseEntity.ok(
                categoryRepository.findByUser(user)
                        .stream()
                        .map(CategoryResponse::from)
                        .toList()
        );
    }

    @PostMapping
    public ResponseEntity<CategoryResponse> create(
            @AuthenticationPrincipal User user,
            @Valid @RequestBody CategoryRequest request) {
        Category category = Category.builder()
                .name(request.getName())
                .type(request.getType())
                .user(user)
                .build();
        return ResponseEntity.ok(CategoryResponse.from(categoryRepository.save(category)));
    }

    @Data
    static class CategoryRequest {
        @NotBlank(message = "Nome é obrigatório")
        private String name;
        @NotNull(message = "Tipo é obrigatório")
        private TransactionType type;
    }
}