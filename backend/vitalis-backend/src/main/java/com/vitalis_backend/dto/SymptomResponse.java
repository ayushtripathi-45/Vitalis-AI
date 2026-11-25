
package com.vitalis_backend.dto;

public class SymptomResponse {

    private Long id;
    private String symptomName;
    private String severity;
    private Integer duration;
    private String notes;

    public SymptomResponse(Long id, String symptomName,
                           String severity, Integer duration,
                           String notes) {
        this.id = id;
        this.symptomName = symptomName;
        this.severity = severity;
        this.duration = duration;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public String getSymptomName() {
        return symptomName;
    }

    public String getSeverity() {
        return severity;
    }

    public Integer getDuration() {
        return duration;
    }

    public String getNotes() {
        return notes;
    }
}
