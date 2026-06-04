package com.financetracker.api.service;

import com.financetracker.api.dto.AuthResponse;
import com.financetracker.api.dto.LoginRequest;
import com.financetracker.api.dto.RegisterRequest;
import com.financetracker.api.model.User;
import com.financetracker.api.repository.UserRepository;
import com.financetracker.api.security.JwtService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private JwtService jwtService;

    @Mock
    private AuthenticationManager authenticationManager;

    @InjectMocks
    private AuthService authService;

    private RegisterRequest registerRequest;
    private LoginRequest loginRequest;
    private User user;

    @BeforeEach
    void setUp() {
        registerRequest = new RegisterRequest();
        registerRequest.setName("Bruna");
        registerRequest.setEmail("bruna@email.com");
        registerRequest.setPassword("123456");

        loginRequest = new LoginRequest();
        loginRequest.setEmail("bruna@email.com");
        loginRequest.setPassword("123456");

        user = User.builder()
                .id(UUID.randomUUID())
                .name("Bruna")
                .email("bruna@email.com")
                .password("hashed_password")
                .build();
    }

    @Test
    void register_shouldReturnTokenWhenEmailNotExists() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(false);
        when(passwordEncoder.encode(any())).thenReturn("hashed_password");
        when(userRepository.save(any(User.class))).thenReturn(user);
        when(jwtService.generateToken(user.getEmail())).thenReturn("fake_token");

        AuthResponse response = authService.register(registerRequest);

        assertThat(response.getToken()).isEqualTo("fake_token");
        assertThat(response.getEmail()).isEqualTo("bruna@email.com");
        assertThat(response.getName()).isEqualTo("Bruna");
        verify(userRepository).save(any(User.class));
    }

    @Test
    void register_shouldThrowWhenEmailAlreadyExists() {
        when(userRepository.existsByEmail(registerRequest.getEmail())).thenReturn(true);

        assertThatThrownBy(() -> authService.register(registerRequest))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Email já cadastrado");

        verify(userRepository, never()).save(any());
    }

    @Test
    void login_shouldReturnTokenWhenCredentialsAreValid() {
        when(userRepository.findByEmail(loginRequest.getEmail())).thenReturn(Optional.of(user));
        when(jwtService.generateToken(user.getEmail())).thenReturn("fake_token");

        AuthResponse response = authService.login(loginRequest);

        assertThat(response.getToken()).isEqualTo("fake_token");
        assertThat(response.getEmail()).isEqualTo("bruna@email.com");
        verify(authenticationManager).authenticate(any(UsernamePasswordAuthenticationToken.class));
    }
}