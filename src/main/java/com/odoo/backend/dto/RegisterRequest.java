package com.odoo.backend.dto;

import com.odoo.backend.entity.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterRequest(
        @NotBlank(message = "Full name is required") String fullName,
        @NotBlank @Email(message = "A valid email is required") String email,
        @NotBlank @Size(min = 8, message = "Password must be at least 8 characters") String password,
        Role role,
        String department,
        String designation
) {}