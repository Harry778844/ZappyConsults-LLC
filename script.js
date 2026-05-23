/**
 * Zappy Consults - Main Script (Upgraded)
 * Manages premium interactions, sticky navbar transitions, mobile nav-drawers,
 * interactive testimonial carousels, and highly robust viewport-triggered stats animations.
 */

document.addEventListener("DOMContentLoaded", () => {
    
    // ==========================================================================
    // 1. STICKY NAVBAR TRANSITION & ACTIVE LINK TRACKING
    // ==========================================================================
    const header = document.getElementById("header");
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll("section");

    const handleScroll = () => {
        // Sticky Header class addition
        if (window.scrollY > 50) {
            header.classList.add("scrolled");
        } else {
            header.classList.remove("scrolled");
        }

        // Active Link tracking on scroll
        let currentSectionId = "";
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120; // offset for sticky header
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute("id");
            }
        });

        if (currentSectionId) {
            navLinks.forEach(link => {
                link.classList.remove("active");
                if (link.getAttribute("href") === `#${currentSectionId}`) {
                    link.classList.add("active");
                }
            });
        }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Run once on load

    // ==========================================================================
    // 2. MOBILE MENU DRAWER TOGGLE
    // ==========================================================================
    const mobileToggle = document.getElementById("mobile-toggle");
    const navMenu = document.getElementById("nav-menu");

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener("click", () => {
            mobileToggle.classList.toggle("active");
            navMenu.classList.toggle("open");
            document.body.style.overflow = navMenu.classList.contains("open") ? "hidden" : "";
        });

        navLinks.forEach(link => {
            link.addEventListener("click", () => {
                mobileToggle.classList.remove("active");
                navMenu.classList.remove("open");
                document.body.style.overflow = "";
            });
        });
    }

    // ==========================================================================
    // 3. STATS COUNT-UP ANIMATION (ROBUST SUFFIX PARSER)
    // ==========================================================================
    const animateStats = (stat) => {
        const targetText = stat.getAttribute("data-target") || stat.textContent;
        const numberPattern = /^[0-9.]+/;
        const match = targetText.match(numberPattern);
        
        if (!match) {
            // Non-numeric data like "Canada & USA", display instantly
            stat.textContent = targetText;
            return;
        }

        const target = parseFloat(match[0]);
        const suffix = targetText.replace(numberPattern, '');
        
        let start = 0;
        const duration = 2000; // 2 seconds count-up
        const stepTime = 30; // Milliseconds per frame
        const steps = duration / stepTime;
        const increment = target / steps;

        const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
                clearInterval(timer);
                stat.textContent = targetText;
            } else {
                let formatted = Math.floor(start);
                stat.textContent = formatted + suffix;
            }
        }, stepTime);
    };

    // Intersection Observer to trigger stats animation when visible
    const statsObserverOptions = {
        threshold: 0.3,
        rootMargin: "0px"
    };

    const statsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const statElements = entry.target.querySelectorAll(".stat-number");
                statElements.forEach(animateStats);
                observer.unobserve(entry.target);
            }
        });
    }, statsObserverOptions);

    const statsSection = document.querySelector(".stats-section");
    if (statsSection) {
        statsObserver.observe(statsSection);
    }

    // ==========================================================================
    // 4. INTERACTIVE TESTIMONIAL CAROUSEL
    // ==========================================================================
    const slides = document.querySelectorAll(".testimonial-slide");
    const dots = document.querySelectorAll(".nav-dot");
    let currentSlide = 0;
    let autoSlideTimer;

    const showSlide = (index) => {
        slides.forEach(slide => slide.classList.remove("active"));
        dots.forEach(dot => dot.classList.remove("active"));

        if (slides[index] && dots[index]) {
            slides[index].classList.add("active");
            dots[index].classList.add("active");
            currentSlide = index;
        }
    };

    const nextSlide = () => {
        let next = currentSlide + 1;
        if (next >= slides.length) next = 0;
        showSlide(next);
    };

    const startAutoSlide = () => {
        stopAutoSlide();
        autoSlideTimer = setInterval(nextSlide, 8000);
    };

    const stopAutoSlide = () => {
        if (autoSlideTimer) clearInterval(autoSlideTimer);
    };

    if (dots.length > 0 && slides.length > 0) {
        dots.forEach((dot, index) => {
            dot.addEventListener("click", () => {
                showSlide(index);
                startAutoSlide();
            });
        });
        
        startAutoSlide();
        
        const carouselWrapper = document.querySelector(".testimonials-wrapper");
        if (carouselWrapper) {
            carouselWrapper.addEventListener("mouseenter", stopAutoSlide);
            carouselWrapper.addEventListener("mouseleave", startAutoSlide);
        }
    }

    // ==========================================================================
    // 5. INPUT FIELD ACTIVE FOCUS ENHANCEMENTS
    // ==========================================================================
    const inputs = document.querySelectorAll(".input-wrapper input, .input-wrapper select, .input-wrapper textarea");
    
    inputs.forEach(input => {
        input.addEventListener("focus", () => {
            input.parentElement.classList.add("focused");
        });
        input.addEventListener("blur", () => {
            input.parentElement.classList.remove("focused");
        });
    });


    // ==========================================================================
    // 7. DYNAMIC COPYRIGHT YEAR
    // ==========================================================================
    const yearEl = document.getElementById("copyright-year");
    if (yearEl) {
        yearEl.textContent = new Date().getFullYear();
    }
});
