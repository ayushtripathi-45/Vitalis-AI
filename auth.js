
const API_BASE_URL = "http://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");
    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    const formHeading = document.getElementById("formHeading");
    const formDescription = document.getElementById("formDescription");

    const switchToSignup = document.getElementById("switchToSignup");
    const switchToLogin = document.getElementById("switchToLogin");

    const signupPassword = document.getElementById("signupPassword");
    const confirmPassword = document.getElementById("confirmPassword");

    function showLogin() {
        loginTab.classList.add("active");
        signupTab.classList.remove("active");

        loginForm.style.display = "block";
        signupForm.style.display = "none";

        formHeading.textContent = "Welcome Back";
        formDescription.textContent = "Login to continue to Vitalis";
        clearMessages();
    }

    function showSignup() {
        signupTab.classList.add("active");
        loginTab.classList.remove("active");

        signupForm.style.display = "block";
        loginForm.style.display = "none";

        formHeading.textContent = "Create Account";
        formDescription.textContent = "Sign up to get started with Vitalis";
        clearMessages();
    }

    loginTab.addEventListener("click", showLogin);
    signupTab.addEventListener("click", showSignup);

    if (switchToSignup) {
        switchToSignup.addEventListener("click", showSignup);
    }

    if (switchToLogin) {
        switchToLogin.addEventListener("click", showLogin);
    }

    const params = new URLSearchParams(window.location.search);

    if (params.get("mode") === "signup") {
        showSignup();
    } else {
        showLogin();
    }

    function showMessage(elementId, message, type) {
        const element = document.getElementById(elementId);

        if (!element) return;

        element.textContent = message;
        element.className = `message ${type}`;
        element.style.display = "block";
    }

    function clearMessages() {
        const loginMessage = document.getElementById("loginMessage");
        const signupMessage = document.getElementById("signupMessage");

        if (loginMessage) {
            loginMessage.textContent = "";
            loginMessage.style.display = "none";
        }

        if (signupMessage) {
            signupMessage.textContent = "";
            signupMessage.style.display = "none";
        }
    }

    function getErrorMessage(data, fallback) {
        if (typeof data === "string" && data.trim()) {
            return data;
        }

        if (data && data.message) {
            return data.message;
        }

        if (data && data.error) {
            return data.error;
        }

        return fallback;
    }

    // Password visibility toggle
    document.querySelectorAll(".password-toggle").forEach(toggle => {
        toggle.addEventListener("click", () => {
            const input = toggle.parentElement.querySelector("input");

            if (!input) return;

            input.type = input.type === "password" ? "text" : "password";

            if (window.lucide) {
                lucide.createIcons();
            }
        });
    });

    // Password strength
    if (signupPassword) {
        signupPassword.addEventListener("input", () => {
            const password = signupPassword.value;
            const strengthBar = document.getElementById("strengthBar");
            const strengthText = document.getElementById("strengthText");

            let strength = 0;

            if (password.length >= 8) strength++;
            if (/[A-Z]/.test(password)) strength++;
            if (/[0-9]/.test(password)) strength++;
            if (/[^A-Za-z0-9]/.test(password)) strength++;

            const labels = ["Weak", "Fair", "Good", "Strong"];

            if (strengthBar) {
                strengthBar.style.width = `${strength * 25}%`;
            }

            if (strengthText) {
                strengthText.textContent = password.length === 0
                    ? ""
                    : labels[Math.max(0, strength - 1)];
            }
        });
    }

    // SIGNUP
    signupForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearMessages();

        const name = document.getElementById("signupName").value.trim();
        const email = document.getElementById("signupEmail").value.trim();
        const password = signupPassword.value;
        const confirm = confirmPassword.value;
        const terms = document.getElementById("terms").checked;

        if (name.length < 2) {
            showMessage("signupMessage", "Please enter a valid name.", "error");
            return;
        }

        if (password.length < 8) {
            showMessage("signupMessage", "Password must contain at least 8 characters.", "error");
            return;
        }

        if (password !== confirm) {
            showMessage("signupMessage", "Passwords do not match.", "error");
            return;
        }

        if (!terms) {
            showMessage("signupMessage", "Please accept the terms and conditions.", "error");
            return;
        }

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    password: password,
                    confirmPassword: confirm
                })
            });

            const responseText = await response.text();

            if (!response.ok) {
                let errorData = responseText;

                try {
                    errorData = JSON.parse(responseText);
                } catch (e) {}

                throw new Error(
                    getErrorMessage(errorData, "Signup failed. Please try again.")
                );
            }

            showMessage(
                "signupMessage",
                responseText || "Account created successfully. Please login.",
                "success"
            );

            signupForm.reset();

            setTimeout(() => {
                showLogin();
                document.getElementById("loginEmail").value = email;
            }, 1200);

        } catch (error) {
            showMessage(
                "signupMessage",
                error.message || "Unable to connect to the server.",
                "error"
            );
        }
    });

    // LOGIN
    loginForm.addEventListener("submit", async (event) => {
        event.preventDefault();
        clearMessages();

        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value;

        try {
            const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    email: email,
                    password: password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    getErrorMessage(data, "Invalid email or password.")
                );
            }

            if (!data.token) {
                throw new Error("Login response did not contain an authentication token.");
            }

            localStorage.setItem("vitalisToken", data.token);

            localStorage.setItem("vitalisCurrentUser", JSON.stringify({
                name: data.name,
                email: data.email
            }));

            showMessage(
                "loginMessage",
                data.message || "Login successful!",
                "success"
            );

            setTimeout(() => {
                window.location.href = "dashboard.html";
            }, 800);

        } catch (error) {
            showMessage(
                "loginMessage",
                error.message || "Unable to connect to the server.",
                "error"
            );
        }
    });

    // Forgot password
    const forgotPassword = document.getElementById("forgotPassword");

    if (forgotPassword) {
        forgotPassword.addEventListener("click", (event) => {
            event.preventDefault();
            alert("Password recovery is not available yet.");
        });
    }
});
