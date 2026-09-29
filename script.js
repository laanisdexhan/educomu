function initCarousel() {
    const slides = [...document.querySelectorAll(".slide")];
    const dots = [...document.querySelectorAll(".dot")];
    const currentSlide = document.getElementById("currentSlide");
    const progressBar = document.getElementById("progressBar");
    const nextBtn = document.getElementById("nextBtn");
    const prevBtn = document.getElementById("prevBtn");
    const startBtn = document.getElementById("startBtn");
    const restartBtn = document.getElementById("restartBtn");
    const bubbleBtn = document.getElementById("bubbleBtn");
    const bubbleContainer = document.getElementById("bubbleContainer");
    const carousel = document.querySelector(".carousel");

    if (!slides.length || !dots.length || !currentSlide || !progressBar || !nextBtn || !prevBtn || !carousel) {
        return;
    }

    let current = 0;
    let autoPlay = null;
    const totalSlides = slides.length;
    const slideTime = 8000;

    function showSlide(index) {
        if (index >= totalSlides) {
            index = 0;
        }

        if (index < 0) {
            index = totalSlides - 1;
        }

        current = index;

        slides.forEach((slide, slideIndex) => {
            slide.classList.toggle("active", slideIndex === current);
        });

        dots.forEach((dot, dotIndex) => {
            dot.classList.toggle("active", dotIndex === current);
        });

        currentSlide.textContent = String(current + 1).padStart(2, "0");

        const progress = ((current + 1) / totalSlides) * 100;
        progressBar.style.width = `${progress}%`;
    }

    function stopAutoPlay() {
        if (autoPlay !== null) {
            clearInterval(autoPlay);
            autoPlay = null;
        }
    }

    function startAutoPlay() {
        stopAutoPlay();

        autoPlay = setInterval(() => {
            if (current < totalSlides - 1) {
                showSlide(current + 1);
            } else {
                stopAutoPlay();
            }
        }, slideTime);
    }

    function resetAutoPlay() {
        stopAutoPlay();
        startAutoPlay();
    }

    function nextSlide() {
        showSlide(current + 1);
        resetAutoPlay();
    }

    function prevSlide() {
        showSlide(current - 1);
        resetAutoPlay();
    }

    function goToSlide(index) {
        showSlide(index);
        resetAutoPlay();
    }

    nextBtn.addEventListener("click", nextSlide);
    prevBtn.addEventListener("click", prevSlide);

    if (startBtn) {
        startBtn.addEventListener("click", nextSlide);
    }

    if (restartBtn) {
        restartBtn.addEventListener("click", () => goToSlide(0));
    }

    dots.forEach((dot) => {
        dot.addEventListener("click", () => {
            const index = Number(dot.dataset.slide);
            if (!Number.isNaN(index)) {
                goToSlide(index);
            }
        });
    });

    if (bubbleBtn && bubbleContainer) {
        bubbleBtn.addEventListener("click", () => {
            bubbleContainer.classList.toggle("expanded");
            const isExpanded = bubbleContainer.classList.contains("expanded");
            bubbleBtn.textContent = isExpanded ? "CERRAR BURBUJA" : "EXPLORAR MI BURBUJA";
        });
    }

    document.addEventListener("keydown", (event) => {
        if (event.key === "ArrowRight") {
            nextSlide();
        }

        if (event.key === "ArrowLeft") {
            prevSlide();
        }

        if (event.key === "Home") {
            goToSlide(0);
        }

        if (event.key === "End") {
            goToSlide(totalSlides - 1);
        }
    });

    carousel.addEventListener("mouseenter", stopAutoPlay);
    carousel.addEventListener("mouseleave", startAutoPlay);

    let touchStartX = 0;
    let touchEndX = 0;

    carousel.addEventListener("touchstart", (event) => {
        touchStartX = event.changedTouches[0].screenX;
    });

    carousel.addEventListener("touchend", (event) => {
        touchEndX = event.changedTouches[0].screenX;
        const difference = touchStartX - touchEndX;

        if (difference > 50) {
            nextSlide();
        }

        if (difference < -50) {
            prevSlide();
        }
    });

    showSlide(0);
    startAutoPlay();
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initCarousel);
} else {
    initCarousel();
}

window.initCarousel = initCarousel;
