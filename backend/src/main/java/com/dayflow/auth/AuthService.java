package com.dayflow.auth;

import com.dayflow.user.*;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

@Service
public class AuthService {
    private final UserRepository users; private final PasswordEncoder encoder; private final JwtService jwt;
    public AuthService(UserRepository users, PasswordEncoder encoder, JwtService jwt) { this.users = users; this.encoder = encoder; this.jwt = jwt; }
    public AuthResult register(String employeeId, String name, String email, String password, Role role) {
        if (users.existsByEmailIgnoreCase(email)) throw new ResponseStatusException(HttpStatus.CONFLICT, "An account with this email already exists.");
        if (users.existsByEmployeeId(employeeId)) throw new ResponseStatusException(HttpStatus.CONFLICT, "This employee ID is already registered.");
        User u = new User(); u.setEmployeeId(employeeId.trim()); u.setName(name.trim()); u.setEmail(email.trim().toLowerCase()); u.setPassword(encoder.encode(password)); u.setRole(role); users.save(u);
        return new AuthResult(jwt.generateToken(u), u);
    }
    public AuthResult login(String email, String password) {
        User u = users.findByEmailIgnoreCase(email).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password."));
        if (!encoder.matches(password, u.getPassword())) throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid email or password.");
        return new AuthResult(jwt.generateToken(u), u);
    }
    public record AuthResult(String token, User user) {}
}