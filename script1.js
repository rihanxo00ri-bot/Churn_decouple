
/* =====================================================
   CHURNIQ — ANIMATION CONTROLLER
   GSAP + ScrollTrigger + MotionPathPlugin
   No API or prediction logic in this file.
===================================================== */

(() => {
    "use strict";

    // Prevent accidental double initialization.
    if (window.__churnIQAnimationsInitialized) return;
    window.__churnIQAnimationsInitialized = true;

    const initChurnIQAnimations = () => {
        const gsapAvailable = typeof window.gsap !== "undefined";

        if (!gsapAvailable) {
            console.warn("ChurnIQ: GSAP was not loaded.");
            return;
        }

        const gsap = window.gsap;
        const hasScrollTrigger =
            typeof window.ScrollTrigger !== "undefined";

        const hasMotionPath =
            typeof window.MotionPathPlugin !== "undefined";

        if (hasScrollTrigger) {
            gsap.registerPlugin(window.ScrollTrigger);
        }

        if (hasMotionPath) {
            gsap.registerPlugin(window.MotionPathPlugin);
        }

        const prefersReducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)"
        ).matches;

        // Respect accessibility preferences.
        if (prefersReducedMotion) {
            if (hasScrollTrigger) {
                window.ScrollTrigger.refresh();
            }
            return;
        }

        const mm = gsap.matchMedia();

        mm.add(
            {
                desktop: "(min-width: 900px)",
                mobile: "(max-width: 899px)"
            },
            (context) => {
                const { desktop } = context.conditions;

                /* =========================================
                   01. HERO ENTRANCE
                ========================================= */

                const heroTimeline = gsap.timeline({
                    defaults: {
                        ease: "power3.out"
                    }
                });

                heroTimeline
                    .from(".hero-text .eyebrow", {
                        y: 25,
                        opacity: 0,
                        duration: 0.7
                    })
                    .from(
                        ".hero-text h1",
                        {
                            y: 55,
                            opacity: 0,
                            duration: 1
                        },
                        "-=0.35"
                    )
                    .from(
                        ".hero-description",
                        {
                            y: 25,
                            opacity: 0,
                            duration: 0.8
                        },
                        "-=0.55"
                    )
                    .from(
                        ".hero-actions a",
                        {
                            y: 20,
                            opacity: 0,
                            stagger: 0.15,
                            duration: 0.6
                        },
                        "-=0.5"
                    )
                    .from(
                        ".hero-visual",
                        {
                            scale: 0.88,
                            y: 35,
                            opacity: 0,
                            duration: 1.1
                        },
                        "-=0.75"
                    );

                /* =========================================
                   02. FLOATING DASHBOARD CARDS
                ========================================= */

                if (desktop) {
                    gsap.to(".stat-one", {
                        y: -16,
                        rotation: 2,
                        duration: 3,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });

                    gsap.to(".stat-two", {
                        y: 16,
                        rotation: -2,
                        duration: 3.6,
                        repeat: -1,
                        yoyo: true,
                        ease: "sine.inOut"
                    });
                }

                gsap.to(".visual-glow", {
                    scale: 1.25,
                    rotation: 45,
                    opacity: 0.35,
                    duration: 5,
                    repeat: -1,
                    yoyo: true,
                    ease: "sine.inOut"
                });

                /* =========================================
                   03. SVG ANALYTICS LINE
                ========================================= */

                const path = document.querySelector("#analytics-path");
                const pathDot = document.querySelector(".path-dot");

                if (path) {
                    const pathLength = path.getTotalLength();

                    gsap.set(path, {
                        strokeDasharray: pathLength,
                        strokeDashoffset: pathLength
                    });

                    const graphTimeline = gsap.timeline({
                        delay: 0.7
                    });

                    graphTimeline.to(path, {
                        strokeDashoffset: 0,
                        duration: 2,
                        ease: "power2.inOut"
                    });

                    if (pathDot && hasMotionPath) {
                        gsap.set(pathDot, {
                            opacity: 0
                        });

                        graphTimeline
                            .set(pathDot, {
                                opacity: 1
                            })
                            .to(
                                pathDot,
                                {
                                    motionPath: {
                                        path: path,
                                        align: path,
                                        alignOrigin: [0.5, 0.5],
                                        autoRotate: false
                                    },
                                    duration: 2,
                                    ease: "none"
                                },
                                "-=2"
                            );
                    }
                }

                /* =========================================
                   04. HERO VISUAL MOUSE PARALLAX
                ========================================= */

                const heroVisual =
                    document.querySelector(".hero-visual");

                if (heroVisual && desktop) {
                    heroVisual.addEventListener("mousemove", (event) => {
                        const rect = heroVisual.getBoundingClientRect();

                        const x =
                            (event.clientX - rect.left) / rect.width - 0.5;

                        const y =
                            (event.clientY - rect.top) / rect.height - 0.5;

                        gsap.to(heroVisual, {
                            rotationY: x * 7,
                            rotationX: y * -7,
                            transformPerspective: 900,
                            duration: 0.5,
                            ease: "power2.out"
                        });
                    });

                    heroVisual.addEventListener("mouseleave", () => {
                        gsap.to(heroVisual, {
                            rotationX: 0,
                            rotationY: 0,
                            duration: 0.8,
                            ease: "power3.out"
                        });
                    });
                }

                /* =========================================
                   05. SCROLL REVEALS
                ========================================= */

                if (hasScrollTrigger) {
                    const revealItems = gsap.utils.toArray(
                        ".section-heading, .form-container, .about-section, .footer-content"
                    );

                    revealItems.forEach((element) => {
                        gsap.fromTo(
                            element,
                            {
                                y: 45,
                                opacity: 0
                            },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.9,
                                ease: "power3.out",
                                scrollTrigger: {
                                    trigger: element,
                                    start: "top 88%",
                                    once: true
                                }
                            }
                        );
                    });

                    /* =====================================
                       06. OVERVIEW CARD STAGGER
                    ===================================== */

                    const overviewGrid =
                        document.querySelector(".overview-grid");

                    if (overviewGrid) {
                        const cards = overviewGrid.querySelectorAll(
                            ".overview-card"
                        );

                        gsap.fromTo(
                            cards,
                            {
                                y: 55,
                                opacity: 0,
                                scale: 0.94
                            },
                            {
                                y: 0,
                                opacity: 1,
                                scale: 1,
                                duration: 0.85,
                                stagger: 0.18,
                                ease: "power3.out",
                                scrollTrigger: {
                                    trigger: overviewGrid,
                                    start: "top 82%",
                                    once: true
                                }
                            }
                        );
                    }

                    /* =====================================
                       07. PREDICTION FORM FIELD REVEAL
                    ===================================== */

                    const formSections = gsap.utils.toArray(
                        ".form-section"
                    );

                    formSections.forEach((section, index) => {
                        gsap.fromTo(
                            section,
                            {
                                y: 25,
                                opacity: 0
                            },
                            {
                                y: 0,
                                opacity: 1,
                                duration: 0.65,
                                delay: index * 0.04,
                                ease: "power2.out",
                                scrollTrigger: {
                                    trigger: section,
                                    start: "top 92%",
                                    once: true
                                }
                            }
                        );
                    });

                    /* =====================================
                       08. NAVBAR SCROLL STATE
                    ===================================== */

                    const header =
                        document.querySelector(".site-header");

                    if (header) {
                        window.ScrollTrigger.create({
                            start: "top -80",
                            onUpdate: (self) => {
                                header.classList.toggle(
                                    "scrolled",
                                    self.scroll() > 80
                                );
                            }
                        });
                    }

                    /* =====================================
                       09. ACTIVE NAVIGATION LINK
                    ===================================== */

                    const navLinks = gsap.utils.toArray(
                        '.nav-links a[href^="#"]'
                    );

                    navLinks.forEach((link) => {
                        const target = document.querySelector(
                            link.getAttribute("href")
                        );

                        if (!target) return;

                        window.ScrollTrigger.create({
                            trigger: target,
                            start: "top 40%",
                            end: "bottom 40%",
                            onToggle: (self) => {
                                if (self.isActive) {
                                    navLinks.forEach((item) => {
                                        item.classList.remove("active");
                                    });

                                    link.classList.add("active");
                                }
                            }
                        });
                    });
                }

                /* =========================================
                   10. CARD 3D HOVER
                ========================================= */

                if (desktop) {
                    const cards = document.querySelectorAll(
                        ".overview-card"
                    );

                    cards.forEach((card) => {
                        card.addEventListener("mousemove", (event) => {
                            const rect = card.getBoundingClientRect();

                            const x =
                                (event.clientX - rect.left) / rect.width;

                            const y =
                                (event.clientY - rect.top) / rect.height;

                            gsap.to(card, {
                                rotationY: (x - 0.5) * 8,
                                rotationX: (0.5 - y) * 8,
                                transformPerspective: 800,
                                scale: 1.02,
                                duration: 0.35,
                                ease: "power2.out"
                            });
                        });

                        card.addEventListener("mouseleave", () => {
                            gsap.to(card, {
                                rotationX: 0,
                                rotationY: 0,
                                scale: 1,
                                duration: 0.5,
                                ease: "power3.out"
                            });
                        });
                    });
                }

                /* =========================================
                   11. MAGNETIC BUTTON INTERACTION
                ========================================= */

                if (desktop) {
                    const magneticButtons =
                        document.querySelectorAll(
                            ".nav-cta, .hero-actions a"
                        );

                    magneticButtons.forEach((button) => {
                        button.addEventListener("mousemove", (event) => {
                            const rect = button.getBoundingClientRect();

                            const x =
                                event.clientX - rect.left - rect.width / 2;

                            const y =
                                event.clientY - rect.top - rect.height / 2;

                            gsap.to(button, {
                                x: x * 0.12,
                                y: y * 0.18,
                                duration: 0.3,
                                ease: "power2.out"
                            });
                        });

                        button.addEventListener("mouseleave", () => {
                            gsap.to(button, {
                                x: 0,
                                y: 0,
                                duration: 0.5,
                                ease: "elastic.out(1, 0.4)"
                            });
                        });
                    });
                }

                /* =========================================
                   12. FORM INPUT FOCUS FEEDBACK
                ========================================= */

                const formInputs = document.querySelectorAll(
                    "#churn-form input, #churn-form select"
                );

                formInputs.forEach((input) => {
                    input.addEventListener("focus", () => {
                        gsap.to(input, {
                            scale: 1.01,
                            duration: 0.2,
                            ease: "power2.out"
                        });
                    });

                    input.addEventListener("blur", () => {
                        gsap.to(input, {
                            scale: 1,
                            duration: 0.2,
                            ease: "power2.out"
                        });
                    });
                });

                /* =========================================
                   13. SUBMIT BUTTON FEEDBACK
                ========================================= */

                const form = document.querySelector("#churn-form");
                const submitButton =
                    document.querySelector("#submit-btn");

                if (form && submitButton) {
                    form.addEventListener("submit", () => {
                        gsap.to(submitButton, {
                            scale: 0.97,
                            duration: 0.12,
                            yoyo: true,
                            repeat: 1,
                            ease: "power1.inOut"
                        });
                    });
                }

                /* =========================================
                   14. RESULT PANEL ANIMATION
                   Watches for changes made by script.js.
                ========================================= */

                const resultBox =
                    document.querySelector("#result-box");

                if (resultBox) {
                    const resultObserver = new MutationObserver(() => {
                        if (!resultBox.children.length) return;

                        gsap.fromTo(
                            resultBox,
                            {
                                y: 25,
                                opacity: 0,
                                scale: 0.98
                            },
                            {
                                y: 0,
                                opacity: 1,
                                scale: 1,
                                duration: 0.65,
                                ease: "back.out(1.3)"
                            }
                        );

                        gsap.fromTo(
                            resultBox.children,
                            {
                                y: 12,
                                opacity: 0
                            },
                            {
                                y: 0,
                                opacity: 1,
                                stagger: 0.12,
                                duration: 0.45,
                                ease: "power2.out"
                            }
                        );
                    });

                    resultObserver.observe(resultBox, {
                        childList: true,
                        subtree: true
                    });
                }

                /* =========================================
                   15. REFRESH SCROLL POSITIONS
                ========================================= */

                if (hasScrollTrigger) {
                    window.addEventListener(
                        "load",
                        () => window.ScrollTrigger.refresh(),
                        { once: true }
                    );
                }
            }
        );

        console.log("ChurnIQ animations initialized.");
    };

    if (document.readyState === "loading") {
        document.addEventListener(
            "DOMContentLoaded",
            initChurnIQAnimations,
            { once: true }
        );
    } else {
        initChurnIQAnimations();
    }
})();
