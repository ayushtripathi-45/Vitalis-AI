
console.log("1. RESULT JS FILE LOADED");

document.addEventListener("DOMContentLoaded", async () => {

    console.log("2. DOM CONTENT LOADED");

    try {

        // --------------------------------
        // AUTHENTICATION
        // --------------------------------

        const currentUser = JSON.parse(
            localStorage.getItem("vitalisCurrentUser")
        );

        const patientData = JSON.parse(
            sessionStorage.getItem("vitalisPatientData")
        );

        const symptomsData = JSON.parse(
            sessionStorage.getItem("vitalisSymptomsData")
        );

        const token = localStorage.getItem("vitalisToken");

        console.log("3. AUTHENTICATION DATA", {
            currentUser,
            patientData,
            symptomsData,
            tokenAvailable: !!token
        });

        if (!currentUser || !currentUser.email || !token) {
            console.error("Authentication data or token missing.");
            window.location.href = "login.html";
            return;
        }

        if (
            !patientData ||
            !symptomsData ||
            !patientData.userEmail ||
            patientData.userEmail.toLowerCase() !==
                currentUser.email.toLowerCase()
        ) {
            console.error("Patient or symptom data missing or mismatched.");
            window.location.href = "patient.html";
            return;
        }

        // --------------------------------
        // USER AVATAR
        // --------------------------------

        const avatar = document.getElementById("topbarAvatar");

        if (avatar) {
            avatar.textContent = (currentUser.name || "User")
                .trim()
                .split(/\s+/)
                .map(part => part[0])
                .join("")
                .substring(0, 2)
                .toUpperCase();
        }

        // --------------------------------
        // HELPER FUNCTION
        // --------------------------------

        function setText(id, value) {
            const element = document.getElementById(id);

            if (element) {
                element.textContent =
                    value !== undefined &&
                    value !== null &&
                    value !== ""
                        ? value
                        : "—";
            }
        }

        // --------------------------------
        // ASSESSMENT DATE
        // --------------------------------

        const assessmentDate = new Date(
            symptomsData.createdAt || patientData.createdAt
        );

        setText(
            "assessmentDate",
            isNaN(assessmentDate.getTime())
                ? "Date unavailable"
                : assessmentDate.toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric"
                })
        );

        // --------------------------------
        // PATIENT INFORMATION
        // --------------------------------

        setText("resultPatientName", patientData.patientName);

        setText(
            "resultAge",
            patientData.age ? `${patientData.age} years` : "—"
        );

        setText("resultGender", patientData.gender);

        setText(
            "resultHeight",
            patientData.height ? `${patientData.height} cm` : "—"
        );

        setText(
            "resultWeight",
            patientData.weight ? `${patientData.weight} kg` : "—"
        );

        setText(
            "resultBMI",
            patientData.bmi
                ? Number(patientData.bmi).toFixed(1)
                : "—"
        );

        // --------------------------------
        // SYMPTOM INFORMATION
        // --------------------------------

        setText("resultSeverity", symptomsData.severity);
        setText("resultDuration", symptomsData.duration);

        const selectedSymptoms = Array.isArray(symptomsData.symptoms)
            ? symptomsData.symptoms
            : [];

        const selectedSymptomNames = Array.isArray(symptomsData.symptomNames)
            ? symptomsData.symptomNames
            : [];

        const resultSymptoms = document.getElementById("resultSymptoms");

        if (resultSymptoms) {
            resultSymptoms.innerHTML = "";

            if (selectedSymptoms.length > 0) {
                selectedSymptomNames.forEach(symptomName => {
                    const chip = document.createElement("span");
                    chip.className = "result-symptom-chip";
                    chip.textContent = symptomName;
                    resultSymptoms.appendChild(chip);
                });
            } else {
                resultSymptoms.textContent = "No symptoms available";
            }
        }


        // --------------------------------
        // MEDICAL BACKGROUND
        // --------------------------------

        const conditions = Array.isArray(patientData.medicalConditions)
            ? patientData.medicalConditions
            : [];

        setText(
            "resultConditions",
            conditions.length > 0
                ? conditions.join(", ")
                : "Not specified"
        );

        setText(
            "resultMedications",
            patientData.medications || "Not specified"
        );

        setText(
            "resultAllergies",
            patientData.allergies || "Not specified"
        );

        setText(
            "resultNotes",
            symptomsData.additionalNotes || "No additional notes"
        );

        console.log("4. ASSESSMENT DETAILS DISPLAYED");

        // --------------------------------
        // PREDICTION DISPLAY
        // --------------------------------

        const pendingLabel =
            document.querySelector(".pending-label");

        const statusHeading =
            document.querySelector(".status-content h2");

        const statusDescription =
            document.querySelector(".status-content p");

        const predictionHeading =
            document.querySelector(".placeholder-content h2");

        const predictionDescription =
            document.querySelector(".placeholder-content p");

        const engineStatus =
            document.querySelector(".engine-status");

        function updateStatus(status, description) {

            if (pendingLabel) {
                pendingLabel.textContent = status;
            }

            if (engineStatus) {
                engineStatus.textContent = description;
            }
        }

        updateStatus(
            "PREDICTION IN PROGRESS",
            "Connecting to backend"
        );

        if (statusHeading) {
            statusHeading.textContent =
                "Your assessment is being processed.";
        }

        if (statusDescription) {
            statusDescription.textContent =
                "Please wait while Vitalis AI analyzes your information.";
        }

        if (predictionHeading) {
            predictionHeading.textContent = "Generating prediction...";
        }

        if (predictionDescription) {
            predictionDescription.textContent =
                "Connecting to the machine learning service.";
        }

        // --------------------------------
        // FETCH MODEL FEATURES
        // --------------------------------

        console.log("5. CALLING FASTAPI FEATURES ENDPOINT");

        const featureResponse = await fetch(
            "http://127.0.0.1:8000/features"
        );

        console.log(
            "6. FEATURES RESPONSE STATUS:",
            featureResponse.status
        );

        if (!featureResponse.ok) {
            throw new Error(
                "Features API failed: " + featureResponse.status
            );
        }

        const featureData = await featureResponse.json();

        console.log("7. FEATURES RECEIVED:", featureData);

        if (
            !Array.isArray(featureData.features) ||
            featureData.features.length === 0
        ) {
            throw new Error("Invalid feature list received.");
        }

        // --------------------------------
        // INITIALIZE FEATURES
        // --------------------------------

        const features = {};

        featureData.features.forEach(feature => {
            features[feature] = 0;
        });

        console.log(
            "8. INITIALIZED FEATURES:",
            Object.keys(features).length
        );

        // --------------------------------
        // PATIENT DATA MAPPING
        // --------------------------------

        features.AGE = Number(patientData.age) || 0;

        const gender = (patientData.gender || "").toLowerCase();

        if (gender === "male") {
            features.SEX = 0;
        } else if (gender === "female") {
            features.SEX = 1;
        }

        // --------------------------------
        // SYMPTOM MAPPING
        // --------------------------------

        let mappedSymptomCount = 0;

        const invalidFeatureIds = [];

        selectedSymptoms.forEach(featureName => {

            if (
                typeof featureName === "string" &&
                Object.prototype.hasOwnProperty.call(features, featureName)
            ) {
                features[featureName] = 1;
                mappedSymptomCount++;
            } else {
                invalidFeatureIds.push(featureName);
            }

        });

        console.log("Selected symptom feature IDs:", selectedSymptoms);
        console.log("Successfully mapped symptoms:", mappedSymptomCount);
        console.log("Unmapped symptom IDs:", invalidFeatureIds);

        if (invalidFeatureIds.length > 0) {
            throw new Error(
                "Some symptom IDs do not exist in the ML model: " +
                invalidFeatureIds.join(", ")
            );
        }

        features.SYMPTOM_COUNT = mappedSymptomCount;

        console.log("Final mapped feature count:", mappedSymptomCount);
        console.log("Final feature map:", features);

        // --------------------------------
        // CALL SPRING BOOT PREDICTION API
        // --------------------------------

        console.log("11. CALLING SPRING BOOT PREDICTION API");

        const predictionResponse = await fetch(
            "http://localhost:8080/api/prediction/predict",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },

                body: JSON.stringify({
                    features: features
                })
            }
        );

        console.log(
            "12. PREDICTION RESPONSE STATUS:",
            predictionResponse.status
        );

        if (!predictionResponse.ok) {

            const errorText = await predictionResponse.text();

            throw new Error(
                "Prediction API failed: " +
                predictionResponse.status +
                " " + errorText
            );
        }

        const result = await predictionResponse.json();

        console.log("13. PREDICTION RESULT:", result);

        if (!result.predicted_disease) {
            throw new Error("Predicted disease missing in API response.");
        }

        // --------------------------------
        // DISPLAY PREDICTION
        // --------------------------------

        updateStatus(
            "PREDICTION GENERATED",
            "Prediction completed"
        );

        if (statusHeading) {
            statusHeading.textContent = "Your prediction is ready.";
        }

        if (statusDescription) {
            statusDescription.textContent =
                "Vitalis AI has successfully analyzed your assessment.";
        }

        if (predictionHeading) {
            predictionHeading.textContent =
                result.predicted_disease;
        }

        if (predictionDescription) {
            predictionDescription.textContent =
                `Model confidence: ${result.confidence}%`;
        }

        const modelList = document.querySelector(".model-list");

        if (modelList) {
            modelList.innerHTML =
                "<span><i class='fa-solid fa-circle-check'></i> Random Forest prediction generated</span>";
        }

        console.log("14. PREDICTION DISPLAYED SUCCESSFULLY");

    } catch (error) {

        console.error("PREDICTION ERROR:", error);

        const pendingLabel =
            document.querySelector(".pending-label");

        const statusHeading =
            document.querySelector(".status-content h2");

        const statusDescription =
            document.querySelector(".status-content p");

        const predictionHeading =
            document.querySelector(".placeholder-content h2");

        const predictionDescription =
            document.querySelector(".placeholder-content p");

        const engineStatus =
            document.querySelector(".engine-status");

        if (pendingLabel) {
            pendingLabel.textContent = "PREDICTION FAILED";
        }

        if (statusHeading) {
            statusHeading.textContent =
                "Unable to generate prediction.";
        }

        if (statusDescription) {
            statusDescription.textContent =
                "Your assessment information is available, but prediction could not be completed.";
        }

        if (predictionHeading) {
            predictionHeading.textContent =
                "Prediction unavailable";
        }

        if (predictionDescription) {
            predictionDescription.textContent = error.message;
        }

        if (engineStatus) {
            engineStatus.textContent = "Backend connection failed";
        }

    }

    // --------------------------------
    // MOBILE SIDEBAR
    // --------------------------------

    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("mobileMenuButton");
    const overlay = document.getElementById("sidebarOverlay");

    function closeSidebar() {
        if (sidebar) sidebar.classList.remove("open");
        if (overlay) overlay.classList.remove("show");
    }

    if (menuButton) {
        menuButton.addEventListener("click", () => {
            sidebar?.classList.toggle("open");
            overlay?.classList.toggle("show");
        });
    }

    if (overlay) {
        overlay.addEventListener("click", closeSidebar);
    }

    document.querySelectorAll(".sidebar-link").forEach(link => {
        link.addEventListener("click", closeSidebar);
    });

    // --------------------------------
    // START NEW ASSESSMENT
    // --------------------------------

    document.querySelectorAll('a[href="patient.html"]').forEach(link => {

        link.addEventListener("click", () => {
            sessionStorage.removeItem("vitalisPatientData");
            sessionStorage.removeItem("vitalisSymptomsData");
        });

    });

    // --------------------------------
    // LOGOUT
    // --------------------------------

    const logoutButton = document.getElementById("logoutButton");

    if (logoutButton) {
        logoutButton.addEventListener("click", () => {

            if (confirm("Are you sure you want to log out?")) {

                localStorage.removeItem("vitalisCurrentUser");
                localStorage.removeItem("vitalisToken");

                sessionStorage.removeItem("vitalisPatientData");
                sessionStorage.removeItem("vitalisSymptomsData");

                window.location.href = "login.html";
            }

        });
    }

    console.log("15. RESULT PAGE SCRIPT FINISHED");

});
