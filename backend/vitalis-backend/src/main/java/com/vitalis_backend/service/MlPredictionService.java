
package com.vitalis_backend.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import tools.jackson.databind.ObjectMapper;

import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

@Service
public class MlPredictionService {

    private final String mlApiUrl;
    private final HttpClient httpClient;
    private final ObjectMapper objectMapper;

    public MlPredictionService(
            @Value("${ml.api.url}") String mlApiUrl) {

        this.mlApiUrl = mlApiUrl;

        this.httpClient = HttpClient.newBuilder()
                .version(HttpClient.Version.HTTP_1_1)
                .build();

        this.objectMapper = new ObjectMapper();
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> getFeatures() {

        try {
            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(mlApiUrl + "/features"))
                    .GET()
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            if (response.statusCode() != 200) {
                throw new RuntimeException(
                        "ML API error: " + response.body()
                );
            }

            return objectMapper.readValue(
                    response.body(),
                    Map.class
            );

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to fetch ML features", e
            );
        }
    }

    @SuppressWarnings("unchecked")
    public Map<String, Object> predict(
            Map<String, Object> inputFeatures) {

        try {
            Map<String, Object> featureResponse = getFeatures();

            List<String> features =
                    (List<String>) featureResponse.get("features");

            Map<String, Object> completeFeatures =
                    new LinkedHashMap<>();

            for (String feature : features) {
                completeFeatures.put(
                        feature,
                        inputFeatures.getOrDefault(feature, 0)
                );
            }

            Map<String, Object> requestBody =
                    Map.of("features", completeFeatures);

            String jsonBody =
                    objectMapper.writeValueAsString(requestBody);

            System.out.println("JSON BODY SIZE: " + jsonBody.length());

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create(mlApiUrl + "/predict"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(jsonBody))
                    .build();

            HttpResponse<String> response = httpClient.send(
                    request,
                    HttpResponse.BodyHandlers.ofString()
            );

            System.out.println("ML API STATUS: " + response.statusCode());
            System.out.println("ML API RESPONSE: " + response.body());

            if (response.statusCode() < 200 ||
                    response.statusCode() >= 300) {

                throw new RuntimeException(
                        "ML prediction failed: " + response.body()
                );
            }

            return objectMapper.readValue(
                    response.body(),
                    Map.class
            );

        } catch (Exception e) {
            throw new RuntimeException(
                    "Failed to get prediction from ML API", e
            );
        }
    }
}
