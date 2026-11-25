
package com.vitalis_backend.dto;

import jakarta.validation.constraints.*;

public class SymptomRequest {

    @NotBlank
    private String symptomName;

    @NotBlank
    private String severity;

    @NotNull
    @Min(1)
    private Integer duration;

    private String notes;

    public String getSymptomName() {
        return symptomName;
    }

    public void setSymptomName(String symptomName) {
        this.symptomName = symptomName;
    }

    public String getSeverity() {
        return severity;
    }

    public void setSeverity(String severity) {
        this.severity = severity;
    }

    public Integer getDuration() {
        return duration;
    }

    public void setDuration(Integer duration) {
        this.duration = duration;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
