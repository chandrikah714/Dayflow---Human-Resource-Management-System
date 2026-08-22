package com.odoo.backend.controller;
import com.odoo.backend.dto.EmployeeResponse;
import com.odoo.backend.dto.RegisterRequest;
import com.odoo.backend.entity.Employee;
import com.odoo.backend.entity.Role;
import com.odoo.backend.repository.EmployeeRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;
import java.util.Locale;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/employees") public class EmployeeController {
  private final EmployeeRepository employees; private final PasswordEncoder passwords;
  EmployeeController(EmployeeRepository employees, PasswordEncoder passwords) { this.employees = employees; this.passwords = passwords; }
  @GetMapping public List<EmployeeResponse> list() { return employees.findAll().stream().map(EmployeeResponse::from).toList(); }
  @PostMapping @ResponseStatus(HttpStatus.CREATED) public EmployeeResponse create(@Valid @RequestBody RegisterRequest input, HttpSession session) {
    requireAdmin(session); String email = input.email().trim().toLowerCase(Locale.ROOT); if (employees.existsByEmail(email)) throw new IllegalArgumentException("Email is already registered.");
    Employee employee = new Employee(); employee.setFullName(input.fullName().trim()); employee.setEmail(email); employee.setPassword(passwords.encode(input.password())); employee.setRole(input.role() == Role.ADMIN ? Role.ADMIN : Role.EMPLOYEE); employee.setEmployeeCode("EMP-" + (System.currentTimeMillis() % 1_000_000)); employee.setDepartment(input.department()); employee.setDesignation(input.designation()); return EmployeeResponse.from(employees.save(employee));
  }
  private void requireAdmin(HttpSession session) { Object id = session.getAttribute("employeeId"); if (!(id instanceof Long)) throw new IllegalStateException("Please sign in."); Employee user = employees.findById((Long) id).orElseThrow(() -> new IllegalStateException("Account not found.")); if (user.getRole() != Role.ADMIN) throw new SecurityException("Administrator access required."); }
}
