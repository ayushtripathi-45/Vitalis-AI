
package com.vitalis_backend.dto;

import java.util.Map;

public class PredictionRequest {

    private Map<String, Object> features;

    public Map<String, Object> getFeatures() {
        return features;
    }

    public void setFeatures(Map<String, Object> features) {
        this.features = features;
    }
}
