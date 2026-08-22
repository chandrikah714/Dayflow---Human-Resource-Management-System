package com.odoo.backend.controller;
import com.odoo.backend.dto.LeaveDecisionRequest;
import com.odoo.backend.entity.*;
import com.odoo.backend.repository.EmployeeRepository;
import com.odoo.backend.repository.LeaveRepository;
import jakarta.servlet.http.HttpSession;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/admin/leaves") public class AdminLeaveController {
  private final LeaveRepository leaves; private final EmployeeRepository employees;
  AdminLeaveController(LeaveRepository leaves, EmployeeRepository employees) { this.leaves = leaves; this.employees = employees; }
  @GetMapping List<LeaveRequest> all(HttpSession session) { admin(session); return leaves.findAll(); }
  @PatchMapping("/{id}") LeaveRequest decide(@PathVariable Long id, @RequestBody LeaveDecisionRequest input, HttpSession session) { Employee admin = admin(session); LeaveRequest leave = leaves.findById(id).orElseThrow(() -> new IllegalArgumentException("Leave request not found.")); leave.setStatus(input.approved() ? LeaveStatus.APPROVED : LeaveStatus.REJECTED); leave.setAdminComment(input.comment()); leave.setDecidedAt(LocalDateTime.now()); leave.setDecidedBy(admin.getId()); return leaves.save(leave); }
  private Employee admin(HttpSession session) { Object id = session.getAttribute("employeeId"); if (!(id instanceof Long)) throw new IllegalStateException("Please sign in."); Employee user = employees.findById((Long) id).orElseThrow(() -> new IllegalStateException("Account not found.")); if (user.getRole() != Role.ADMIN) throw new SecurityException("Administrator access required."); return user; }
}
