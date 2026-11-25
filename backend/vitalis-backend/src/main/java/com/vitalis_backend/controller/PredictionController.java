
package com.vitalis_backend.controller;

import com.vitalis_backend.dto.PredictionRequest;
import com.vitalis_backend.entity.User;
import com.vitalis_backend.repository.UserRepository;
import com.vitalis_backend.service.MlPredictionService;
import com.vitalis_backend.service.PredictionHistoryService;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/prediction")
public class PredictionController {

    private final MlPredictionService mlPredictionService;
    private final PredictionHistoryService predictionHistoryService;
    private final UserRepository userRepository;

    public PredictionController(
            MlPredictionService mlPredictionService,
            PredictionHistoryService predictionHistoryService,
            UserRepository userRepository) {

        this.mlPredictionService = mlPredictionService;
        this.predictionHistoryService = predictionHistoryService;
        this.userRepository = userRepository;
    }

    @PostMapping("/predict")
    public ResponseEntity<Map<String, Object>> predict(
            @RequestBody PredictionRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() ->
                        new RuntimeException("User not found"));

        Map<String, Object> result =
                mlPredictionService.predict(request.getFeatures());

        String predictedDisease =
                (String) result.get("predicted_disease");

        Double confidence =
                ((Number) result.get("confidence")).doubleValue();

        predictionHistoryService.savePrediction(
                user,
                predictedDisease,
                confidence
        );

        return ResponseEntity.ok(result);
    }
}
