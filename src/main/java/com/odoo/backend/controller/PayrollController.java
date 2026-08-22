package com.odoo.backend.controller;
import com.odoo.backend.dto.SalaryRequest;
import com.odoo.backend.entity.Employee;
import com.odoo.backend.entity.Role;
import com.odoo.backend.entity.Salary;
import com.odoo.backend.repository.EmployeeRepository;
import com.odoo.backend.repository.SalaryRepository;
import jakarta.servlet.http.HttpSession;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/payroll") public class PayrollController {
  private final SalaryRepository salaries; private final EmployeeRepository employees;
  PayrollController(SalaryRepository salaries, EmployeeRepository employees) { this.salaries = salaries; this.employees = employees; }
  @GetMapping("/me") Salary mine(HttpSession session) { return salaries.findByEmployeeId(current(session).getId()).orElseGet(() -> empty(current(session).getId())); }
  @GetMapping List<Salary> all(HttpSession session) { admin(session); return salaries.findAll(); }
  @PutMapping("/{employeeId}") Salary save(@PathVariable Long employeeId, @RequestBody SalaryRequest input, HttpSession session) { Employee admin = admin(session); Salary salary = salaries.findByEmployeeId(employeeId).orElseGet(() -> empty(employeeId)); salary.setBasic(zero(input.basic())); salary.setHra(zero(input.hra())); salary.setAllowances(zero(input.allowances())); salary.setDeductions(zero(input.deductions())); salary.setUpdatedAt(LocalDateTime.now()); salary.setUpdatedBy(admin.getId()); return salaries.save(salary); }
  private Salary empty(Long employeeId) { Salary salary = new Salary(); salary.setEmployeeId(employeeId); return salary; }
  private BigDecimal zero(BigDecimal value) { return value == null ? BigDecimal.ZERO : value; }
  private Employee current(HttpSession session) { Object id = session.getAttribute("employeeId"); if (!(id instanceof Long)) throw new IllegalStateException("Please sign in."); return employees.findById((Long) id).orElseThrow(() -> new IllegalStateException("Account not found.")); }
  private Employee admin(HttpSession session) { Employee user = current(session); if (user.getRole() != Role.ADMIN) throw new SecurityException("Administrator access required."); return user; }
}
