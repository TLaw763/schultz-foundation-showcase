(function () {
  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var root = document.documentElement;
  var cookieStorageKey = "sf-cookie-preferences";
  var preloaderStorageKey = "sf-preloader-shown";

  root.classList.add(reduceMotion ? "sf-reduce-motion" : "sf-anim-ready");

  var heroSelectors = [
    ".header-84",
    ".header-62",
    ".header-62-2",
    ".header-62-3",
    ".header-62-5",
    ".header-47"
  ];

  var parallaxSectionSelectors = [
    ".layout-13 .component-2",
    ".layout-19 .component-2",
    ".layout-22 .component-2",
    ".layout-22-2 .component-2",
    ".layout-141 .container-6",
    ".layout-149 .container-25",
    ".layout-356 .content-style-13"
  ];

  var sectionRevealSelectors = [
    ".section-title-11",
    ".section-title-12",
    ".section-title-13",
    ".section-title-4",
    ".section-title-5",
    ".section-title-6",
    ".section-title-7",
    ".content-style-20",
    ".content-style-25",
    ".content-style-27",
    ".content-style-28",
    ".content-style-29",
    ".contact-info",
    ".form-block"
  ];

  function qsa(selector, scope) {
    return Array.prototype.slice.call((scope || document).querySelectorAll(selector));
  }

  function prepareReveal(elements, className) {
    elements.forEach(function (element) {
      element.classList.add("sf-reveal", className || "sf-reveal-up");
    });
  }

  function revealOnScroll(elements) {
    if (!elements.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("sf-visible");
        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -12% 0px",
      threshold: 0.16
    });

    elements.forEach(function (element) {
      observer.observe(element);
    });
  }

  function createElement(tagName, className, text) {
    var element = document.createElement(tagName);
    if (className) element.className = className;
    if (text) element.textContent = text;
    return element;
  }

  function getStorageItem(key) {
    try {
      return window.localStorage ? window.localStorage.getItem(key) : null;
    } catch (error) {
      return null;
    }
  }

  function setStorageItem(key, value) {
    try {
      if (window.localStorage) window.localStorage.setItem(key, value);
    } catch (error) {
      return;
    }
  }

  function getSessionItem(key) {
    try {
      return window.sessionStorage ? window.sessionStorage.getItem(key) : null;
    } catch (error) {
      return null;
    }
  }

  function setSessionItem(key, value) {
    try {
      if (window.sessionStorage) window.sessionStorage.setItem(key, value);
    } catch (error) {
      return;
    }
  }

  function setupPreloader() {
    if (getSessionItem(preloaderStorageKey)) return;
    setSessionItem(preloaderStorageKey, "true");

    var preloader = createElement("div", "sf-preloader");
    preloader.setAttribute("role", "status");
    preloader.setAttribute("aria-live", "polite");

    var panel = createElement("div", "sf-preloader__panel");
    var logo = document.querySelector(".primarylogo");
    var logoImage = createElement("img", "sf-preloader__logo");
    logoImage.alt = "Schultz Foundation";
    logoImage.src = logo ? logo.currentSrc || logo.src : "images/logowhite.png";

    var text = createElement("p", "sf-preloader__text", "Loading");
    var progress = createElement("div", "sf-preloader__progress");
    progress.appendChild(createElement("span", "sf-preloader__bar"));

    panel.appendChild(logoImage);
    panel.appendChild(text);
    panel.appendChild(progress);
    preloader.appendChild(panel);
    document.body.appendChild(preloader);

    function hidePreloader() {
      preloader.classList.add("sf-preloader--hidden");
      window.setTimeout(function () {
        preloader.remove();
      }, reduceMotion ? 0 : 520);
    }

    if (document.readyState === "complete") {
      window.setTimeout(hidePreloader, reduceMotion ? 0 : 300);
    } else {
      window.addEventListener("load", function () {
        window.setTimeout(hidePreloader, reduceMotion ? 0 : 450);
      }, { once: true });
    }
  }

  function setupCookieBanner() {
    if (getStorageItem(cookieStorageKey)) return;

    var banner = createElement("div", "sf-cookie-banner");
    banner.setAttribute("role", "dialog");
    banner.setAttribute("aria-label", "Cookie notice");

    var copy = createElement("p", "sf-cookie-banner__copy", "We use cookies to support core site functionality and future improvements. You can accept now or continue with essential cookies only.");
    var actions = createElement("div", "sf-cookie-banner__actions");
    var decline = createElement("button", "sf-cookie-banner__button sf-cookie-banner__button--secondary", "Essential only");
    var accept = createElement("button", "sf-cookie-banner__button", "Accept");

    decline.type = "button";
    accept.type = "button";

    function savePreference(value) {
      setStorageItem(cookieStorageKey, value);
      banner.classList.add("sf-cookie-banner--hidden");
      window.setTimeout(function () {
        banner.remove();
      }, reduceMotion ? 0 : 260);
    }

    decline.addEventListener("click", function () {
      savePreference("essential");
    });

    accept.addEventListener("click", function () {
      savePreference("accepted");
    });

    actions.appendChild(decline);
    actions.appendChild(accept);
    banner.appendChild(copy);
    banner.appendChild(actions);
    document.body.appendChild(banner);

    window.requestAnimationFrame(function () {
      banner.classList.add("sf-cookie-banner--visible");
    });
  }

  function setupAccessibleAccordions() {
    var accordions = qsa(".accordion");
    if (!accordions.length) return;

    root.classList.add("sf-accordion-ready");

    accordions.forEach(function (accordion, index) {
      var button = accordion.querySelector(".question-2");
      var answer = accordion.querySelector(".answer");
      if (!button || !answer) return;

      var answerId = answer.id || "sf-accordion-answer-" + index;
      answer.id = answerId;
      button.setAttribute("aria-controls", answerId);
      button.setAttribute("aria-expanded", "false");
      answer.setAttribute("aria-hidden", "true");
      answer.style.maxHeight = "0px";

      button.addEventListener("click", function (event) {
        event.preventDefault();
        event.stopPropagation();

        var isOpen = accordion.classList.toggle("sf-open");
        button.setAttribute("aria-expanded", isOpen ? "true" : "false");
        answer.setAttribute("aria-hidden", isOpen ? "false" : "true");
        answer.style.maxHeight = isOpen ? answer.scrollHeight + "px" : "0px";
      });
    });

    window.addEventListener("resize", function () {
      qsa(".accordion.sf-open .answer").forEach(function (answer) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      });
    });
  }

  function setupHeroes() {
    var heroChildren = [];

    qsa(heroSelectors.join(",")).forEach(function (hero) {
      qsa(".tagline-wrapper, .content-style, .content-style-3, .actions, h1, img", hero).forEach(function (child, index) {
        child.classList.add("sf-reveal", "sf-hero-reveal");
        child.style.setProperty("--sf-delay", Math.min(index * 120, 360) + "ms");
        heroChildren.push(child);
      });
    });

    window.setTimeout(function () {
      heroChildren.forEach(function (child) {
        child.classList.add("sf-visible");
      });
    }, 120);
  }

  function setupSectionReveals() {
    var elements = qsa(sectionRevealSelectors.join(",")).filter(function (element) {
      return !element.closest(".footer-11-5") && !element.classList.contains("sf-reveal");
    });

    elements.forEach(function (element, index) {
      element.classList.add("sf-reveal", "sf-reveal-up");
      element.style.setProperty("--sf-delay", Math.min(index % 3 * 90, 180) + "ms");
    });

    revealOnScroll(elements);
  }

  function setupStaggeredCards() {
    var groups = [];

    qsa(".row, .row-3, .row-4, .content-style-10, .content-style-21, .content-style-23, .component-3").forEach(function (group) {
      var cards = qsa(":scope > [class*='card'], :scope > [class*='column'], :scope > .stat, :scope > .accordion, :scope > .link-block-3", group)
        .filter(function (card) {
          return !card.classList.contains("card-13") && !card.closest(".footer-11-5");
        });

      if (cards.length < 2) return;

      cards.forEach(function (card, index) {
        card.classList.add("sf-reveal", "sf-card-reveal");
        card.style.setProperty("--sf-delay", Math.min(index * 140, 700) + "ms");
      });

      groups.push(group);
    });

    if (!groups.length) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;

        qsa(".sf-card-reveal", entry.target).forEach(function (card) {
          card.classList.add("sf-visible");
        });

        observer.unobserve(entry.target);
      });
    }, {
      rootMargin: "0px 0px -10% 0px",
      threshold: 0.12
    });

    groups.forEach(function (group) {
      observer.observe(group);
    });
  }

  function setupParallax() {
    var sections = qsa(parallaxSectionSelectors.join(",")).map(function (section) {
      var image = section.querySelector("img[class*='placeholder-image'], img:not(.primarylogo):not(.stars)");
      var text = section.querySelector(".content-style-2, .content-style-9, .content-style-13, .content-style-24");

      if (!image || !text) return null;

      image.classList.add("sf-parallax-image");
      text.classList.add("sf-parallax-text");

      return { section: section, image: image, text: text };
    }).filter(Boolean);

    if (!sections.length) return;

    prepareReveal(sections.map(function (item) { return item.text; }), "sf-reveal-left");
    prepareReveal(sections.map(function (item) { return item.image; }), "sf-reveal-right");
    revealOnScroll(sections.reduce(function (items, item) {
      items.push(item.text, item.image);
      return items;
    }, []));

    var ticking = false;

    function update() {
      ticking = false;
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      sections.forEach(function (item) {
        var rect = item.section.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        var progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        var imageMove = Math.max(-28, Math.min(28, progress * -44));
        var textMove = Math.max(-14, Math.min(14, progress * 22));

        item.image.style.setProperty("--sf-parallax-y", imageMove.toFixed(2) + "px");
        item.text.style.setProperty("--sf-parallax-y", textMove.toFixed(2) + "px");
      });
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  }

  function setupHeroBackgroundParallax() {
    var items = qsa(".header-84--hero-bg, .sf-page-hero").map(function (hero) {
      var bg = hero.querySelector(".sf-hero-parallax-bg");
      return bg ? { hero: hero, bg: bg } : null;
    }).filter(Boolean);

    if (!items.length) return;

    var ticking = false;

    function update() {
      ticking = false;
      var viewportHeight = window.innerHeight || document.documentElement.clientHeight;

      items.forEach(function (item) {
        var rect = item.hero.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > viewportHeight) return;

        var progress = (rect.top + rect.height / 2 - viewportHeight / 2) / viewportHeight;
        var move = Math.max(-72, Math.min(72, progress * -96));
        item.bg.style.transform = "translate3d(0, " + move.toFixed(2) + "px, 0)";
      });
    }

    function requestUpdate() {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);
  }

  function init() {
    setupPreloader();
    setupCookieBanner();
    setupAccessibleAccordions();

    if (!reduceMotion) {
      setupHeroes();
      setupSectionReveals();
      setupParallax();
      setupHeroBackgroundParallax();
      setupStaggeredCards();
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
