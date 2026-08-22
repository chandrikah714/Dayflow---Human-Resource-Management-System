package com.dayflow.hrms.controller;

import com.dayflow.hrms.dto.LeaveApplyRequest;
import com.dayflow.hrms.dto.LeaveResponse;
import com.dayflow.hrms.entity.Employee;
import com.dayflow.hrms.entity.LeaveRequest;
import com.dayflow.hrms.enums.LeaveType;
import com.dayflow.hrms.exception.InvalidLeaveRequestException;
import com.dayflow.hrms.service.LeaveService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/leaves")
public class LeaveController {

    private final LeaveService leaveService;

    public LeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @PostMapping
    public ResponseEntity<LeaveResponse> applyLeave(
            @RequestBody LeaveApplyRequest req,
            Authentication authentication) {

        Employee currentEmployee = (Employee) authentication.getPrincipal();

        LeaveRequest entity = new LeaveRequest();
        entity.setLeaveType(parseLeaveType(req.getLeaveType()));
        entity.setFromDate(req.getFromDate());
        entity.setToDate(req.getToDate());
        entity.setReason(req.getReason());

        LeaveRequest saved = leaveService.applyLeave(currentEmployee, entity);
        return ResponseEntity.status(HttpStatus.CREATED).body(LeaveResponse.from(saved));
    }

    @GetMapping("/my")
    public ResponseEntity<List<LeaveResponse>> getMyLeaves(Authentication authentication) {
        Employee currentEmployee = (Employee) authentication.getPrincipal();

        List<LeaveResponse> leaves = leaveService.getMyLeaves(currentEmployee.getId())
                .stream()
                .map(LeaveResponse::from)
                .toList();

        return ResponseEntity.ok(leaves);
    }

    private LeaveType parseLeaveType(String value) {
        if (value == null) {
            throw new InvalidLeaveRequestException("Leave type is required.");
        }
        try {
            return LeaveType.valueOf(value.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new InvalidLeaveRequestException("Unknown leave type: " + value);
        }
    }
}
