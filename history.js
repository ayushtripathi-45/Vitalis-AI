
document.addEventListener("DOMContentLoaded", async () => {

    // AUTHENTICATION

    let currentUser = null;

    try {
        currentUser = JSON.parse(
            localStorage.getItem("vitalisCurrentUser")
        );
    } catch (error) {
        console.error("Unable to load user:", error);
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

    // DOM ELEMENTS

    const tableBody = document.getElementById("historyTableBody");
    const tableWrapper = document.getElementById("historyTableWrapper");
    const emptyState = document.getElementById("historyEmptyState");
    const noResults = document.getElementById("historyNoResults");

    const searchInput = document.getElementById("historySearch");
    const statusFilter = document.getElementById("statusFilter");
    const modal = document.getElementById("historyModal");

    let allRecords = [];

    // LOAD RECORDS FROM BACKEND

    async function loadRecords() {

        tableWrapper.hidden = true;
        emptyState.hidden = true;
        noResults.hidden = true;

        tableBody.innerHTML = `
            <tr>
                <td colspan="5">Loading your assessment history...</td>
            </tr>
        `;

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
                    `Unable to load history: ${response.status}`
                );
            }

            const predictions = await response.json();

            if (!Array.isArray(predictions)) {
                throw new Error("Invalid history response");
            }

            allRecords = predictions.map(record => ({
                id: record.id,
                disease: record.predictedDisease,
                confidence: record.confidence,
                createdAt: record.createdAt,
                model: "Random Forest",
                status: "completed"
            }));

            allRecords.sort((a, b) =>
                new Date(b.createdAt) - new Date(a.createdAt)
            );

            updateStatistics();
            applyFilters();

        } catch (error) {

            console.error("Unable to load prediction history:", error);

            tableBody.innerHTML = "";

            tableWrapper.hidden = true;
            emptyState.hidden = false;
            noResults.hidden = true;

            document.getElementById("emptyStateTitle").textContent =
                "Unable to load records";

            document.getElementById("emptyStateMessage").textContent =
                "We couldn't retrieve your assessment history. Please try again later.";

        }
    }

    // STATUS

    function getStatus(record) {
        return "completed";
    }

    // FORMAT DATE

    function formatDate(value) {

        if (!value) {
            return {
                date: "Date unavailable",
                time: ""
            };
        }

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return {
                date: "Date unavailable",
                time: ""
            };
        }

        return {
            date: date.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
            }),

            time: date.toLocaleTimeString("en-IN", {
                hour: "2-digit",
                minute: "2-digit"
            })
        };
    }

    // UPDATE STATISTICS

    function updateStatistics() {

        document.getElementById("totalRecords").textContent =
            allRecords.length;

        document.getElementById("completedRecords").textContent =
            allRecords.length;

        document.getElementById("pendingRecords").textContent =
            0;
    }

    // CREATE TABLE CELL

    function createCell(content, className = "") {

        const cell = document.createElement("td");

        if (className) {
            cell.className = className;
        }

        cell.textContent = content;

        return cell;
    }

    // RENDER RECORDS

    function renderRecords(records) {

        tableBody.innerHTML = "";

        document.getElementById("recordsCount").textContent =
            `${records.length} ${records.length === 1 ? "record" : "records"}`;

        if (allRecords.length === 0) {

            tableWrapper.hidden = true;
            emptyState.hidden = false;
            noResults.hidden = true;

            document.getElementById("emptyStateTitle").textContent =
                "No assessments yet";

            document.getElementById("emptyStateMessage").textContent =
                "Your saved assessment records will appear here. Start a new assessment to begin building your history.";

            return;
        }

        emptyState.hidden = true;

        if (records.length === 0) {
            tableWrapper.hidden = true;
            noResults.hidden = false;
            return;
        }

        noResults.hidden = true;
        tableWrapper.hidden = false;

        records.forEach(record => {

            const row = document.createElement("tr");

            const dateInfo = formatDate(record.createdAt);

            const dateCell = document.createElement("td");

            const dateContainer = document.createElement("div");
            dateContainer.className = "history-date";

            const dateStrong = document.createElement("strong");
            dateStrong.textContent = dateInfo.date;

            const dateSmall = document.createElement("span");
            dateSmall.textContent = dateInfo.time;

            dateContainer.append(dateStrong, dateSmall);
            dateCell.appendChild(dateContainer);

            const conditionCell = createCell(
                record.disease || "Condition not specified",
                "history-condition"
            );

            const modelCell = createCell(
                record.model,
                "history-model"
            );

            const statusCell = document.createElement("td");

            const statusBadge = document.createElement("span");
            statusBadge.className = "history-status status-completed";
            statusBadge.textContent = "Completed";

            statusCell.appendChild(statusBadge);

            const actionCell = document.createElement("td");
            actionCell.className = "action-column";

            const viewButton = document.createElement("button");

            viewButton.type = "button";
            viewButton.className = "history-action-button";
            viewButton.innerHTML =
                '<i class="fa-regular fa-eye"></i> View';

            viewButton.addEventListener("click", () => {
                openRecordDetails(record);
            });

            actionCell.appendChild(viewButton);

            row.append(
                dateCell,
                conditionCell,
                modelCell,
                statusCell,
                actionCell
            );

            tableBody.appendChild(row);
        });
    }

    // SEARCH AND FILTER

    function applyFilters() {

        const searchTerm = searchInput.value
            .trim()
            .toLowerCase();

        const selectedStatus = statusFilter.value;

        const results = allRecords.filter(record => {

            const disease = String(record.disease || "").toLowerCase();
            const model = String(record.model || "").toLowerCase();

            const matchesSearch =
                disease.includes(searchTerm) ||
                model.includes(searchTerm);

            const matchesStatus =
                selectedStatus === "all" ||
                selectedStatus === "completed";

            return matchesSearch && matchesStatus;
        });

        renderRecords(results);
    }

    searchInput.addEventListener("input", applyFilters);
    statusFilter.addEventListener("change", applyFilters);

    // CLEAR FILTERS

    document.getElementById("clearHistoryFilters")
        .addEventListener("click", () => {

            searchInput.value = "";
            statusFilter.value = "all";

            applyFilters();
        });

    // RECORD DETAILS MODAL

    function openRecordDetails(record) {

        const dateInfo = formatDate(record.createdAt);

        document.getElementById("modalDate").textContent =
            `${dateInfo.date} ${dateInfo.time}`;

        document.getElementById("modalDisease").textContent =
            record.disease || "Condition not specified";

        document.getElementById("modalModel").textContent =
            record.model;

        document.getElementById("modalStatus").textContent =
            "Completed";

        document.getElementById("modalConfidence").textContent =
            record.confidence !== null &&
            record.confidence !== undefined
                ? `${Number(record.confidence).toFixed(1)}%`
                : "Not available";

        document.getElementById("modalSymptoms").textContent =
            "Not available";

        modal.hidden = false;
        document.body.style.overflow = "hidden";
    }

    // CLOSE MODAL

    function closeModal() {
        modal.hidden = true;
        document.body.style.overflow = "";
    }

    document.getElementById("closeHistoryModal")
        .addEventListener("click", closeModal);

    document.getElementById("modalDoneButton")
        .addEventListener("click", closeModal);

    modal.addEventListener("click", event => {

        if (event.target === modal) {
            closeModal();
        }
    });

    document.addEventListener("keydown", event => {

        if (event.key === "Escape" && !modal.hidden) {
            closeModal();
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

    // NEW ASSESSMENT

    document.querySelectorAll('a[href="patient.html"]')
        .forEach(link => {

            link.addEventListener("click", () => {
                sessionStorage.removeItem("vitalisPatientData");
                sessionStorage.removeItem("vitalisSymptomsData");
            });
        });

    // LOGOUT

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

    // INITIALIZE

    await loadRecords();

});
