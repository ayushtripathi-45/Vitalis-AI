document.addEventListener("DOMContentLoaded", () => {

    // --------------------------------
    // AUTHENTICATION AND PATIENT DATA
    // --------------------------------

    let currentUser = null;
    let patientData = null;

    try {
        currentUser = JSON.parse(
            localStorage.getItem("vitalisCurrentUser")
        );

        patientData = JSON.parse(
            sessionStorage.getItem("vitalisPatientData")
        );
    } catch (error) {
        console.error("Unable to load assessment data:", error);
    }

    const token = localStorage.getItem("vitalisToken");

    if (!currentUser || !currentUser.email || !token) {
        window.location.href = "login.html";
        return;
    }

    if (
        !patientData ||
        !patientData.userEmail ||
        patientData.userEmail.toLowerCase() !== currentUser.email.toLowerCase()
    ) {
        window.location.href = "patient.html";
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

    // --------------------------------
    // SYMPTOM LIBRARY
    // --------------------------------

    const symptoms = [
    // General
    { name: "Fever", category: "General", icon: "fa-temperature-high", feature: "E_91_do_you_have_a_fever" },
    { name: "Chills", category: "General", icon: "fa-snowflake", feature: "E_94_have_you_had_chills_or" },
    { name: "Fatigue", category: "General", icon: "fa-battery-quarter", feature: "E_89_do_you_constantly_feel_fatigued" },
    { name: "Weakness", category: "General", icon: "fa-person-falling", feature: "E_156_have_you_had_weakness_or" },
    { name: "Loss of Sense of Smell", category: "General", icon: "fa-nose", feature: "E_103_have_you_lost_your_sense" },
    { name: "Unintentional Weight Loss", category: "General", icon: "fa-weight-scale", feature: "E_174_have_you_been_unintentionally_losin" },
    { name: "Pale Skin", category: "General", icon: "fa-user", feature: "E_154_is_your_skin_much_paler" },
    { name: "Anxiety", category: "General", icon: "fa-brain", feature: "E_16_do_you_feel_anxious" },
    { name: "Irritability", category: "General", icon: "fa-face-angry", feature: "E_114_are_you_more_irritable_or" },

    // Respiratory
    { name: "Cough", category: "Respiratory", icon: "fa-lungs", feature: "E_201_do_you_have_a_cough" },
    { name: "Intense Coughing", category: "Respiratory", icon: "fa-head-side-cough", feature: "E_203_do_you_have_intense_coughing" },
    { name: "Wheezing", category: "Respiratory", icon: "fa-lungs", feature: "E_214_have_you_noticed_a_wheezing" },
    { name: "Shortness of Breath", category: "Respiratory", icon: "fa-wind", feature: "E_66_are_you_experiencing_shortness_of" },
    { name: "Coughing Up Blood", category: "Respiratory", icon: "fa-lungs", feature: "E_45_have_you_been_coughing_up" },
    { name: "Sore Throat", category: "Respiratory", icon: "fa-head-side-cough", feature: "E_97_do_you_have_a_sore" },
    { name: "Nasal Congestion", category: "Respiratory", icon: "fa-head-side-mask", feature: "E_181_do_you_have_nasal_congestion" },
    { name: "Greenish Nasal Discharge", category: "Respiratory", icon: "fa-head-side-cough", feature: "E_182_do_you_have_greenish_or" },
    { name: "Difficulty Swallowing", category: "Respiratory", icon: "fa-utensils", feature: "E_65_do_you_have_difficulty_swallowing" },

    // Digestive
    { name: "Nausea", category: "Digestive", icon: "fa-face-dizzy", feature: "E_148_are_you_feeling_nauseous_or" },
    { name: "Vomiting", category: "Digestive", icon: "fa-toilet", feature: "E_210_have_you_recently_thrown_up" },
    { name: "Diarrhea", category: "Digestive", icon: "fa-toilet", feature: "E_51_have_you_had_diarrhea_or" },
    { name: "Abdominal Discomfort", category: "Digestive", icon: "fa-stomach", feature: "E_30_do_you_feel_your_abdomen" },
    { name: "Difficulty Keeping Food Down", category: "Digestive", icon: "fa-utensils", feature: "E_168_do_you_have_trouble_keeping" },

    // Skin
    { name: "Skin Lesions", category: "Skin", icon: "fa-bandage", feature: "E_129_do_you_have_any_lesions" },
    { name: "Skin Peeling", category: "Skin", icon: "fa-hand", feature: "E_131_do_your_lesions_peel_off" },
    { name: "Swollen Rash", category: "Skin", icon: "fa-hand-dots", feature: "E_132_is_the_rash_swollen" },
    { name: "Severe Itching", category: "Skin", icon: "fa-hand", feature: "E_170_do_you_have_severe_itching" },
    { name: "Swelling", category: "Skin", icon: "fa-hand", feature: "E_151_do_you_have_swelling_in" },
    { name: "New Skin Changes", category: "Skin", icon: "fa-hand-dots", feature: "E_175_have_you_noticed_any_new" },

    // Pain and Muscular
    { name: "Widespread Body Pain", category: "Pain", icon: "fa-person", feature: "E_144_do_you_have_diffuse_widespread" },
    { name: "Muscle Pain", category: "Pain", icon: "fa-dumbbell", feature: "E_192_do_you_feel_that_muscle" },
    { name: "Pain or Discomfort", category: "Pain", icon: "fa-hand", feature: "E_38_do_you_have_pain_or" },
    { name: "Painful Mouth", category: "Pain", icon: "fa-face-grimace", feature: "E_206_do_you_have_painful_mouth" },

    // Neurological and Other
    { name: "Dizziness", category: "Neurological", icon: "fa-arrows-spin", feature: "E_76_do_you_feel_slightly_dizzy" },
    { name: "Lightheadedness", category: "Neurological", icon: "fa-head-side-virus", feature: "E_82_do_you_feel_lightheaded_and" },
    { name: "Numbness", category: "Neurological", icon: "fa-hand", feature: "E_93_do_you_have_numbness_loss" },
    { name: "Loss of Consciousness", category: "Neurological", icon: "fa-person-circle-exclamation", feature: "E_159_did_you_lose_consciousness" },
    { name: "Confusion", category: "Neurological", icon: "fa-brain", feature: "E_39_have_you_felt_confused_or" },
    { name: "Involuntary Movement", category: "Neurological", icon: "fa-person", feature: "E_162_have_you_had_an_involuntary" },
    { name: "Difficulty Speaking", category: "Neurological", icon: "fa-comment-medical", feature: "E_63_do_you_have_difficulty_articulating" },
    { name: "Heart Palpitations", category: "Other", icon: "fa-heart-pulse", feature: "E_155_do_you_feel_your_heart" },
    { name: "Burning Sensation", category: "Other", icon: "fa-fire", feature: "E_173_do_you_have_a_burning" },
    { name: "Difficulty Controlling Urination", category: "Other", icon: "fa-droplet", feature: "E_180_are_you_unable_to_control"
    }
];

    // --------------------------------
    // ELEMENTS AND STATE
    // --------------------------------

    const symptomGrid = document.getElementById("symptomGrid");
    const selectedContainer = document.getElementById("selectedSymptoms");
    const selectedCount = document.getElementById("selectedCount");
    const searchInput = document.getElementById("symptomSearch");
    const clearSearchButton = document.getElementById("clearSearch");
    const visibleCount = document.getElementById("visibleCount");
    const noSymptoms = document.getElementById("noSymptoms");

    const symptomsError = document.getElementById("symptomsError");
    const formMessage = document.getElementById("formMessage");

    const selectedSymptoms = new Set();

    let activeCategory = "All";

    // --------------------------------
    // RENDER SYMPTOM CARDS
    // --------------------------------

    function renderSymptoms() {

        const searchTerm = searchInput.value.trim().toLowerCase();

        const filteredSymptoms = symptoms.filter(symptom => {

            const matchesSearch =
                symptom.name.toLowerCase().includes(searchTerm);

            const matchesCategory =
                activeCategory === "All" ||
                symptom.category === activeCategory;

            return matchesSearch && matchesCategory;
        });

        symptomGrid.innerHTML = "";

        filteredSymptoms.forEach(symptom => {

            const card = document.createElement("button");

            card.type = "button";
            card.className = "symptom-card";

            const isSelected = selectedSymptoms.has(symptom.feature);

            if (isSelected) {
                card.classList.add("selected");
            }

            card.setAttribute("aria-pressed", String(isSelected));

            const icon = document.createElement("span");
            icon.className = "symptom-card-icon";

            const iconElement = document.createElement("i");
            iconElement.className = `fa-solid ${symptom.icon}`;

            icon.appendChild(iconElement);

            const name = document.createElement("span");
            name.className = "symptom-card-name";
            name.textContent = symptom.name;

            const check = document.createElement("span");
            check.className = "symptom-card-check";
            check.innerHTML = '<i class="fa-solid fa-check"></i>';

            card.appendChild(icon);
            card.appendChild(name);
            card.appendChild(check);

            card.addEventListener("click", () => {
                toggleSymptom(symptom);
            });

            symptomGrid.appendChild(card);
        });

        visibleCount.textContent =
            `${filteredSymptoms.length} symptoms`;

        noSymptoms.hidden = filteredSymptoms.length !== 0;
    }

    // --------------------------------
    // TOGGLE SYMPTOM
    // --------------------------------

    function toggleSymptom(symptom) {

        if (selectedSymptoms.has(symptom.feature)) {
            selectedSymptoms.delete(symptom.feature);
        } else {
            selectedSymptoms.add(symptom.feature);
        }

        symptomsError.textContent = "";

        renderSymptoms();
        renderSelectedSymptoms();
    }

    // --------------------------------
    // RENDER SELECTED SYMPTOMS
    // --------------------------------

    function renderSelectedSymptoms() {

        selectedCount.textContent =
            `${selectedSymptoms.size} selected`;

        selectedContainer.innerHTML = "";

        if (selectedSymptoms.size === 0) {

            const placeholder = document.createElement("span");

            placeholder.className = "selection-placeholder";
            placeholder.textContent =
                "Your selected symptoms will appear here.";

            selectedContainer.appendChild(placeholder);

            return;
        }

        selectedSymptoms.forEach(feature => {

            const symptom = symptoms.find(
                item => item.feature === feature
            );

            const name = symptom ? symptom.name : feature;

            const chip = document.createElement("span");
            chip.className = "selected-chip";

            const text = document.createElement("span");
            text.textContent = name;

            const removeButton = document.createElement("button");
            removeButton.type = "button";

            removeButton.setAttribute(
                "aria-label",
                `Remove ${name}`
            );

            removeButton.innerHTML =
                '<i class="fa-solid fa-xmark"></i>';

            removeButton.addEventListener("click", () => {
                if (symptom) {
                    toggleSymptom(symptom);
                }
            });

            chip.appendChild(text);
            chip.appendChild(removeButton);

            selectedContainer.appendChild(chip);
        });
    }

    // --------------------------------
    // SEARCH
    // --------------------------------

    searchInput.addEventListener("input", () => {

        clearSearchButton.style.display =
            searchInput.value ? "block" : "none";

        renderSymptoms();
    });

    clearSearchButton.addEventListener("click", () => {

        searchInput.value = "";
        clearSearchButton.style.display = "none";

        renderSymptoms();
        searchInput.focus();
    });

    // --------------------------------
    // CATEGORY FILTER
    // --------------------------------

    document.querySelectorAll(".category-tab").forEach(tab => {

        tab.addEventListener("click", () => {

            document.querySelectorAll(".category-tab")
                .forEach(item => item.classList.remove("active"));

            tab.classList.add("active");

            activeCategory = tab.dataset.category;

            renderSymptoms();
        });

    });

    // --------------------------------
    // CLEAR SELECTED SYMPTOMS
    // --------------------------------

    document.getElementById("clearSelection")
        .addEventListener("click", () => {

            selectedSymptoms.clear();

            symptomsError.textContent = "";

            renderSymptoms();
            renderSelectedSymptoms();
        });

    // --------------------------------
    // FORM SUBMISSION
    // --------------------------------

    document.getElementById("symptomsForm")
        .addEventListener("submit", async (event) => {

            event.preventDefault();

            symptomsError.textContent = "";
            formMessage.textContent = "";

            document.getElementById("severityError").textContent = "";
            document.getElementById("durationError").textContent = "";

            const severity =
                document.getElementById("severity").value;

            const duration =
                document.getElementById("duration").value;

            let valid = true;

            if (selectedSymptoms.size === 0) {
                symptomsError.textContent =
                    "Please select at least one symptom.";
                valid = false;
            }

            if (!severity) {
                document.getElementById("severityError").textContent =
                    "Please select symptom severity.";
                valid = false;
            }

            if (!duration) {
                document.getElementById("durationError").textContent =
                    "Please select symptom duration.";
                valid = false;
            }

            if (!valid) {
                formMessage.textContent =
                    "Please complete the required fields.";
                return;
            }

            const normalizedDuration = duration.replace(/[–—]/g, "-");

            const durationDays = {
                "Less than 24 hours": 1,
                "1-3 days": 2,
                "4-7 days": 5,
                "1-2 weeks": 10,
                "More than 2 weeks": 15,
                "Recurring": 1
            };

            const additionalNotes = document
                .getElementById("additionalNotes")
                .value.trim();

            const days = durationDays[normalizedDuration];

            if (!days) {
                formMessage.textContent =
                    "Invalid symptom duration selected.";
                return;
            }

            const selectedSymptomFeatures = Array.from(selectedSymptoms);

            const selectedSymptomNames = selectedSymptomFeatures.map(feature => {
                const symptom = symptoms.find(
                    item => item.feature === feature
                );

                return symptom ? symptom.name : feature;
            });

            const symptomsData = {

                symptoms: selectedSymptomFeatures,

                symptomNames: selectedSymptomNames,

                severity: severity,

                duration: duration,

                additionalNotes: additionalNotes,

                createdAt: new Date().toISOString()

            };

            const requestData = Array.from(selectedSymptoms).map(feature => {

                const symptom = symptoms.find(
                    item => item.feature === feature
                );

                return {
                    symptomName: symptom ? symptom.name : feature,
                    severity: severity,
                    duration: days,
                    notes: additionalNotes
                };

            });

            const submitButton =
                document.getElementById("continueButton");

            submitButton.disabled = true;
            formMessage.textContent = "Saving your symptoms...";

            try {

                const response = await fetch(
                    "http://localhost:8080/api/symptoms/save",
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": `Bearer ${token}`
                        },
                        body: JSON.stringify(requestData)
                    }
                );

                const responseText = await response.text();

                if (!response.ok) {

                    let errorMessage = responseText;

                    try {
                        const errorData = JSON.parse(responseText);

                        errorMessage =
                            errorData.message ||
                            errorData.error ||
                            responseText;

                    } catch (error) {}

                    throw new Error(
                        errorMessage || "Unable to save symptoms."
                    );
                }

                sessionStorage.setItem(
                    "vitalisSymptomsData",
                    JSON.stringify(symptomsData)
                );

                window.location.href = "result.html";

            } catch (error) {

                console.error("Symptoms save error:", error);

                formMessage.textContent =
                    error.message ||
                    "Unable to save symptoms. Please try again.";

            } finally {

                submitButton.disabled = false;

            }

        });

    // --------------------------------
    // MOBILE SIDEBAR
    // --------------------------------

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

    // --------------------------------
    // LOGOUT
    // --------------------------------

    document.getElementById("logoutButton")
        .addEventListener("click", () => {

            if (confirm("Are you sure you want to log out?")) {

                localStorage.removeItem("vitalisCurrentUser");
                localStorage.removeItem("vitalisToken");

                sessionStorage.removeItem("vitalisPatientData");
                sessionStorage.removeItem("vitalisSymptomsData");

                window.location.href = "login.html";

            }

        });

    // --------------------------------
    // INITIAL RENDER
    // --------------------------------

    renderSymptoms();
    renderSelectedSymptoms();

});