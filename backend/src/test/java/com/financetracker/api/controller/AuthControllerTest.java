package com.financetracker.api.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.financetracker.api.dto.AuthResponse;
import com.financetracker.api.dto.LoginRequest;
import com.financetracker.api.dto.RegisterRequest;
import com.financetracker.api.service.AuthService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.http.MediaType;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
class AuthControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @MockBean
    private AuthService authService;

    @Test
    void register_shouldReturn200WithToken() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setName("Bruna");
        request.setEmail("bruna@email.com");
        request.setPassword("123456");

        AuthResponse response = new AuthResponse("fake_token", "Bruna", "bruna@email.com");
        when(authService.register(any())).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake_token"))
                .andExpect(jsonPath("$.name").value("Bruna"))
                .andExpect(jsonPath("$.email").value("bruna@email.com"));
    }

    @Test
    void register_shouldReturn400WhenEmailIsInvalid() throws Exception {
        // Arrange
        RegisterRequest request = new RegisterRequest();
        request.setName("Bruna");
        request.setEmail("emailinvalido");
        request.setPassword("123456");

        // Act & Assert
        mockMvc.perform(post("/api/auth/register")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void login_shouldReturn200WithToken() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("bruna@email.com");
        request.setPassword("123456");

        AuthResponse response = new AuthResponse("fake_token", "Bruna", "bruna@email.com");
        when(authService.login(any())).thenReturn(response);

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").value("fake_token"));
    }

    @Test
    void login_shouldReturn400WhenPasswordIsMissing() throws Exception {
        // Arrange
        LoginRequest request = new LoginRequest();
        request.setEmail("bruna@email.com");

        // Act & Assert
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isBadRequest());
    }
}