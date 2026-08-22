package com.odoo.backend.dto;

import com.odoo.backend.entity.Employee;
import com.odoo.backend.entity.Role;

import java.time.LocalDate;

public record EmployeeResponse(
        Long id,
        String employeeCode,
        String fullName,
        String email,
        Role role,
        String phone,
        String address,
        String department,
        String designation,
        LocalDate dateOfJoining,
        String profilePictureUrl,
        boolean active,
        boolean emailVerified
) {
    public static EmployeeResponse from(Employee e) {
        return new EmployeeResponse(
                e.getId(), e.getEmployeeCode(), e.getFullName(), e.getEmail(), e.getRole(),
                e.getPhone(), e.getAddress(), e.getDepartment(), e.getDesignation(),
                e.getDateOfJoining(), e.getProfilePictureUrl(), e.isActive(), e.isEmailVerified()
        );
    }
}