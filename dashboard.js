
document.addEventListener("DOMContentLoaded", async () => {

    // --------------------------------
    // AUTHENTICATION CHECK
    // --------------------------------

    let currentUser = null;

    try {
        currentUser = JSON.parse(
            localStorage.getItem("vitalisCurrentUser")
        );
    } catch (error) {
        console.error("Unable to read user session:", error);
    }

    const token = localStorage.getItem("vitalisToken");

    if (!currentUser || !currentUser.email || !token) {
        window.location.href = "login.html";
        return;
    }

    // --------------------------------
    // USER INFORMATION
    // --------------------------------

    const userName = currentUser.name || "User";
    const userEmail = currentUser.email;

    const getInitials = (name) => {
        return name
            .trim()
            .split(/\s+/)
            .map(part => part.charAt(0))
            .join("")
            .substring(0, 2)
            .toUpperCase();
    };

    document.getElementById("userName").textContent =
        userName.split(" ")[0];

    document.getElementById("profileName").textContent =
        userName;

    document.getElementById("profileEmail").textContent =
        userEmail;

    const initials = getInitials(userName);

    document.getElementById("topbarAvatar").textContent =
        initials;

    document.getElementById("profileAvatar").textContent =
        initials;

    // --------------------------------
    // CURRENT DATE
    // --------------------------------

    const today = new Date();

    document.getElementById("currentDate").textContent =
        today.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric"
        });

    // --------------------------------
    // LOAD PREDICTION HISTORY
    // --------------------------------

    const recentContainer =
        document.getElementById("recentPredictions");

    const totalPredictionsElement =
        document.getElementById("totalPredictions");

    const savedRecordsElement =
        document.getElementById("savedRecords");

    const lastAssessmentElement =
        document.getElementById("lastAssessment");

    totalPredictionsElement.textContent = "0";
    savedRecordsElement.textContent = "0";
    lastAssessmentElement.textContent = "—";

    try {

        const response = await fetch(
            "http://localhost:8080/api/prediction/history",
            {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                    "Content-Type": "application/json"
                }
            }
        );

        if (!response.ok) {
            throw new Error(
                `Failed to load prediction history: ${response.status}`
            );
        }

        const predictions = await response.json();

        if (!Array.isArray(predictions)) {
            throw new Error("Invalid prediction history response");
        }

        // --------------------------------
        // UPDATE STATISTICS
        // --------------------------------

        totalPredictionsElement.textContent =
            predictions.length;

        savedRecordsElement.textContent =
            predictions.length;

        if (predictions.length > 0) {

            const latestDate = new Date(
                predictions[0].createdAt
            );

            lastAssessmentElement.textContent =
                isNaN(latestDate.getTime())
                    ? "Available"
                    : latestDate.toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short"
                    });
        }

        // --------------------------------
        // RECENT PREDICTIONS
        // --------------------------------

        recentContainer.innerHTML = "";

        const recentItems = predictions.slice(0, 4);

        if (recentItems.length === 0) {

            recentContainer.innerHTML = `
                <p class="empty-state">
                    No prediction records found. Complete your first health assessment to see it here.
                </p>
            `;

        } else {

            recentItems.forEach(prediction => {

                const row = document.createElement("div");
                row.className = "prediction-row";

                const icon = document.createElement("div");
                icon.className = "prediction-icon";
                icon.innerHTML =
                    '<i class="fa-solid fa-heart-pulse"></i>';

                const info = document.createElement("div");
                info.className = "prediction-info";

                const disease = document.createElement("h3");
                disease.textContent =
                    prediction.predictedDisease ||
                    "Assessment completed";

                const details = document.createElement("p");
                details.textContent =
                    `Confidence: ${prediction.confidence ?? "N/A"}%`;

                info.appendChild(disease);
                info.appendChild(details);

                const date = document.createElement("span");
                date.className = "prediction-date";

                const predictionDate = new Date(
                    prediction.createdAt
                );

                date.textContent =
                    isNaN(predictionDate.getTime())
                        ? "Date unavailable"
                        : predictionDate.toLocaleDateString("en-IN", {
                            day: "numeric",
                            month: "short"
                        });

                row.appendChild(icon);
                row.appendChild(info);
                row.appendChild(date);

                recentContainer.appendChild(row);
            });
        }

    } catch (error) {

        console.error("Unable to load dashboard data:", error);

        recentContainer.innerHTML = `
            <p class="empty-state">
                Unable to load prediction history. Please try again later.
            </p>
        `;
    }

    // --------------------------------
    // MOBILE SIDEBAR
    // --------------------------------

    const sidebar =
        document.getElementById("sidebar");

    const menuButton =
        document.getElementById("mobileMenuButton");

    const overlay =
        document.getElementById("sidebarOverlay");

    const closeSidebar = () => {
        sidebar.classList.remove("open");
        overlay.classList.remove("show");
    };

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

            const confirmLogout = window.confirm(
                "Are you sure you want to log out?"
            );

            if (confirmLogout) {
                localStorage.removeItem("vitalisCurrentUser");
                localStorage.removeItem("vitalisToken");
                window.location.href = "login.html";
            }
        });

    // --------------------------------
    // ICONS
    // --------------------------------

    if (window.lucide) {
        window.lucide.createIcons();
    }

});
