
package com.vitalis_backend.controller;

import com.vitalis_backend.entity.Prediction;
import com.vitalis_backend.entity.User;
import com.vitalis_backend.repository.UserRepository;
import com.vitalis_backend.service.PredictionHistoryService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/prediction")
public class PredictionHistoryController {

    private final PredictionHistoryService predictionHistoryService;
    private final UserRepository userRepository;

    public PredictionHistoryController(
            PredictionHistoryService predictionHistoryService,
            UserRepository userRepository) {

        this.predictionHistoryService = predictionHistoryService;
        this.userRepository = userRepository;
    }

    @GetMapping("/history")
    public ResponseEntity<?> getPredictionHistory(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        List<Prediction> predictions =
                predictionHistoryService.getUserPredictions(user);

        List<Map<String, Object>> response = predictions.stream()
                .map(prediction -> Map.<String, Object>of(
                        "id", prediction.getId(),
                        "predictedDisease", prediction.getPredictedDisease(),
                        "confidence", prediction.getConfidence(),
                        "createdAt", prediction.getCreatedAt()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }
}
