package com.odoo.backend.dto;
import java.math.BigDecimal;
public record SalaryRequest(BigDecimal basic, BigDecimal hra, BigDecimal allowances, BigDecimal deductions) {}
