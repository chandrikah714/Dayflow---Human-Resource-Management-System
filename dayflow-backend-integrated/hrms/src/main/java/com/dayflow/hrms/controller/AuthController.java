package com.dayflow.hrms.controller;

import com.dayflow.hrms.dto.AuthResponse;
import com.dayflow.hrms.dto.LoginRequest;
import com.dayflow.hrms.dto.RegisterRequest;
import com.dayflow.hrms.entity.Employee;
import com.dayflow.hrms.enums.Role;
import com.dayflow.hrms.exception.EmailAlreadyExistsException;
import com.dayflow.hrms.exception.InvalidCredentialsException;
import com.dayflow.hrms.repository.EmployeeRepository;
import com.dayflow.hrms.security.JwtUtil;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final EmployeeRepository employeeRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;

    public AuthController(EmployeeRepository employeeRepository,
                           PasswordEncoder passwordEncoder,
                           JwtUtil jwtUtil) {
        this.employeeRepository = employeeRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody RegisterRequest req) {
        if (req.getEmail() == null || req.getEmail().isBlank()
                || req.getPassword() == null || req.getPassword().isBlank()
                || req.getName() == null || req.getName().isBlank()) {
            throw new InvalidCredentialsException("Name, email and password are required.");
        }

        String email = req.getEmail().trim().toLowerCase();

        if (employeeRepository.existsByEmail(email)) {
            throw new EmailAlreadyExistsException("An account with this email already exists.");
        }

        Role role = Role.EMPLOYEE;
        if (req.getRole() != null && req.getRole().equalsIgnoreCase("admin")) {
            role = Role.ADMIN;
        }

        Employee employee = new Employee();
        employee.setName(req.getName().trim());
        employee.setEmail(email);
        employee.setPassword(passwordEncoder.encode(req.getPassword()));
        employee.setRole(role);

        Employee saved = employeeRepository.save(employee);

        String token = jwtUtil.generateToken(saved.getEmail(), saved.getRole().name(), saved.getId());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(new AuthResponse(token, saved.getId(), saved.getName(), saved.getEmail(), saved.getRole().name()));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody LoginRequest req) {
        if (req.getEmail() == null || req.getPassword() == null) {
            throw new InvalidCredentialsException("Email and password are required.");
        }

        String email = req.getEmail().trim().toLowerCase();

        Employee employee = employeeRepository.findByEmail(email)
                .orElseThrow(() -> new InvalidCredentialsException("Invalid email or password."));

        if (!passwordEncoder.matches(req.getPassword(), employee.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password.");
        }

        String token = jwtUtil.generateToken(employee.getEmail(), employee.getRole().name(), employee.getId());
        return ResponseEntity.ok(new AuthResponse(token, employee.getId(), employee.getName(), employee.getEmail(), employee.getRole().name()));
    }
}
