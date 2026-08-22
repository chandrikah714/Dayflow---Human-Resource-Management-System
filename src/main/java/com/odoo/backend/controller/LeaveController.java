package com.odoo.backend.controller;
import com.odoo.backend.dto.CreateLeaveRequest;
import com.odoo.backend.entity.LeaveRequest;
import com.odoo.backend.entity.LeaveStatus;
import com.odoo.backend.repository.LeaveRepository;
import jakarta.servlet.http.HttpSession;
import jakarta.validation.Valid;
import java.util.List;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
@RestController @RequestMapping("/api/leaves") public class LeaveController {
  private final LeaveRepository leaves; LeaveController(LeaveRepository leaves) { this.leaves = leaves; }
  @GetMapping public List<LeaveRequest> mine(HttpSession session) { return leaves.findByEmployeeIdOrderByAppliedAtDesc(userId(session)); }
  @PostMapping @ResponseStatus(HttpStatus.CREATED) public LeaveRequest create(@Valid @RequestBody CreateLeaveRequest input, HttpSession session) {
    if (input.endDate().isBefore(input.startDate())) throw new IllegalArgumentException("End date must be on or after start date.");
    LeaveRequest leave = new LeaveRequest(); leave.setEmployeeId(userId(session)); leave.setLeaveType(input.leaveType()); leave.setStartDate(input.startDate()); leave.setEndDate(input.endDate()); leave.setRemarks(input.remarks()); leave.setStatus(LeaveStatus.PENDING); return leaves.save(leave);
  }
  private Long userId(HttpSession session) { Object value = session.getAttribute("employeeId"); if (!(value instanceof Long)) throw new IllegalStateException("Please sign in."); return (Long) value; }
}
