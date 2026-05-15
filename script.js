document.addEventListener("DOMContentLoaded", () => {
	const slideData = [
		{
			caption: "Make your controller feel like it was made for typing.",
			credit: "",
		},
		{
			caption: "Virtual keyboard designed for your controller.",
			credit: "Keyboard Interface",
		},
		{
			caption: "Customize every aspect of your experience.",
			credit: "Settings Panel",
		},
	];

	const track = document.querySelector("[data-carousel-track]");
	const dots = Array.from(document.querySelectorAll("[data-carousel-dot]"));
	const captionEl = document.querySelector("[data-carousel-caption]");
	const creditEl = document.querySelector("[data-carousel-credit]");
	const prevBtn = document.querySelector("[data-carousel-prev]");
	const nextBtn = document.querySelector("[data-carousel-next]");

	if (!track || dots.length === 0) return;

	let currentSlide = 0;

	const updateCarousel = (slideIndex) => {
		currentSlide = (slideIndex + slideData.length) % slideData.length;

		// Update track position
		track.style.transform = `translateX(-${currentSlide * 100}%)`;

		// Update dots
		dots.forEach((dot, i) => {
			const isActive = i === currentSlide;
			dot.classList.toggle("is-active", isActive);
			dot.setAttribute("aria-selected", isActive);
		});

		// Update caption and credit
		captionEl.textContent = slideData[currentSlide].caption;
		creditEl.textContent = slideData[currentSlide].credit;
	};

	dots.forEach((dot) => {
		dot.addEventListener("click", () => {
			const index = Number(dot.dataset.carouselDot);
			updateCarousel(index);
		});
	});

	prevBtn?.addEventListener("click", () => {
		updateCarousel(currentSlide - 1);
	});

	nextBtn?.addEventListener("click", () => {
		updateCarousel(currentSlide + 1);
	});

	// Initialize
	updateCarousel(0);
});
