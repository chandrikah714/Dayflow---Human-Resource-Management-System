package com.dayflow.auth;

import com.dayflow.user.*;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import java.time.LocalDateTime;

@RestController @RequestMapping("/api")
public class AuthController {
    private final AuthService auth; private final UserRepository users;
    public AuthController(AuthService auth, UserRepository users) { this.auth = auth; this.users = users; }
    @PostMapping("/auth/register") @ResponseStatus(HttpStatus.CREATED)
    public AuthResponse register(@Valid @RequestBody RegisterRequest r) { var result = auth.register(r.employeeId(), r.name(), r.email(), r.password(), r.role()); return response(result); }
    @PostMapping("/auth/login")
    public AuthResponse login(@Valid @RequestBody LoginRequest r) { return response(auth.login(r.email(), r.password())); }
    @GetMapping("/employee/profile")
    public ProfileResponse profile(java.security.Principal principal) { return profileOf(users.findByEmailIgnoreCase(principal.getName()).orElseThrow()); }
    @PutMapping("/employee/profile")
    public ProfileResponse update(java.security.Principal principal, @Valid @RequestBody ProfileUpdate r) {
        User u = users.findByEmailIgnoreCase(principal.getName()).orElseThrow();
        u.setPhone(r.phone()); u.setAddress(r.address()); u.setProfilePicture(r.profilePicture()); return profileOf(users.save(u));
    }
    private AuthResponse response(AuthService.AuthResult r) { return new AuthResponse(r.token(), profileOf(r.user())); }
    private ProfileResponse profileOf(User u) { return new ProfileResponse(u.getId(), u.getEmployeeId(), u.getName(), u.getEmail(), u.getRole(), u.getPhone(), u.getAddress(), u.getProfilePicture(), u.getCreatedAt()); }
    public record RegisterRequest(@NotBlank String employeeId, @NotBlank String name, @Email @NotBlank String email, @Size(min=8) String password, @NotNull Role role) {}
    public record LoginRequest(@Email @NotBlank String email, @NotBlank String password) {}
    public record ProfileUpdate(String phone, String address, String profilePicture) {}
    public record AuthResponse(String token, ProfileResponse user) {}
    public record ProfileResponse(Long id, String employeeId, String name, String email, Role role, String phone, String address, String profilePicture, LocalDateTime createdAt) {}
}