package com.odoo.backend.config;

import com.odoo.backend.entity.*;
import com.odoo.backend.repository.*;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

@Configuration
public class DemoDataSeeder {
  @Bean CommandLineRunner demoData(@Value("${app.demo-data:false}") boolean enabled, EmployeeRepository employees, AttendanceRepository attendance, LeaveRepository leaves, SalaryRepository salaries, PasswordEncoder passwords) {
    return args -> { if (!enabled || employees.existsByEmail("maya.patel@dayflow.demo")) return;
      List<Employee> team = List.of(employee("Maya Patel", "maya.patel@dayflow.demo", "Product", "Product Designer", passwords), employee("Arjun Rao", "arjun.rao@dayflow.demo", "Engineering", "Frontend Engineer", passwords), employee("Nisha Kumar", "nisha.kumar@dayflow.demo", "People Ops", "HR Specialist", passwords), employee("Rohan Shah", "rohan.shah@dayflow.demo", "Finance", "Analyst", passwords));
      team = employees.saveAll(team); LocalDate today = LocalDate.now();
      for (int i = 0; i < team.size(); i++) { Employee person = team.get(i); Attendance record = new Attendance(); record.setEmployeeId(person.getId()); record.setDate(today); record.setStatus(i == 3 ? AttendanceStatus.ABSENT : AttendanceStatus.PRESENT); if (i != 3) { record.setCheckIn(LocalDateTime.now().withHour(9 + i).withMinute(10 + i * 5)); if (i == 0) record.setCheckOut(LocalDateTime.now().withHour(18).withMinute(5)); } attendance.save(record); Salary salary = new Salary(); salary.setEmployeeId(person.getId()); salary.setBasic(BigDecimal.valueOf(42000 + i * 5500)); salary.setHra(BigDecimal.valueOf(12000)); salary.setAllowances(BigDecimal.valueOf(3500)); salary.setDeductions(BigDecimal.valueOf(2200)); salaries.save(salary); }
      leave(leaves, team.get(0), LeaveType.PAID, today.plusDays(4), today.plusDays(5), "Family travel", LeaveStatus.PENDING); leave(leaves, team.get(1), LeaveType.SICK, today.minusDays(2), today.minusDays(1), "Medical recovery", LeaveStatus.APPROVED); leave(leaves, team.get(2), LeaveType.PAID, today.plusDays(10), today.plusDays(12), "Personal commitment", LeaveStatus.PENDING);
    };
  }
  private Employee employee(String name, String email, String dept, String title, PasswordEncoder passwords) { Employee e = new Employee(); e.setEmployeeCode("DEMO-" + email.substring(0, 3).toUpperCase()); e.setFullName(name); e.setEmail(email); e.setPassword(passwords.encode("DayflowDemo123")); e.setRole(Role.EMPLOYEE); e.setDepartment(dept); e.setDesignation(title); return e; }
  private void leave(LeaveRepository repo, Employee employee, LeaveType type, LocalDate start, LocalDate end, String note, LeaveStatus status) { LeaveRequest r = new LeaveRequest(); r.setEmployeeId(employee.getId()); r.setLeaveType(type); r.setStartDate(start); r.setEndDate(end); r.setRemarks(note); r.setStatus(status); repo.save(r); }
}
