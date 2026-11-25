
package com.vitalis_backend.service;

import com.vitalis_backend.dto.PatientRequest;
import com.vitalis_backend.dto.PatientResponse;
import com.vitalis_backend.entity.Patient;
import com.vitalis_backend.entity.User;
import com.vitalis_backend.repository.PatientRepository;
import com.vitalis_backend.repository.UserRepository;

import org.springframework.stereotype.Service;

@Service
public class PatientService {

    private final PatientRepository patientRepository;
    private final UserRepository userRepository;

    public PatientService(PatientRepository patientRepository,
                          UserRepository userRepository) {
        this.patientRepository = patientRepository;
        this.userRepository = userRepository;
    }

    public PatientResponse savePatient(String email, PatientRequest request) {

        User user = userRepository.findByEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Patient patient = patientRepository.findByUserEmailIgnoreCase(email)
                .orElse(new Patient());

        double heightInMeters = request.getHeight() / 100.0;
        double bmi = request.getWeight() / (heightInMeters * heightInMeters);

        patient.setUser(user);
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setHeight(request.getHeight());
        patient.setWeight(request.getWeight());
        patient.setBmi(Math.round(bmi * 100.0) / 100.0);
        patient.setExistingMedicalConditions(request.getExistingMedicalConditions());
        patient.setMedications(request.getMedications());
        patient.setAllergies(request.getAllergies());

        Patient savedPatient = patientRepository.save(patient);

        return convertToResponse(savedPatient);
    }

    public PatientResponse getPatient(String email) {

        Patient patient = patientRepository.findByUserEmailIgnoreCase(email)
                .orElseThrow(() -> new RuntimeException("Patient profile not found"));

        return convertToResponse(patient);
    }

    private PatientResponse convertToResponse(Patient patient) {

        return new PatientResponse(
                patient.getId(),
                patient.getAge(),
                patient.getGender(),
                patient.getHeight(),
                patient.getWeight(),
                patient.getBmi(),
                patient.getExistingMedicalConditions(),
                patient.getMedications(),
                patient.getAllergies()
        );
    }
}
