document.addEventListener("DOMContentLoaded", () => {
	const slides = [
		{
			src: "Assets/HeroBanner.png",
			alt: "ConType controller-focused hero banner",
			title: "Control your Mac from a controller.",
			description:
				"A controller-first experience that keeps your most common actions within reach while you stay focused on the screen.",
		},
		{
			src: "Assets/Keyboard.png",
			alt: "ConType virtual keyboard screen",
			title: "Bring up a virtual keyboard instantly.",
			description:
				"Launch a controller-driven keyboard whenever you need to type, then get back to navigation without breaking flow.",
		},
		{
			src: "Assets/Settings.png",
			alt: "ConType settings screen",
			title: "Customize the experience to fit your setup.",
			description:
				"Adjust the controls and behavior so ConType feels tuned to the way you like to play and work.",
		},
	];

	const carouselSection = document.querySelector(".carousel-section");
	const image = document.querySelector("[data-carousel-image]");
	const title = document.querySelector("[data-carousel-title]");
	const description = document.querySelector("[data-carousel-description]");
	const dots = Array.from(document.querySelectorAll("[data-carousel-dot]"));
	const prevButton = document.querySelector('[data-carousel-nav="prev"]');
	const nextButton = document.querySelector('[data-carousel-nav="next"]');

	if (
		!carouselSection ||
		!image ||
		!title ||
		!description ||
		dots.length === 0
	) {
		return;
	}

	let activeIndex = 0;
	let swipeStartX = 0;
	let swipeStartY = 0;
	let swipePointerId = null;

	const renderSlide = (index) => {
		activeIndex = (index + slides.length) % slides.length;
		const slide = slides[activeIndex];

		image.src = slide.src;
		image.alt = slide.alt;
		title.textContent = slide.title;
		description.textContent = slide.description;

		dots.forEach((dot, dotIndex) => {
			const isActive = dotIndex === activeIndex;
			dot.classList.toggle("is-active", isActive);
			dot.setAttribute("aria-current", isActive ? "true" : "false");
			if (isActive) {
				dot.setAttribute("aria-pressed", "true");
			} else {
				dot.removeAttribute("aria-pressed");
			}
		});
	};

	const goToPrevious = () => renderSlide(activeIndex - 1);
	const goToNext = () => renderSlide(activeIndex + 1);

	dots.forEach((dot) => {
		dot.addEventListener("click", () => {
			const nextIndex = Number(dot.dataset.carouselDot);
			renderSlide(nextIndex);
		});
	});

	prevButton?.addEventListener("click", goToPrevious);
	nextButton?.addEventListener("click", goToNext);

	carouselSection.addEventListener("pointerdown", (event) => {
		if (event.pointerType === "mouse" && event.button !== 0) {
			return;
		}

		swipeStartX = event.clientX;
		swipeStartY = event.clientY;
		swipePointerId = event.pointerId;
		carouselSection.setPointerCapture(event.pointerId);
	});

	const finishSwipe = (event) => {
		if (swipePointerId !== event.pointerId) {
			return;
		}

		const deltaX = event.clientX - swipeStartX;
		const deltaY = event.clientY - swipeStartY;

		if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY)) {
			if (deltaX < 0) {
				goToNext();
			} else {
				goToPrevious();
			}
		}

		swipePointerId = null;
	};

	carouselSection.addEventListener("pointerup", finishSwipe);
	carouselSection.addEventListener("pointercancel", () => {
		swipePointerId = null;
	});

	renderSlide(0);
});
