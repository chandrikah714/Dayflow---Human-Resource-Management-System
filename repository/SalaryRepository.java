package com.odoo.backend.repository;
import com.odoo.backend.entity.Salary;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
public interface SalaryRepository extends JpaRepository<Salary, Long> { Optional<Salary> findByEmployeeId(Long employeeId); }
