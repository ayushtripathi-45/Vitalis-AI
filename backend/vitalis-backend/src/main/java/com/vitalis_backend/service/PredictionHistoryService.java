
package com.vitalis_backend.service;

import com.vitalis_backend.entity.Prediction;
import com.vitalis_backend.entity.User;
import com.vitalis_backend.repository.PredictionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PredictionHistoryService {

    private final PredictionRepository predictionRepository;

    public PredictionHistoryService(
            PredictionRepository predictionRepository) {
        this.predictionRepository = predictionRepository;
    }

    public Prediction savePrediction(
            User user,
            String predictedDisease,
            Double confidence) {

        Prediction prediction = new Prediction();

        prediction.setUser(user);
        prediction.setPredictedDisease(predictedDisease);
        prediction.setConfidence(confidence);

        return predictionRepository.save(prediction);
    }

    public List<Prediction> getUserPredictions(User user) {
        return predictionRepository
                .findByUserOrderByCreatedAtDesc(user);
    }
}
