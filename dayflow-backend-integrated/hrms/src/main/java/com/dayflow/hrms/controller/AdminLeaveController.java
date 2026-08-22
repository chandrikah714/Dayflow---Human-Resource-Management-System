package com.dayflow.hrms.controller;

import com.dayflow.hrms.dto.AdminActionRequest;
import com.dayflow.hrms.dto.LeaveResponse;
import com.dayflow.hrms.entity.LeaveRequest;
import com.dayflow.hrms.service.LeaveService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/leaves")
public class AdminLeaveController {

    private final LeaveService leaveService;

    public AdminLeaveController(LeaveService leaveService) {
        this.leaveService = leaveService;
    }

    @GetMapping
    public ResponseEntity<List<LeaveResponse>> getAllLeaves() {
        List<LeaveResponse> leaves = leaveService.getAllLeaves()
                .stream()
                .map(LeaveResponse::from)
                .toList();
        return ResponseEntity.ok(leaves);
    }

    @PutMapping("/{id}/approve")
    public ResponseEntity<LeaveResponse> approveLeave(
            @PathVariable Long id,
            @RequestBody(required = false) AdminActionRequest body) {

        String comment = (body != null) ? body.getAdminComment() : null;
        LeaveRequest updated = leaveService.approveLeave(id, comment);
        return ResponseEntity.ok(LeaveResponse.from(updated));
    }

    @PutMapping("/{id}/reject")
    public ResponseEntity<LeaveResponse> rejectLeave(
            @PathVariable Long id,
            @RequestBody(required = false) AdminActionRequest body) {

        String comment = (body != null) ? body.getAdminComment() : null;
        LeaveRequest updated = leaveService.rejectLeave(id, comment);
        return ResponseEntity.ok(LeaveResponse.from(updated));
    }
}
