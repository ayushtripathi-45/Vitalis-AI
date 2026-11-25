
package com.vitalis_backend.service;

import com.vitalis_backend.dto.SymptomRequest;
import com.vitalis_backend.dto.SymptomResponse;
import com.vitalis_backend.entity.Symptom;
import com.vitalis_backend.entity.User;
import com.vitalis_backend.repository.SymptomRepository;
import com.vitalis_backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class SymptomService {

    private final SymptomRepository symptomRepository;
    private final UserRepository userRepository;

    public SymptomService(SymptomRepository symptomRepository,
                          UserRepository userRepository) {
        this.symptomRepository = symptomRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public List<SymptomResponse> saveSymptoms(
            String email, List<SymptomRequest> requests) {

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        symptomRepository.deleteByUserEmailIgnoreCase(email);

        List<Symptom> symptoms = requests.stream().map(request -> {
            Symptom symptom = new Symptom();

            symptom.setUser(user);
            symptom.setSymptomName(request.getSymptomName());
            symptom.setSeverity(request.getSeverity());
            symptom.setDuration(request.getDuration());
            symptom.setNotes(request.getNotes());

            return symptom;
        }).toList();

        List<Symptom> savedSymptoms = symptomRepository.saveAll(symptoms);

        return savedSymptoms.stream()
                .map(this::convertToResponse)
                .toList();
    }

    public List<SymptomResponse> getSymptoms(String email) {

        List<Symptom> symptoms =
                symptomRepository.findByUserEmailIgnoreCase(email);

        return symptoms.stream()
                .map(this::convertToResponse)
                .toList();
    }

    private SymptomResponse convertToResponse(Symptom symptom) {

        return new SymptomResponse(
                symptom.getId(),
                symptom.getSymptomName(),
                symptom.getSeverity(),
                symptom.getDuration(),
                symptom.getNotes()
        );
    }
}

