package com.odoo.backend.dto;
import com.odoo.backend.entity.LeaveType;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;
public record CreateLeaveRequest(@NotNull LeaveType leaveType, @NotNull LocalDate startDate, @NotNull LocalDate endDate, String remarks) {}
