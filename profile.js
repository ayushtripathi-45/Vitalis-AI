document.addEventListener("DOMContentLoaded", () => {

    // --------------------------------
    // AUTHENTICATION
    // --------------------------------

    let currentUser;

    try {
        currentUser = JSON.parse(
            localStorage.getItem("vitalisCurrentUser")
        );
    } catch (error) {
        currentUser = null;
    }

    if (!currentUser || !currentUser.email) {
        window.location.href = "login.html";
        return;
    }

    // --------------------------------
    // DOM ELEMENTS
    // --------------------------------

    const profileForm = document.getElementById("profileForm");
    const nameInput = document.getElementById("profileName");
    const emailInput = document.getElementById("profileEmail");

    const profileMessage = document.getElementById("profileMessage");

    const saveButton = document.getElementById("saveProfileButton");
    const resetButton = document.getElementById("resetProfileButton");

    // --------------------------------
    // INITIALS
    // --------------------------------

    function getInitials(name) {

        return (name || "User")
            .trim()
            .split(/\s+/)
            .map(part => part[0])
            .join("")
            .substring(0, 2)
            .toUpperCase();
    }

    // --------------------------------
    // UPDATE PROFILE DISPLAY
    // --------------------------------

    function updateProfileDisplay() {

        const name = currentUser.name || "User";
        const email = currentUser.email;

        const initials = getInitials(name);

        document.getElementById("profileDisplayName").textContent = name;
        document.getElementById("profileDisplayEmail").textContent = email;

        document.getElementById("profileAvatar").textContent = initials;
        document.getElementById("topbarAvatar").textContent = initials;

        nameInput.value = name;
        emailInput.value = email;
    }

    // --------------------------------
    // MESSAGE HELPER
    // --------------------------------

    function showMessage(message, type) {

        profileMessage.textContent = message;
        profileMessage.className = `profile-form-message ${type}`;
    }

    function clearMessage() {

        profileMessage.textContent = "";
        profileMessage.className = "profile-form-message";
    }

    // --------------------------------
    // UPDATE SAVED USER NAME
    // --------------------------------

    function updateRegisteredUser(name) {

        try {

            const users = JSON.parse(
                localStorage.getItem("vitalisUsers") || "[]"
            );

            if (!Array.isArray(users)) {
                return;
            }

            const userIndex = users.findIndex(user => {

                return (
                    user.email &&
                    user.email.toLowerCase() ===
                        currentUser.email.toLowerCase()
                );

            });

            if (userIndex !== -1) {

                users[userIndex].name = name;

                localStorage.setItem(
                    "vitalisUsers",
                    JSON.stringify(users)
                );
            }

        } catch (error) {

            console.error("Unable to update registered user:", error);
        }
    }

    // --------------------------------
    // SAVE PROFILE
    // --------------------------------

    profileForm.addEventListener("submit", event => {

        event.preventDefault();
        clearMessage();

        const updatedName = nameInput.value.trim();

        if (!updatedName) {

            showMessage("Please enter your name.", "error");
            nameInput.focus();
            return;
        }

        if (updatedName.length < 2) {

            showMessage(
                "Name must contain at least 2 characters.",
                "error"
            );

            nameInput.focus();
            return;
        }

        if (updatedName.length > 60) {

            showMessage(
                "Name cannot exceed 60 characters.",
                "error"
            );

            nameInput.focus();
            return;
        }

        // Update current session.
        currentUser.name = updatedName;

        try {

            localStorage.setItem(
                "vitalisCurrentUser",
                JSON.stringify(currentUser)
            );

            // Update demo registration record.
            updateRegisteredUser(updatedName);

            updateProfileDisplay();

            showMessage(
                "Your profile has been updated successfully.",
                "success"
            );

        } catch (error) {

            console.error("Unable to save profile:", error);

            showMessage(
                "Unable to save changes. Please try again.",
                "error"
            );
        }

    });

    // --------------------------------
    // RESET FORM
    // --------------------------------

    resetButton.addEventListener("click", () => {

        nameInput.value = currentUser.name || "";
        clearMessage();
    });

    nameInput.addEventListener("input", clearMessage);

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

                sessionStorage.removeItem("vitalisPatientData");
                sessionStorage.removeItem("vitalisSymptomsData");

                window.location.href = "login.html";
            }

        });

    // --------------------------------
    // INITIALIZE
    // --------------------------------

    updateProfileDisplay();

});
