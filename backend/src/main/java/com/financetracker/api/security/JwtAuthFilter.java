package com.financetracker.api.security;

import com.financetracker.api.repository.UserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
@RequiredArgsConstructor
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtService jwtService;
    private final UserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        String authHeader = request.getHeader("Authorization");
        System.out.println("=== JwtAuthFilter === URI: " + request.getRequestURI());
        System.out.println("Auth header: " + (authHeader != null ? "presente" : "null"));

        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        String token = authHeader.substring(7);
        System.out.println("Token length: " + token.length());

        try {
            String email = jwtService.extractEmail(token);
            System.out.println("Email extraído: " + email);

            if (email != null && SecurityContextHolder.getContext().getAuthentication() == null) {
                UserDetails user = userRepository.findByEmail(email).orElseThrow();
                System.out.println("Usuário encontrado: " + user.getUsername());

                if (jwtService.isTokenValid(token, email)) {
                    System.out.println("Token válido!");
                    UsernamePasswordAuthenticationToken authToken =
                            new UsernamePasswordAuthenticationToken(user, null, user.getAuthorities());
                    authToken.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));
                    SecurityContextHolder.getContext().setAuthentication(authToken);
                } else {
                    System.out.println("Token INVÁLIDO!");
                }
            }
        } catch (Exception e) {
            System.out.println("ERRO no JwtAuthFilter: " + e.getMessage());
            e.printStackTrace();
        }

        filterChain.doFilter(request, response);
    }