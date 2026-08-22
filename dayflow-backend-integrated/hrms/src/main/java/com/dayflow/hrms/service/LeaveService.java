package com.dayflow.hrms.service;

import com.dayflow.hrms.entity.Employee;
import com.dayflow.hrms.entity.LeaveRequest;
import com.dayflow.hrms.enums.LeaveStatus;
import com.dayflow.hrms.exception.InvalidLeaveRequestException;
import com.dayflow.hrms.exception.LeaveNotFoundException;
import com.dayflow.hrms.repository.LeaveRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class LeaveService {

    private final LeaveRepository leaveRepository;

    @Autowired
    public LeaveService(LeaveRepository leaveRepository) {
        this.leaveRepository = leaveRepository;
    }

    public LeaveRequest applyLeave(Employee employee, LeaveRequest request) {
        validateLeaveRequest(request);
        request.setEmployee(employee);
        request.setStatus(LeaveStatus.PENDING);
        request.setAdminComment(null);
        return leaveRepository.save(request);
    }

    public List<LeaveRequest> getMyLeaves(Long employeeId) {
        return leaveRepository.findByEmployee_IdOrderByCreatedAtDesc(employeeId);
    }

    public List<LeaveRequest> getAllLeaves() {
        return leaveRepository.findAllByOrderByCreatedAtDesc();
    }

    public LeaveRequest approveLeave(Long leaveId, String adminComment) {
        LeaveRequest leave = getLeaveOrThrow(leaveId);
        ensurePending(leave);
        leave.setStatus(LeaveStatus.APPROVED);
        leave.setAdminComment(adminComment);
        return leaveRepository.save(leave);
    }

    public LeaveRequest rejectLeave(Long leaveId, String adminComment) {
        LeaveRequest leave = getLeaveOrThrow(leaveId);
        ensurePending(leave);
        leave.setStatus(LeaveStatus.REJECTED);
        leave.setAdminComment(adminComment);
        return leaveRepository.save(leave);
    }

    private LeaveRequest getLeaveOrThrow(Long leaveId) {
        return leaveRepository.findById(leaveId)
                .orElseThrow(() -> new LeaveNotFoundException(
                        "Leave request not found with id: " + leaveId));
    }

    private void ensurePending(LeaveRequest leave) {
        if (leave.getStatus() != LeaveStatus.PENDING) {
            throw new InvalidLeaveRequestException(
                    "Leave request is already " + leave.getStatus()
                            + " and cannot be processed again.");
        }
    }

    private void validateLeaveRequest(LeaveRequest request) {
        if (request.getLeaveType() == null) {
            throw new InvalidLeaveRequestException("Leave type is required.");
        }
        if (request.getFromDate() == null || request.getToDate() == null) {
            throw new InvalidLeaveRequestException("From date and To date are required.");
        }
        if (request.getFromDate().isAfter(request.getToDate())) {
            throw new InvalidLeaveRequestException("From date cannot be after To date.");
        }
        if (request.getReason() == null || request.getReason().isBlank()) {
            throw new InvalidLeaveRequestException("Reason cannot be empty.");
        }
    }
}
