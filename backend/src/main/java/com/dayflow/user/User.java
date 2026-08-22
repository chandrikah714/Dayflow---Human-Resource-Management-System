package com.dayflow.user;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "users", uniqueConstraints = {
    @UniqueConstraint(name = "uk_users_email", columnNames = "email"),
    @UniqueConstraint(name = "uk_users_employee_id", columnNames = "employee_id")
})
public class User {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @Column(name = "employee_id", nullable = false, length = 50) private String employeeId;
    @Column(nullable = false, length = 120) private String name;
    @Column(nullable = false, length = 190) private String email;
    @Column(nullable = false) private String password;
    @Enumerated(EnumType.STRING) @Column(nullable = false, length = 20) private Role role;
    @Column(length = 30) private String phone;
    @Column(columnDefinition = "TEXT") private String address;
    @Column(name = "profile_picture", length = 500) private String profilePicture;
    @Column(name = "created_at", nullable = false, updatable = false) private LocalDateTime createdAt;

    @PrePersist void onCreate() { createdAt = LocalDateTime.now(); }
    public Long getId() { return id; }
    public String getEmployeeId() { return employeeId; } public void setEmployeeId(String v) { employeeId = v; }
    public String getName() { return name; } public void setName(String v) { name = v; }
    public String getEmail() { return email; } public void setEmail(String v) { email = v; }
    public String getPassword() { return password; } public void setPassword(String v) { password = v; }
    public Role getRole() { return role; } public void setRole(Role v) { role = v; }
    public String getPhone() { return phone; } public void setPhone(String v) { phone = v; }
    public String getAddress() { return address; } public void setAddress(String v) { address = v; }
    public String getProfilePicture() { return profilePicture; } public void setProfilePicture(String v) { profilePicture = v; }
    public LocalDateTime getCreatedAt() { return createdAt; }
}