package com.odoo.backend.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.odoo.backend.entity.Attendance;
import com.odoo.backend.service.AttendanceService;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

    private final AttendanceService attendanceService;

    public AttendanceController(AttendanceService attendanceService) {
        this.attendanceService = attendanceService;
    }

    @GetMapping("/my/weekly")
public List<Attendance> getWeeklyAttendance(
        @RequestParam Long employeeId,
        @RequestParam String startDate,
        @RequestParam String endDate) {

    return attendanceService.getWeeklyAttendance(
            employeeId,
            LocalDate.parse(startDate),
            LocalDate.parse(endDate)
    );
}

    // Check In
    @PostMapping("/check-in")
    public Attendance checkIn(@RequestParam Long employeeId) {
        return attendanceService.checkIn(employeeId);
    }

    // Check Out
    @PostMapping("/check-out")
    public Attendance checkOut(@RequestParam Long employeeId) {
        return attendanceService.checkOut(employeeId);
    }

    // My Attendance
    @GetMapping("/my")
    public List<Attendance> getMyAttendance(
            @RequestParam Long employeeId) {

        return attendanceService.getMyAttendance(employeeId);
    }

    /** Returns today's row, or JSON null when the employee has not checked in. */
    @GetMapping("/today")
    public Attendance getTodayAttendance(@RequestParam Long employeeId) {
        return attendanceService.getTodayAttendance(employeeId);
    }

    // Employee Attendance
    @GetMapping("/employee/{id}")
    public List<Attendance> getEmployeeAttendance(
            @PathVariable Long id) {

        return attendanceService.getEmployeeAttendance(id);
    }

    // Admin - All Attendance
    @GetMapping("/all")
    public List<Attendance> getAllAttendance() {

        return attendanceService.getAllAttendance();
    }

    @GetMapping("/my/daily")
public Attendance getDailyAttendance(
        @RequestParam Long employeeId,
        @RequestParam String date) {

    return attendanceService.getDailyAttendance(
            employeeId,
            LocalDate.parse(date)
    );
}
}
