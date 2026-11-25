
package com.vitalis_backend.dto;

public class PatientResponse {

    private Long id;
    private Integer age;
    private String gender;
    private Double height;
    private Double weight;
    private Double bmi;
    private String existingMedicalConditions;
    private String medications;
    private String allergies;

    public PatientResponse(Long id, Integer age, String gender,
                           Double height, Double weight, Double bmi,
                           String existingMedicalConditions,
                           String medications, String allergies) {

        this.id = id;
        this.age = age;
        this.gender = gender;
        this.height = height;
        this.weight = weight;
        this.bmi = bmi;
        this.existingMedicalConditions = existingMedicalConditions;
        this.medications = medications;
        this.allergies = allergies;
    }

    public Long getId() { return id; }
    public Integer getAge() { return age; }
    public String getGender() { return gender; }
    public Double getHeight() { return height; }
    public Double getWeight() { return weight; }
    public Double getBmi() { return bmi; }
    public String getExistingMedicalConditions() { return existingMedicalConditions; }
    public String getMedications() { return medications; }
    public String getAllergies() { return allergies; }
}

