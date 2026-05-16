document.addEventListener("DOMContentLoaded", () => {
	const heroSlides = [
		{
			image: "Assets/BannerRoblox.png",
			creditText: "Microwave Dinner by 1EpikDuck on Roblox",
			creditUrl: "https://www.roblox.com/games/4344891683/",
		},
		{
			image: "Assets/BannerPrism.png",
			creditText: "Prism Launcher",
			creditUrl: "https://prismlauncher.org/",
		},
	];

	const heroEl = document.querySelector(".hero");
	const heroCreditEl = document.querySelector(".hero-credit-link");

	if (heroEl && heroCreditEl && heroSlides.length > 0) {
		let currentHeroSlide = 0;
		let isHeroFading = false;

		const fadeDurationMs = 900;

		const applyHeroCredit = (slide) => {
			heroCreditEl.href = slide.creditUrl;
			heroCreditEl.textContent = slide.creditText;
			heroCreditEl.setAttribute(
				"aria-label",
				`Image credit: ${slide.creditText}`,
			);
		};

		const setInitialHero = (index) => {
			currentHeroSlide = (index + heroSlides.length) % heroSlides.length;
			const current = heroSlides[currentHeroSlide];
			heroEl.style.setProperty(
				"--hero-image-current",
				`url("${current.image}")`,
			);
			heroEl.style.setProperty("--hero-image-next", `url("${current.image}")`);
			applyHeroCredit(current);
		};

		const updateHero = (index) => {
			if (isHeroFading) return;

			const nextHeroSlide = (index + heroSlides.length) % heroSlides.length;
			if (nextHeroSlide === currentHeroSlide) return;

			const next = heroSlides[nextHeroSlide];
			isHeroFading = true;

			heroEl.style.setProperty("--hero-image-next", `url("${next.image}")`);
			heroEl.classList.add("is-fading");
			applyHeroCredit(next);

			window.setTimeout(() => {
				heroEl.style.setProperty(
					"--hero-image-current",
					`url("${next.image}")`,
				);
				heroEl.classList.remove("is-fading");
				currentHeroSlide = nextHeroSlide;
				isHeroFading = false;
			}, fadeDurationMs);
		};

		setInitialHero(0);
		setInterval(() => {
			updateHero(currentHeroSlide + 1);
		}, 5000);
	}

	const slideData = [
		{
			captionHtml:
				"<strong>Keyboard Shortcuts.</strong> Make your controller feel like it was made for typing.",
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
		captionEl.innerHTML =
			slideData[currentSlide].captionHtml ?? slideData[currentSlide].caption;
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
