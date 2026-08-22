package com.dayflow.hrms.security;

import com.dayflow.hrms.entity.Employee;
import com.dayflow.hrms.repository.EmployeeRepository;
import io.jsonwebtoken.Claims;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.lang.NonNull;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.List;
import java.util.Optional;

@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private final JwtUtil jwtUtil;
    private final EmployeeRepository employeeRepository;

    public JwtAuthFilter(JwtUtil jwtUtil, EmployeeRepository employeeRepository) {
        this.jwtUtil = jwtUtil;
        this.employeeRepository = employeeRepository;
    }

    @Override
    protected void doFilterInternal(@NonNull HttpServletRequest request,
                                     @NonNull HttpServletResponse response,
                                     @NonNull FilterChain filterChain) throws ServletException, IOException {

        String header = request.getHeader("Authorization");

        if (header != null && header.startsWith("Bearer ")) {
            String token = header.substring(7);

            if (jwtUtil.isValid(token)) {
                Claims claims = jwtUtil.parseClaims(token);
                String email = claims.getSubject();

                if (SecurityContextHolder.getContext().getAuthentication() == null) {
                    Optional<Employee> employeeOpt = employeeRepository.findByEmail(email);

                    employeeOpt.ifPresent(employee -> {
                        var authorities = List.of(new SimpleGrantedAuthority("ROLE_" + employee.getRole().name()));
                        var authToken = new UsernamePasswordAuthenticationToken(employee, null, authorities);
                        SecurityContextHolder.getContext().setAuthentication(authToken);
                    });
                }
            }
        }

        filterChain.doFilter(request, response);
    }
}
