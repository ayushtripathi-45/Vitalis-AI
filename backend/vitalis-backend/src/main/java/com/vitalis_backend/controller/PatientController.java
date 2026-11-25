
package com.vitalis_backend.controller;

import com.vitalis_backend.dto.PatientRequest;
import com.vitalis_backend.dto.PatientResponse;
import com.vitalis_backend.service.PatientService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patient")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @PostMapping("/save")
    public ResponseEntity<PatientResponse> savePatient(
            @Valid @RequestBody PatientRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                patientService.savePatient(authentication.getName(), request)
        );
    }

    @GetMapping("/profile")
    public ResponseEntity<PatientResponse> getPatient(
            Authentication authentication) {

        return ResponseEntity.ok(
                patientService.getPatient(authentication.getName())
        );
    }
}
