package com.odoo.backend.repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import com.odoo.backend.entity.Attendance;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {
    List<Attendance> findByEmployeeIdAndDateBetweenOrderByDateAsc(
        Long employeeId,
        LocalDate startDate,
        LocalDate endDate
);

    Optional<Attendance> findByEmployeeIdAndDate(
            Long employeeId,
            LocalDate date
    );

    List<Attendance> findByEmployeeIdOrderByDateDesc(
            Long employeeId
    );

    List<Attendance> findAllByOrderByDateDesc();
}
