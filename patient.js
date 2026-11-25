
document.addEventListener("DOMContentLoaded", async () => {

    const API_BASE_URL = "http://localhost:8080/api";

    // AUTHENTICATION

    let currentUser = null;

    try {
        currentUser = JSON.parse(localStorage.getItem("vitalisCurrentUser"));
    } catch (error) {
        console.error("Session error:", error);
    }

    const token = localStorage.getItem("vitalisToken");

    if (!currentUser || !currentUser.email || !token) {
        window.location.href = "login.html";
        return;
    }

    const initials = (currentUser.name || "User")
        .trim()
        .split(/\s+/)
        .map(part => part[0])
        .join("")
        .substring(0, 2)
        .toUpperCase();

    document.getElementById("topbarAvatar").textContent = initials;

    // ELEMENTS

    const form = document.getElementById("patientForm");

    const heightInput = document.getElementById("height");
    const weightInput = document.getElementById("weight");

    const bmiValue = document.getElementById("bmiValue");
    const bmiCategory = document.getElementById("bmiCategory");

    const formMessage = document.getElementById("formMessage");

    // BMI CALCULATION

    function calculateBMI() {

        const height = Number(heightInput.value);
        const weight = Number(weightInput.value);

        if (
            !heightInput.value ||
            !weightInput.value ||
            height <= 0 ||
            weight <= 0
        ) {
            bmiValue.textContent = "—";
            bmiCategory.textContent = "Enter measurements";
            return null;
        }

        const heightInMeters = height / 100;
        const bmi = weight / (heightInMeters * heightInMeters);

        if (!Number.isFinite(bmi)) {
            bmiValue.textContent = "—";
            bmiCategory.textContent = "Invalid measurements";
            return null;
        }

        bmiValue.textContent = bmi.toFixed(1);

        let category = "";

        if (bmi < 18.5) {
            category = "Below reference range";
        } else if (bmi < 25) {
            category = "Reference range";
        } else if (bmi < 30) {
            category = "Above reference range";
        } else {
            category = "High BMI range";
        }

        bmiCategory.textContent = category;

        return Number(bmi.toFixed(1));
    }

    heightInput.addEventListener("input", calculateBMI);
    weightInput.addEventListener("input", calculateBMI);

    // CONDITION SELECTION

    const conditionCheckboxes = document.querySelectorAll(
        'input[name="conditions"]'
    );

    conditionCheckboxes.forEach(checkbox => {

        checkbox.addEventListener("change", () => {

            const noneCheckbox = document.querySelector(
                'input[name="conditions"][value="None"]'
            );

            if (checkbox.value === "None" && checkbox.checked) {

                conditionCheckboxes.forEach(other => {
                    if (other.value !== "None") {
                        other.checked = false;
                    }
                });

            } else if (checkbox.value !== "None" && checkbox.checked) {

                noneCheckbox.checked = false;

            }

        });

    });

    // VALIDATION

    function showError(id, message) {
        document.getElementById(id).textContent = message;
    }

    function clearErrors() {
        document.querySelectorAll(".field-error").forEach(element => {
            element.textContent = "";
        });

        formMessage.textContent = "";
    }

    function validateForm() {

        clearErrors();

        let isValid = true;

        const name = document.getElementById("patientName").value.trim();
        const age = Number(document.getElementById("age").value);
        const gender = document.getElementById("gender").value;
        const height = Number(heightInput.value);
        const weight = Number(weightInput.value);

        if (name.length < 2 || name.length > 100) {
            showError("nameError", "Enter a valid name (2–100 characters).");
            isValid = false;
        }

        if (!Number.isInteger(age) || age < 1 || age > 120) {
            showError("ageError", "Enter an age between 1 and 120.");
            isValid = false;
        }

        if (!gender) {
            showError("genderError", "Please select a gender.");
            isValid = false;
        }

        if (!Number.isFinite(height) || height < 50 || height > 250) {
            showError("heightError", "Enter height between 50 and 250 cm.");
            isValid = false;
        }

        if (!Number.isFinite(weight) || weight < 2 || weight > 500) {
            showError("weightError", "Enter weight between 2 and 500 kg.");
            isValid = false;
        }

        if (isValid && calculateBMI() === null) {
            isValid = false;
            formMessage.textContent =
                "Please check your height and weight.";
        }

        return isValid;
    }

    // LOAD EXISTING PATIENT PROFILE

    async function loadPatientProfile() {

        try {
            const response = await fetch(`${API_BASE_URL}/patient/profile`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            });

            if (!response.ok) {
                if (response.status !== 404) {
                    console.error("Unable to load patient profile.");
                }
                return;
            }

            const patient = await response.json();

            document.getElementById("age").value = patient.age ?? "";
            document.getElementById("gender").value = patient.gender ?? "";
            heightInput.value = patient.height ?? "";
            weightInput.value = patient.weight ?? "";

            document.getElementById("medications").value =
                patient.medications || "";

            document.getElementById("allergies").value =
                patient.allergies || "";

            const savedConditions = (patient.existingMedicalConditions || "")
                .split(",")
                .map(value => value.trim())
                .filter(Boolean);

            conditionCheckboxes.forEach(checkbox => {
                checkbox.checked = savedConditions.includes(checkbox.value);
            });

            if (savedConditions.length === 0) {
                document.querySelector(
                    'input[name="conditions"][value="None"]'
                ).checked = true;
            }

            calculateBMI();

        } catch (error) {
            console.error("Profile loading error:", error);
        }
    }

    await loadPatientProfile();

    // FORM SUBMISSION

    form.addEventListener("submit", async (event) => {

        event.preventDefault();

        if (!validateForm()) {
            return;
        }

        const submitButton = form.querySelector('[type="submit"]');

        submitButton.disabled = true;
        formMessage.textContent = "Saving patient information...";

        const selectedConditions = Array.from(
            document.querySelectorAll('input[name="conditions"]:checked')
        ).map(checkbox => checkbox.value);

        const patientData = {

            patientName: document.getElementById("patientName")
                .value.trim(),

            age: Number(document.getElementById("age").value),

            gender: document.getElementById("gender").value,

            height: Number(heightInput.value),

            weight: Number(weightInput.value),

            bmi: calculateBMI(),

            medicalConditions: selectedConditions,

            medications: document.getElementById("medications")
                .value.trim(),

            allergies: document.getElementById("allergies")
                .value.trim(),

            userEmail: currentUser.email,

            createdAt: new Date().toISOString()
        };

        const requestData = {

            age: patientData.age,

            gender: patientData.gender,

            height: patientData.height,

            weight: patientData.weight,

            existingMedicalConditions: selectedConditions.join(", "),

            medications: patientData.medications,

            allergies: patientData.allergies
        };

        try {

            const response = await fetch(`${API_BASE_URL}/patient/save`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(requestData)
            });

            const responseText = await response.text();

            if (!response.ok) {

                let errorMessage = responseText;

                try {
                    const errorData = JSON.parse(responseText);
                    errorMessage = errorData.message || errorData.error || responseText;
                } catch (error) {}

                throw new Error(
                    errorMessage || "Unable to save patient information."
                );
            }

            const savedPatient = JSON.parse(responseText);

            patientData.bmi = savedPatient.bmi;

            sessionStorage.setItem(
                "vitalisPatientData",
                JSON.stringify(patientData)
            );

            window.location.href = "symptoms.html";

        } catch (error) {

            console.error("Patient save error:", error);

            formMessage.textContent =
                error.message || "Unable to save patient information.";

        } finally {

            submitButton.disabled = false;
        }

    });

    // MOBILE SIDEBAR

    const sidebar = document.getElementById("sidebar");
    const menuButton = document.getElementById("mobileMenuButton");
    const overlay = document.getElementById("sidebarOverlay");

    function closeSidebar() {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
    }

    menuButton.addEventListener("click", () => {
        sidebar.classList.toggle("open");
        overlay.classList.toggle("show");
    });

    overlay.addEventListener("click", closeSidebar);

    document.querySelectorAll(".sidebar-link").forEach(link => {
        link.addEventListener("click", closeSidebar);
    });

    // LOGOUT

    document.getElementById("logoutButton")
        .addEventListener("click", () => {

            if (confirm("Are you sure you want to log out?")) {

                localStorage.removeItem("vitalisCurrentUser");
                localStorage.removeItem("vitalisToken");

                sessionStorage.removeItem("vitalisPatientData");

                window.location.href = "login.html";
            }

        });

});
