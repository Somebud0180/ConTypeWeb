document.addEventListener("DOMContentLoaded", () => {
	const themeStorageKey = "contype-theme";
	const themePreferenceOptions = ["light", "dark", "auto"];
	const themeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
	const rootElement = document.documentElement;
	const storedPreference = window.localStorage.getItem(themeStorageKey);
	let themePreference = themePreferenceOptions.includes(storedPreference)
		? storedPreference
		: "auto";

	const getResolvedTheme = () => {
		if (themePreference === "light" || themePreference === "dark") {
			return themePreference;
		}

		return themeMediaQuery.matches ? "dark" : "light";
	};

	const updateThemeImages = () => {
		const resolvedTheme = getResolvedTheme();

		document.querySelectorAll("[data-theme-light]").forEach((image) => {
			const lightSrc = image.getAttribute("data-theme-light") || "";
			const darkSrc = image.getAttribute("data-theme-dark") || lightSrc;
			const nextSrc = resolvedTheme === "dark" ? darkSrc : lightSrc;

			if (nextSrc && image.getAttribute("src") !== nextSrc) {
				image.setAttribute("src", nextSrc);
			}
		});
	};

	const updateThemePickerState = () => {
		document.querySelectorAll("[data-theme-option]").forEach((button) => {
			const isActive = button.dataset.themeOption === themePreference;
			button.classList.toggle("is-active", isActive);
			button.setAttribute("aria-pressed", String(isActive));
		});
	};

	const applyThemePreference = (nextPreference, shouldPersist = true) => {
		themePreference = nextPreference;

		if (themePreference === "auto") {
			rootElement.removeAttribute("data-theme");
		} else {
			rootElement.setAttribute("data-theme", themePreference);
		}

		if (shouldPersist) {
			window.localStorage.setItem(themeStorageKey, themePreference);
		}

		updateThemeImages();
		updateThemePickerState();
	};

	const ensureThemePicker = () => {
		if (document.querySelector("[data-theme-picker]")) return;

		const picker = document.createElement("div");
		picker.className = "theme-picker";
		picker.setAttribute("data-theme-picker", "true");
		picker.setAttribute("aria-label", "Theme picker");

		const options = [
			{ label: "Light", value: "light" },
			{ label: "Dark", value: "dark" },
			{ label: "Auto", value: "auto" },
		];

		options.forEach((option) => {
			const button = document.createElement("button");
			button.type = "button";
			button.textContent = option.label;
			button.dataset.themeOption = option.value;
			button.setAttribute("aria-pressed", "false");
			button.addEventListener("click", () => {
				applyThemePreference(option.value);
			});
			picker.appendChild(button);
		});

		// Try to insert the picker into the footer beneath the copyright text.
		const footerFirstCol = document.querySelector(
			".footer .footer-split > div:first-child",
		);
		if (footerFirstCol) {
			const copyrightEl = footerFirstCol.querySelector("p:last-of-type");
			if (copyrightEl) {
				copyrightEl.insertAdjacentElement("afterend", picker);
			} else {
				footerFirstCol.appendChild(picker);
			}
		} else {
			document.body.appendChild(picker);
		}
	};

	ensureThemePicker();
	applyThemePreference(themePreference, false);

	themeMediaQuery.addEventListener("change", () => {
		if (themePreference === "auto") {
			updateThemeImages();
		}
	});

	// Adjust fragment navigation to account for the fixed topbar
	const getTopbarOffset = () => {
		const topbar = document.querySelector(".topbar");
		if (!topbar) return 0;
		const rect = topbar.getBoundingClientRect();
		const topStyle = parseFloat(getComputedStyle(topbar).top) || 0;
		return rect.height + topStyle + 8; // small extra gap
	};

	const scrollToWithOffset = (el, behavior = "smooth") => {
		const offset = getTopbarOffset();
		const top = el.getBoundingClientRect().top + window.scrollY - offset;
		window.scrollTo({ top, behavior });
	};

	document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
		anchor.addEventListener("click", (e) => {
			const hash = anchor.getAttribute("href");
			if (!hash || hash === "#") return;
			const target = document.querySelector(hash);
			if (target) {
				e.preventDefault();
				scrollToWithOffset(target, "smooth");
				history.pushState(null, "", hash);
			}
		});
	});

	if (location.hash) {
		const target = document.querySelector(location.hash);
		if (target) {
			setTimeout(() => scrollToWithOffset(target, "auto"), 0);
		}
	}
	const heroSlides = [
		{
			image: {
				light: "Assets/BannerRoblox.png",
				dark: "Assets/BannerRoblox.png",
			},
			creditText: "Roblox: Microwave Dinner by 1EpikDuck",
			creditUrl: "https://www.roblox.com/games/4344891683/",
		},
		{
			image: {
				light: "Assets/BannerCider.png",
				dark: "Assets/BannerCider.png",
			},
			creditText: "Cider by Cider Collective",
			creditUrl: "https://cider.sh/",
		},
		{
			image: {
				light: "Assets/BannerPrism.png",
				dark: "Assets/BannerPrism.png",
			},
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

		const getSlideImage = (slide) =>
			slide.image[getResolvedTheme()] ?? slide.image.light;

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
				`url("${getSlideImage(current)}")`,
			);
			heroEl.style.setProperty(
				"--hero-image-next",
				`url("${getSlideImage(current)}")`,
			);
			applyHeroCredit(current);
		};

		const updateHero = (index) => {
			if (isHeroFading) return;

			const nextHeroSlide = (index + heroSlides.length) % heroSlides.length;
			if (nextHeroSlide === currentHeroSlide) return;

			const next = heroSlides[nextHeroSlide];
			isHeroFading = true;

			heroEl.style.setProperty(
				"--hero-image-next",
				`url("${getSlideImage(next)}")`,
			);
			heroEl.classList.add("is-fading");
			applyHeroCredit(next);

			window.setTimeout(() => {
				heroEl.style.setProperty(
					"--hero-image-current",
					`url("${getSlideImage(next)}")`,
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
			creditUrl: "",
		},
		{
			captionHtml:
				"<strong>Window Snapping.</strong> Move the keyboard anywhere, or snap it to the centerline or the default position.",
			credit: "Cider by Cider Collective",
			creditUrl: "https://cider.sh/",
		},
		{
			caption: "Use your controller to move the mouse cursor. Click with ease.",
			credit: "",
			creditUrl: "",
		},
		{
			caption:
				"Feel the keyboard as you navigate with controller vibrations with every move.",
			credit: "",
			creditUrl: "",
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

		track.style.transform = `translateX(-${currentSlide * 100}%)`;

		dots.forEach((dot, i) => {
			const isActive = i === currentSlide;
			dot.classList.toggle("is-active", isActive);
			dot.setAttribute("aria-selected", isActive);
		});

		captionEl.innerHTML =
			slideData[currentSlide].captionHtml ?? slideData[currentSlide].caption;
		const { credit, creditUrl } = slideData[currentSlide];
		creditEl.textContent = credit;
		if (creditUrl) {
			creditEl.href = creditUrl;
			creditEl.target = "_blank";
			creditEl.rel = "noreferrer noopener";
			creditEl.setAttribute("aria-label", `Open credit link for ${credit}`);
		} else {
			creditEl.removeAttribute("href");
			creditEl.removeAttribute("target");
			creditEl.removeAttribute("rel");
			creditEl.removeAttribute("aria-label");
		}
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

	updateCarousel(0);
});
