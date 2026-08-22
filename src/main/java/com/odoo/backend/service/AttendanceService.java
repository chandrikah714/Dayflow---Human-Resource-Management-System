package com.odoo.backend.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;

import com.odoo.backend.entity.Attendance;
import com.odoo.backend.entity.AttendanceStatus;
import com.odoo.backend.repository.AttendanceRepository;

@Service
public class AttendanceService {

        public List<Attendance> getWeeklyAttendance(
        Long employeeId,
        LocalDate startDate,
        LocalDate endDate) {

    return attendanceRepository
            .findByEmployeeIdAndDateBetweenOrderByDateAsc(
                    employeeId,
                    startDate,
                    endDate
            );
}

    private final AttendanceRepository attendanceRepository;

    public AttendanceService(
            AttendanceRepository attendanceRepository) {

        this.attendanceRepository = attendanceRepository;
    }


    // CHECK IN
  public Attendance checkIn(Long employeeId) {

    LocalDate today = LocalDate.now();
    LocalDateTime currentTime = LocalDateTime.now();

    var existingAttendance =
            attendanceRepository
                    .findByEmployeeIdAndDate(
                            employeeId,
                            today
                    );

    if (existingAttendance.isPresent()) {

        Attendance attendance =
                existingAttendance.get();

        if (attendance.getCheckIn() != null) {
            throw new RuntimeException(
                    "You have already checked in today."
            );
        }

        attendance.setCheckIn(currentTime);
        attendance.setStatus(
                AttendanceStatus.PRESENT
        );

        return attendanceRepository.save(attendance);
    }

    Attendance attendance = new Attendance();

    attendance.setEmployeeId(employeeId);
    attendance.setDate(today);
    attendance.setCheckIn(currentTime);
    attendance.setStatus(
            AttendanceStatus.PRESENT
    );

    return attendanceRepository.save(attendance);
}


    // CHECK OUT
 public Attendance checkOut(Long employeeId) {

    LocalDate today = LocalDate.now();
    LocalDateTime currentTime = LocalDateTime.now();

    Attendance attendance =
            attendanceRepository
                    .findByEmployeeIdAndDate(
                            employeeId,
                            today
                    )
                    .orElseThrow(() ->
                            new RuntimeException(
                                    "Please check in first."
                            )
                    );

    if (attendance.getCheckIn() == null) {
        throw new RuntimeException(
                "Please check in first."
        );
    }

    if (attendance.getCheckOut() != null) {
        throw new RuntimeException(
                "You have already checked out today."
        );
    }

    attendance.setCheckOut(currentTime);

    return attendanceRepository.save(attendance);
}


    // TODAY
    public Attendance getTodayAttendance(
            Long employeeId) {

        return attendanceRepository
                .findByEmployeeIdAndDate(
                        employeeId,
                        LocalDate.now()
                )
                .orElse(null);
    }


    // MY ATTENDANCE
    public List<Attendance> getMyAttendance(
            Long employeeId) {

        return attendanceRepository
                .findByEmployeeIdOrderByDateDesc(
                        employeeId
                );
    }


    // EMPLOYEE ATTENDANCE
    public List<Attendance> getEmployeeAttendance(
            Long employeeId) {

        return attendanceRepository
                .findByEmployeeIdOrderByDateDesc(
                        employeeId
                );
    }


    // ALL ATTENDANCE
    public List<Attendance> getAllAttendance() {

        return attendanceRepository
                .findAllByOrderByDateDesc();
    }

    public Attendance getDailyAttendance(
        Long employeeId,
        LocalDate date) {

    return attendanceRepository
            .findByEmployeeIdAndDate(
                    employeeId,
                    date
            )
            .orElse(null);
}
}