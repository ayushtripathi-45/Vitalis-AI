
package com.vitalis_backend.repository;

import com.vitalis_backend.entity.Symptom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SymptomRepository extends JpaRepository<Symptom, Long> {

    List<Symptom> findByUserEmailIgnoreCase(String email);

    void deleteByUserEmailIgnoreCase(String email);
}
