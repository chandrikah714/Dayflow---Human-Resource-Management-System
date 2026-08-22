package com.dayflow.hrms.dto;

import com.dayflow.hrms.entity.LeaveRequest;

import java.time.LocalDate;
import java.time.LocalDateTime;

public class LeaveResponse {
    private Long id;
    private Long employeeId;
    private String employeeName;
    private String leaveType;
    private LocalDate fromDate;
    private LocalDate toDate;
    private String reason;
    private String status;
    private String adminComment;
    private LocalDateTime createdAt;

    public static LeaveResponse from(LeaveRequest lr) {
        LeaveResponse r = new LeaveResponse();
        r.id = lr.getId();
        r.employeeId = lr.getEmployee().getId();
        r.employeeName = lr.getEmployee().getName();
        r.leaveType = lr.getLeaveType().name();
        r.fromDate = lr.getFromDate();
        r.toDate = lr.getToDate();
        r.reason = lr.getReason();
        r.status = lr.getStatus().name();
        r.adminComment = lr.getAdminComment();
        r.createdAt = lr.getCreatedAt();
        return r;
    }

    public Long getId() { return id; }
    public Long getEmployeeId() { return employeeId; }
    public String getEmployeeName() { return employeeName; }
    public String getLeaveType() { return leaveType; }
    public LocalDate getFromDate() { return fromDate; }
    public LocalDate getToDate() { return toDate; }
    public String getReason() { return reason; }
    public String getStatus() { return status; }
    public String getAdminComment() { return adminComment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}
