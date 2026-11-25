
package com.vitalis_backend.controller;

import com.vitalis_backend.dto.SymptomRequest;
import com.vitalis_backend.dto.SymptomResponse;
import com.vitalis_backend.service.SymptomService;

import jakarta.validation.Valid;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/symptoms")
public class SymptomController {

    private final SymptomService symptomService;

    public SymptomController(SymptomService symptomService) {
        this.symptomService = symptomService;
    }

    @PostMapping("/save")
    public ResponseEntity<List<SymptomResponse>> saveSymptoms(
            @Valid @RequestBody List<@Valid SymptomRequest> requests,
            Authentication authentication) {

        return ResponseEntity.ok(
                symptomService.saveSymptoms(authentication.getName(), requests)
        );
    }

    @GetMapping
    public ResponseEntity<List<SymptomResponse>> getSymptoms(
            Authentication authentication) {

        return ResponseEntity.ok(
                symptomService.getSymptoms(authentication.getName())
        );
    }
}
