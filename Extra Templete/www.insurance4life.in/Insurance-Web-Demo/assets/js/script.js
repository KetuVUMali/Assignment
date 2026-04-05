document.addEventListener("DOMContentLoaded", () => {
    // Mobile submenu toggle for multi-level menu
    const submenuButtons = document.querySelectorAll(".submenu-toggle");
    submenuButtons.forEach((btn) => {
        btn.addEventListener("click", (event) => {
            event.preventDefault();
            const item = btn.closest(".has-submenu");
            if (!item) return;

            const siblings = Array.from(item.parentElement.children).filter((el) => el !== item);
            siblings.forEach((sib) => sib.classList.remove("submenu-open"));
            item.classList.toggle("submenu-open");
        });
    });

    function initContinuousSlider(wrapId, trackId, options = {}) {
        const sliderWrap = document.getElementById(wrapId);
        const sliderTrack = document.getElementById(trackId);
        if (!sliderWrap || !sliderTrack) return;

        let intervalId = null;
        let isPaused = false;
        let isTransitioning = false;
        let cardStep = 0;
        const slideDurationMs = options.slideDurationMs ?? 820;
        const slideEveryMs = options.slideEveryMs ?? 2000;

        function getFirstCard() {
            return sliderTrack.firstElementChild;
        }

        function updateCardStep() {
            const firstCard = getFirstCard();
            if (!firstCard) return;
            const cardWidth = firstCard.getBoundingClientRect().width;
            const gapValue = parseFloat(getComputedStyle(sliderTrack).columnGap || getComputedStyle(sliderTrack).gap || "0");
            cardStep = cardWidth + gapValue;
        }

        function slideOnce() {
            if (isTransitioning || !cardStep) return;
            isTransitioning = true;
            sliderTrack.style.transition = `transform ${slideDurationMs}ms ease`;
            sliderTrack.style.transform = `translateX(-${cardStep}px)`;
        }

        sliderTrack.addEventListener("transitionend", (event) => {
            if (event.propertyName !== "transform") return;

            const firstCard = sliderTrack.firstElementChild;
            sliderTrack.style.transition = "none";
            sliderTrack.style.transform = "translateX(0)";
            if (firstCard) sliderTrack.appendChild(firstCard);
            sliderTrack.offsetHeight;
            isTransitioning = false;
        });

        function startAuto() {
            if (intervalId) return;
            intervalId = setInterval(() => {
                if (!isPaused) {
                    updateCardStep();
                    slideOnce();
                }
            }, slideEveryMs);
        }

        function stopAuto() {
            if (!intervalId) return;
            clearInterval(intervalId);
            intervalId = null;
        }

        sliderWrap.addEventListener("mouseenter", () => { isPaused = true; });
        sliderWrap.addEventListener("mouseleave", () => { isPaused = false; });
        sliderWrap.addEventListener("focusin", () => { isPaused = true; });
        sliderWrap.addEventListener("focusout", () => { isPaused = false; });

        window.addEventListener("resize", updateCardStep);
        window.addEventListener("pagehide", stopAuto);

        updateCardStep();
        setTimeout(() => {
            updateCardStep();
            startAuto();
        }, 100);
    }

    const sliderConfigs = [
        ["topProductsSliderWrap", "topProductsSliderTrack", { slideDurationMs: 820, slideEveryMs: 2000 }],
        ["partnersSliderWrap", "partnersSliderTrack", { slideDurationMs: 700, slideEveryMs: 1800 }],
        ["partnersSliderWrapBottom", "partnersSliderTrackBottom", { slideDurationMs: 700, slideEveryMs: 1800 }]
    ];

    sliderConfigs.forEach(([wrapId, trackId, options]) => {
        initContinuousSlider(wrapId, trackId, options);
    });

    // Rotating testimonial card
    const testimonials = [
        {
            text: "Deepak is a great guy. He helped us get our claim at the earliest and with the best of results. I always recommend him.",
            name: "Raj Kumar Baja",
            avatar: "https://www.insurance4life.in/assets/images/resource/customer-review-1.png"
        },
        {
            text: "This was my first time claiming health insurance. It was frustrating and exhausting during the process. But thankfully, Miss Biva Halder helped.",
            name: "Neha Chettry",
            avatar: "https://www.insurance4life.in/assets/images/resource/customer-review-2.png"
        },
        {
            text: "Such prompt response and action which we can expect only from our agent, and particularly Biva madam. Thanks to them.",
            name: "Vishnu Kumar Tibrewal",
            avatar: "https://www.insurance4life.in/assets/images/resource/customer-review-4.png"
        },
        {
            text: "Good place for all types of insurance. Their claim settlement is awesome.",
            name: "Ajay Mondal",
            avatar: "https://www.insurance4life.in/assets/images/resource/customer-review-6.png"
        }
    ];

    let testimonialIndex = 0;
    const testimonialText = document.getElementById("testimonialText");
    const testimonialName = document.getElementById("testimonialName");
    const testimonialAvatar = document.getElementById("testimonialAvatar");

    function renderTestimonial(index) {
        if (!testimonialText || !testimonialName || !testimonialAvatar) return;
        const selected = testimonials[index];
        testimonialText.textContent = `"${selected.text}"`;
        testimonialName.textContent = selected.name;
        testimonialAvatar.src = selected.avatar;
    }

    renderTestimonial(testimonialIndex);
    setInterval(() => {
        testimonialIndex = (testimonialIndex + 1) % testimonials.length;
        renderTestimonial(testimonialIndex);
    }, 4200);

    // Footer year
    const yearNode = document.getElementById("currentYear");
    if (yearNode) yearNode.textContent = String(new Date().getFullYear());

    // FAQ thought bubbles
    const thoughtPool = [
        "I wanted to have it planned beforehand.",
        "I am concerned about health expenditures now. Thankfully, Shrigoda has got me covered!",
        "I wish I had bought term life insurance sooner for my family.",
        "I planned late, but now I am protected with Shrigoda insurance."
    ];

    function randomThought() {
        return thoughtPool[Math.floor(Math.random() * thoughtPool.length)];
    }

    function updateThoughts() {
        const t1 = document.getElementById("thought1");
        const t2 = document.getElementById("thought2");
        const t3 = document.getElementById("thought3");
        if (!t1 || !t2 || !t3) return;
        t1.textContent = randomThought();
        t2.textContent = randomThought();
        t3.textContent = randomThought();
    }

    updateThoughts();
    setInterval(updateThoughts, 2600);

    // Scroll to top
    const scrollTopBtn = document.getElementById("scrollTopBtn");
    if (scrollTopBtn) {
        window.addEventListener("scroll", () => {
            scrollTopBtn.style.display = window.scrollY > 260 ? "inline-flex" : "none";
        });

        scrollTopBtn.addEventListener("click", () => {
            window.scrollTo({ top: 0, behavior: "smooth" });
        });
    }
});
