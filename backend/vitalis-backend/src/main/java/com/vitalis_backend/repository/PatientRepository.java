
package com.vitalis_backend.repository;

import com.vitalis_backend.entity.Patient;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface PatientRepository extends JpaRepository<Patient, Long> {

    Optional<Patient> findByUserEmailIgnoreCase(String email);
}
