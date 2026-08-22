package com.odoo.backend.controller;

import com.odoo.backend.dto.EmployeeResponse;
import com.odoo.backend.dto.LoginRequest;
import com.odoo.backend.dto.RegisterRequest;
import com.odoo.backend.entity.Employee;
import com.odoo.backend.entity.Role;
import com.odoo.backend.repository.EmployeeRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;

@RestController @RequestMapping("/api/auth")
public class AuthController {
  private final EmployeeRepository employees; private final PasswordEncoder passwords;
  AuthController(EmployeeRepository employees, PasswordEncoder passwords) { this.employees = employees; this.passwords = passwords; }
  @PostMapping("/register") @ResponseStatus(HttpStatus.CREATED)
  EmployeeResponse register(@Valid @RequestBody RegisterRequest input, HttpSession session) {
    if (employees.count() > 0) throw new SecurityException("Only an administrator can add employees after initial setup.");
    String email = input.email().trim().toLowerCase(Locale.ROOT);
    if (employees.existsByEmail(email)) throw new IllegalArgumentException("Email is already registered.");
    Employee employee = new Employee(); employee.setFullName(input.fullName().trim()); employee.setEmail(email);
    employee.setPassword(passwords.encode(input.password())); employee.setRole(Role.ADMIN);
    employee.setEmployeeCode("EMP-" + (System.currentTimeMillis() % 1_000_000)); employee.setDepartment(input.department()); employee.setDesignation(input.designation());
    employee = employees.save(employee); session.setAttribute("employeeId", employee.getId()); return EmployeeResponse.from(employee);
  }
  @PostMapping("/login") EmployeeResponse login(@Valid @RequestBody LoginRequest input, HttpSession session) {
    Employee employee = employees.findByEmail(input.email().trim().toLowerCase(Locale.ROOT)).orElseThrow(() -> new IllegalArgumentException("Invalid email or password."));
    if (!passwords.matches(input.password(), employee.getPassword())) throw new IllegalArgumentException("Invalid email or password.");
    session.setAttribute("employeeId", employee.getId()); return EmployeeResponse.from(employee);
  }
  @GetMapping("/me") EmployeeResponse me(HttpSession session) { return EmployeeResponse.from(current(session)); }
  @PostMapping("/logout") @ResponseStatus(HttpStatus.NO_CONTENT) void logout(HttpSession session) { session.invalidate(); }
  private Employee current(HttpSession session) { Object id = session.getAttribute("employeeId"); if (!(id instanceof Long)) throw new IllegalStateException("Please sign in."); return employees.findById((Long) id).orElseThrow(() -> new IllegalStateException("Account not found.")); }
}
