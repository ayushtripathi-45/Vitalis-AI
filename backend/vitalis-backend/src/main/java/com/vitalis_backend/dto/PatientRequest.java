
package com.vitalis_backend.dto;

import jakarta.validation.constraints.*;

public class PatientRequest {

    @NotNull
    @Min(1)
    @Max(120)
    private Integer age;

    @NotBlank
    private String gender;

    @NotNull
    @DecimalMin("30.0")
    @DecimalMax("250.0")
    private Double height;

    @NotNull
    @DecimalMin("1.0")
    @DecimalMax("500.0")
    private Double weight;

    private String existingMedicalConditions;

    private String medications;

    private String allergies;

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public String getGender() {
        return gender;
    }

    public void setGender(String gender) {
        this.gender = gender;
    }

    public Double getHeight() {
        return height;
    }

    public void setHeight(Double height) {
        this.height = height;
    }

    public Double getWeight() {
        return weight;
    }

    public void setWeight(Double weight) {
        this.weight = weight;
    }

    public String getExistingMedicalConditions() {
        return existingMedicalConditions;
    }

    public void setExistingMedicalConditions(String existingMedicalConditions) {
        this.existingMedicalConditions = existingMedicalConditions;
    }

    public String getMedications() {
        return medications;
    }

    public void setMedications(String medications) {
        this.medications = medications;
    }

    public String getAllergies() {
        return allergies;
    }

    public void setAllergies(String allergies) {
        this.allergies = allergies;
    }
}
