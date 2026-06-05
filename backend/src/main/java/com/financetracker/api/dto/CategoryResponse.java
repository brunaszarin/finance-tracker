package com.financetracker.api.dto;

import com.financetracker.api.model.Category;
import com.financetracker.api.model.TransactionType;
import lombok.Data;

import java.util.UUID;

@Data
public class CategoryResponse {
    private UUID id;
    private String name;
    private TransactionType type;

    public static CategoryResponse from(Category category) {
        CategoryResponse response = new CategoryResponse();
        response.setId(category.getId());
        response.setName(category.getName());
        response.setType(category.getType());
        return response;
    }
}