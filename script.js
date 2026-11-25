/* =========================================
   VITALIS AI - MAIN JAVASCRIPT
========================================= */

document.addEventListener("DOMContentLoaded", () => {

    // Initialize Lucide Icons
    if (window.lucide) {
        lucide.createIcons();
    }


    // =====================================
    // NAVBAR SCROLL EFFECT
    // =====================================

    const navbar = document.getElementById("navbar");

    function handleNavbarScroll() {
        if (window.scrollY > 30) {
            navbar.classList.add("scrolled");
        } else {
            navbar.classList.remove("scrolled");
        }
    }

    window.addEventListener("scroll", handleNavbarScroll);

    handleNavbarScroll();


    // =====================================
    // MOBILE NAVIGATION
    // =====================================

    const menuToggle = document.getElementById("menuToggle");
    const navLinks = document.getElementById("navLinks");

    if (menuToggle && navLinks) {

        menuToggle.addEventListener("click", () => {

            const isOpen = navLinks.classList.toggle("open");

            menuToggle.setAttribute("aria-expanded", isOpen);

            menuToggle.innerHTML = isOpen
                ? '<i data-lucide="x"></i>'
                : '<i data-lucide="menu"></i>';

            lucide.createIcons();
        });


        // Close menu after clicking a navigation link

        document.querySelectorAll(".nav-link").forEach(link => {

            link.addEventListener("click", () => {

                navLinks.classList.remove("open");

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.innerHTML = '<i data-lucide="menu"></i>';

                lucide.createIcons();

            });

        });


        // Close menu when clicking outside

        document.addEventListener("click", (event) => {

            if (
                !navLinks.contains(event.target) &&
                !menuToggle.contains(event.target)
            ) {

                navLinks.classList.remove("open");

                menuToggle.setAttribute("aria-expanded", "false");

                menuToggle.innerHTML = '<i data-lucide="menu"></i>';

                lucide.createIcons();

            }

        });

    }


    // =====================================
    // ACTIVE NAVIGATION LINKS
    // =====================================

    const sections = document.querySelectorAll("main section[id]");
    const navigationLinks = document.querySelectorAll(".nav-link");

    const sectionObserver = new IntersectionObserver((entries) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                const currentId = entry.target.getAttribute("id");

                navigationLinks.forEach(link => {

                    link.classList.remove("active");

                    if (link.getAttribute("href") === `#${currentId}`) {
                        link.classList.add("active");
                    }

                });

            }

        });

    }, {
        rootMargin: "-30% 0px -60% 0px"
    });

    sections.forEach(section => {
        sectionObserver.observe(section);
    });


    // =====================================
    // SCROLL REVEAL ANIMATIONS
    // =====================================

    const revealElements = document.querySelectorAll(
        ".step-card, .feature-card, .model-card, .section-heading, .cta-card"
    );

    revealElements.forEach(element => {
        element.classList.add("reveal");
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {

        entries.forEach(entry => {

            if (entry.isIntersecting) {

                entry.target.classList.add("revealed");

                observer.unobserve(entry.target);

            }

        });

    }, {
        threshold: 0.12
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });


    // =====================================
    // SMOOTH SCROLLING
    // =====================================

    document.querySelectorAll('a[href^="#"]').forEach(link => {

        link.addEventListener("click", function(event) {

            const targetId = this.getAttribute("href");

            if (targetId === "#") return;

            const target = document.querySelector(targetId);

            if (target) {

                event.preventDefault();

                target.scrollIntoView({
                    behavior: "smooth",
                    block: "start"
                });

            }

        });

    });


    console.log("Vitalis AI landing page initialized.");

});
