package com.odoo.backend.dto;

// Self-service edit — matches spec 3.3.2: employees may only touch these fields.
public record UpdateProfileRequest(String phone, String address, String profilePictureUrl) {}