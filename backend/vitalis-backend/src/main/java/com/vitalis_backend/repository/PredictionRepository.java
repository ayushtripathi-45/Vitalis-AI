
package com.vitalis_backend.repository;

import com.vitalis_backend.entity.Prediction;
import com.vitalis_backend.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PredictionRepository extends JpaRepository<Prediction, Long> {

    List<Prediction> findByUserOrderByCreatedAtDesc(User user);
}
