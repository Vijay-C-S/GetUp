(() => {
  // js/navbar.js
  function initNavbar() {
    const navbar = document.getElementById("navbar");
    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("nav-menu");
    const navLinks = document.querySelectorAll(".nav-link");
    window.addEventListener("scroll", () => {
      if (window.scrollY > 50) {
        navbar.classList.add("scrolled");
      } else {
        navbar.classList.remove("scrolled");
      }
    });
    hamburger.addEventListener("click", () => {
      hamburger.classList.toggle("active");
      navMenu.classList.toggle("active");
    });
    navLinks.forEach((link) => {
      link.addEventListener("click", () => {
        hamburger.classList.remove("active");
        navMenu.classList.remove("active");
      });
    });
    const sections = document.querySelectorAll("section[id]");
    window.addEventListener("scroll", () => {
      const scrollY = window.pageYOffset;
      sections.forEach((section) => {
        const sectionHeight = section.offsetHeight;
        const sectionTop = section.offsetTop - 100;
        const sectionId = section.getAttribute("id");
        const navLink = document.querySelector(`.nav-link[href="#${sectionId}"]`);
        if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          navLinks.forEach((link) => link.classList.remove("active"));
          navLink.classList.add("active");
        }
      });
    });
  }

  // js/theme.js
  function initTheme() {
    const themeToggle = document.getElementById("theme-toggle");
    const body = document.body;
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme) {
      body.setAttribute("data-theme", savedTheme);
      updateThemeIcon(savedTheme);
    }
    themeToggle.addEventListener("click", () => {
      const currentTheme = body.getAttribute("data-theme");
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      body.setAttribute("data-theme", newTheme);
      localStorage.setItem("theme", newTheme);
      updateThemeIcon(newTheme);
    });
    function updateThemeIcon(theme) {
      const icon = themeToggle.querySelector("i");
      icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    }
  }

  // js/hero.js
  function initHero() {
    const counters = document.querySelectorAll(".stat-number");
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const counter = entry.target;
          const target = parseInt(counter.getAttribute("data-count"));
          animateCounter(counter, target);
          counterObserver.unobserve(counter);
        }
      });
    }, { threshold: 0.5 });
    counters.forEach((counter) => counterObserver.observe(counter));
    window.addEventListener("scroll", () => {
      const scrolled = window.pageYOffset;
      const shapes = document.querySelectorAll(".shape");
      shapes.forEach((shape, index) => {
        const speed = (index + 1) * 0.1;
        shape.style.transform = `translateY(${scrolled * speed}px)`;
      });
    });
    const heroTitle = document.querySelector(".hero-title");
    if (heroTitle) {
      const spans = heroTitle.querySelectorAll(".gradient-text");
      spans.forEach((span, index) => {
        span.style.animation = `fadeInUp 0.8s ease ${index * 0.3}s forwards`;
        span.style.opacity = "0";
      });
    }
  }
  function animateCounter(element, target) {
    let current = 0;
    const increment = target / 100;
    const duration = 2e3;
    const stepTime = duration / 100;
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target.toLocaleString();
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current).toLocaleString();
      }
    }, stepTime);
  }
  var typingStyle = document.createElement("style");
  typingStyle.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
`;
  document.head.appendChild(typingStyle);

  // js/jobs.js
  var doc = document;
  var qsa = (selector, root = doc) => Array.from(root.querySelectorAll(selector));
  var qs = (selector, root = doc) => root.querySelector(selector);
  function getActiveFilter() {
    const activeBtn = qs(".filter-btn.active");
    return activeBtn ? activeBtn.getAttribute("data-filter") : "all";
  }
  function getSearchQuery() {
    const searchInput = qs("#job-search");
    return searchInput ? searchInput.value.toLowerCase().trim() : "";
  }
  function getCardSearchText(card) {
    const selectors = [".job-title", ".job-info h4", ".job-location", ".job-badge", ".salary", ".job-type"];
    let text = "";
    selectors.forEach((selector) => {
      const el = qs(selector, card);
      if (el) text += `${el.textContent} `;
    });
    qsa(".tag", card).forEach((tag) => {
      text += `${tag.textContent} `;
    });
    return text.toLowerCase();
  }
  function filterAndSearchJobs() {
    const filter = getActiveFilter();
    const query = getSearchQuery();
    const jobCards = qsa(".job-card");
    let visibleCount = 0;
    const totalCount = jobCards.length;
    jobCards.forEach((card) => {
      const matchesFilter = filter === "all" || card.getAttribute("data-type") === filter;
      const matchesSearch = !query || getCardSearchText(card).includes(query);
      if (matchesFilter && matchesSearch) {
        card.style.display = "block";
        visibleCount += 1;
      } else {
        card.style.display = "none";
      }
    });
    const noResults = qs("#no-results");
    if (noResults) noResults.style.display = visibleCount === 0 ? "block" : "none";
  }
  function showNotification(message) {
    const notification = doc.createElement("div");
    notification.className = "notification";
    notification.innerHTML = message;
    notification.style.cssText = "position:fixed;bottom:100px;right:30px;padding:1rem 1.5rem;background:linear-gradient(135deg,#6366f1,#0ea5e9);color:white;border-radius:10px;font-weight:500;z-index:9999;animation:slideIn 0.3s ease,slideOut 0.3s ease 2.7s forwards;";
    doc.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3e3);
  }
  function initJobs() {
    const filterBtns = qsa(".filter-btn");
    const jobSearchInput = qs("#job-search");
    const jobSearchClear = qs("#job-search-clear");
    if (filterBtns.length === 0 && !jobSearchInput) return;
    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterBtns.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        filterAndSearchJobs();
      });
    });
    if (jobSearchInput) {
      let searchTimeout = null;
      jobSearchInput.addEventListener("input", () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(() => {
          filterAndSearchJobs();
          if (jobSearchClear) jobSearchClear.style.display = jobSearchInput.value ? "flex" : "none";
        }, 200);
      });
    }
    if (jobSearchClear && jobSearchInput) {
      jobSearchClear.addEventListener("click", () => {
        jobSearchInput.value = "";
        jobSearchClear.style.display = "none";
        filterAndSearchJobs();
        jobSearchInput.focus();
      });
    }
    checkJobDeadlines();
    const bookmarkBtns = qsa(".bookmark-btn");
    bookmarkBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const icon = qs("i", btn);
        if (!icon) return;
        icon.classList.toggle("far");
        icon.classList.toggle("fas");
        showNotification(icon.classList.contains("fas") ? "Job bookmarked!" : "Bookmark removed");
      });
    });
    const countdowns = qsa(".countdown");
    if (countdowns.length > 0) {
      setInterval(() => {
        countdowns.forEach((countdown) => {
          const parts = countdown.textContent.split(":").map((p) => parseInt(p, 10));
          if (parts.length !== 3 || parts.some((p) => isNaN(p))) return;
          let [h, m, s] = parts;
          if (--s < 0) {
            s = 59;
            if (--m < 0) {
              m = 59;
              if (--h < 0) h = 23;
            }
          }
          countdown.textContent = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
        });
      }, 1e3);
    }
  }
  function checkJobDeadlines() {
    const now = /* @__PURE__ */ new Date();
    qsa(".job-card[data-deadline]").forEach((card) => {
      const deadline = new Date(card.getAttribute("data-deadline") || "");
      if (!(deadline instanceof Date) || isNaN(deadline.getTime()) || now <= deadline) return;
      const deadlineTag = qs(".deadline-tag", card) || qs('.tag[style*="color: #ef4444"]', card);
      const applyBtn = qs(".apply-btn", card);
      const viewJobBtn = qs(".view-job-btn", card);
      const badge = qs(".job-badge", card);
      if (deadlineTag) {
        deadlineTag.textContent = "Closed";
        deadlineTag.style.background = "#f3f4f6";
        deadlineTag.style.color = "#6b7280";
      }
      if (applyBtn) {
        applyBtn.textContent = "Closed";
        applyBtn.style.background = "#9ca3af";
        applyBtn.style.cursor = "not-allowed";
        applyBtn.style.pointerEvents = "none";
      }
      if (viewJobBtn) {
        viewJobBtn.innerHTML = '<i class="fas fa-ban"></i> Closed';
        viewJobBtn.style.background = "#9ca3af";
        viewJobBtn.style.cursor = "not-allowed";
        viewJobBtn.style.pointerEvents = "none";
      }
      if (badge) {
        badge.textContent = "CLOSED";
        badge.style.background = "linear-gradient(135deg, #6b7280, #4b5563)";
      }
      card.style.borderColor = "#d1d5db";
      card.classList.remove("hot-job");
      card.classList.add("expired-job");
    });
    setTimeout(checkJobDeadlines, 6e4);
  }

  // js/offers.js
  var doc2 = document;
  function initOffers() {
    const offerCards = doc2.querySelectorAll(".offer-card");
    if (offerCards.length === 0) return;
    if (typeof IntersectionObserver !== "function") {
      offerCards.forEach((card) => {
        card.style.opacity = "1";
        card.style.transform = "translateY(0)";
      });
      return;
    }
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    offerCards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      observer.observe(card);
    });
  }

  // js/utils.js
  function initNotifications() {
    document.addEventListener("showNotification", (e) => {
      showNotification2(e.detail);
    });
  }
  function showNotification2(message) {
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.innerHTML = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 100px;
        right: 30px;
        padding: 1rem 1.5rem;
        background: linear-gradient(135deg, #6366f1, #0ea5e9);
        color: white;
        border-radius: 10px;
        font-weight: 500;
        z-index: 9999;
        animation: slideIn 0.3s ease, slideOut 0.3s ease 2.7s forwards;
        box-shadow: 0 10px 30px rgba(99, 102, 241, 0.4);
    `;
    document.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3e3);
  }
  function initPreloader() {
    window.addEventListener("load", () => {
      setTimeout(() => {
        const preloader = document.getElementById("preloader");
        if (preloader) preloader.classList.add("hidden");
      }, 2e3);
    });
  }
  function initBackToTop() {
    const backToTop = document.getElementById("back-to-top");
    if (!backToTop) return;
    window.addEventListener("scroll", () => {
      backToTop.classList.toggle("visible", window.scrollY > 500);
    });
    backToTop.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach((anchor) => {
      anchor.addEventListener("click", function(e) {
        e.preventDefault();
        const href = this.getAttribute("href");
        const hash = href.includes("#") ? `#${href.split("#")[1]}` : href;
        const target = document.querySelector(hash);
        if (target) {
          window.scrollTo({ top: target.offsetTop - 80, behavior: "smooth" });
        }
      });
    });
  }
  function initScrollReveal() {
    if (typeof IntersectionObserver !== "function") return;
    const addAnimStyle = () => {
      if (document.getElementById("rf-scrollreveal-style")) return;
      const s = document.createElement("style");
      s.id = "rf-scrollreveal-style";
      s.textContent = "@keyframes slideIn{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}@keyframes slideOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(100px)}}@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}@keyframes rainbow{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}";
      document.head.appendChild(s);
    };
    addAnimStyle();
    const revealElements = document.querySelectorAll(".service-card, .tech-card, .job-card, .income-card, .offer-card, .blog-card");
    if (revealElements.length === 0) return;
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
        revealObserver.unobserve(entry.target);
      });
    }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });
    revealElements.forEach((element) => {
      element.style.opacity = "0";
      element.style.transform = "translateY(30px)";
      element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
      revealObserver.observe(element);
    });
  }
  function initCardEffects() {
    const cards = document.querySelectorAll(".service-card, .job-card, .income-card, .offer-card, .blog-card");
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / 20;
        const rotateY = (centerX - x) / 20;
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
      });
      card.addEventListener("mouseleave", () => {
        card.style.transform = "perspective(1000px) rotateX(0) rotateY(0) translateY(0)";
      });
    });
  }
  function initEasterEgg() {
    const konamiCode = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];
    let konamiIndex = 0;
    document.addEventListener("keydown", (e) => {
      if (e.key === konamiCode[konamiIndex]) {
        konamiIndex++;
        if (konamiIndex === konamiCode.length) {
          const event = new CustomEvent("showNotification", { detail: "Konami Code activated! You found the secret!" });
          document.dispatchEvent(event);
          document.body.style.animation = "rainbow 2s ease";
          konamiIndex = 0;
        }
      } else {
        konamiIndex = 0;
      }
    });
  }

  // js/contact.js
  function initContact() {
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        showNotification2("Message sent successfully! We will get back to you soon.");
        contactForm.reset();
      });
    }
  }

  // js/main.js
  document.addEventListener("DOMContentLoaded", () => {
    initPreloader();
    initNavbar();
    initTheme();
    initSmoothScroll();
    initNotifications();
    initBackToTop();
    initHero();
    initJobs();
    initOffers();
    initContact();
    initScrollReveal();
    initCardEffects();
    initEasterEgg();
    initWhatsAppFloat();
    initForms();
    console.log("%c GetUp", "font-size: 24px; font-weight: bold; color: #6366f1;");
    console.log("%c Welcome to GetUp - Your Gateway to Success!", "font-size: 14px; color: #0ea5e9;");
  });
  function initWhatsAppFloat() {
    if (document.querySelector(".whatsapp-float")) return;
    const styleId = "gu-whatsapp-float-style";
    if (!document.getElementById(styleId)) {
      const waStyle = document.createElement("style");
      waStyle.id = styleId;
      waStyle.textContent = `.whatsapp-float{position:fixed;bottom:42px;right:42px;width:60px;height:60px;background-color:#25d366;border-radius:50%;display:flex;justify-content:center;align-items:center;box-shadow:2px 2px 10px rgba(0,0,0,0.2);z-index:2147483647;animation:pulse-animation 2s infinite}.whatsapp-float img{width:35px;height:35px}@keyframes pulse-animation{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(37,211,102,0.7)}50%{transform:scale(1.1);box-shadow:0 0 0 15px rgba(37,211,102,0)}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(37,211,102,0)}}.whatsapp-float:hover{animation:none;transform:scale(1.1);transition:transform 0.2s ease-in-out}@media(max-width:576px){.whatsapp-float{right:18px;bottom:22px;width:52px;height:52px}.whatsapp-float img{width:28px;height:28px}}`;
      document.head.appendChild(waStyle);
    }
    const waLink = document.createElement("a");
    waLink.href = "https://whatsapp.com/channel/0029Vb7OqCF3QxS6oVWKm83a";
    waLink.className = "whatsapp-float";
    waLink.target = "_blank";
    waLink.rel = "noopener noreferrer";
    waLink.setAttribute("aria-label", "Follow us on WhatsApp Channel");
    waLink.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Follow us on WhatsApp" />';
    document.body.appendChild(waLink);
  }
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }
  function initForms() {
    const newsletterForm = document.getElementById("newsletter-form");
    const contactForm = document.getElementById("contact-form");
    if (newsletterForm) {
      newsletterForm.addEventListener("submit", (e) => {
        e.preventDefault();
        const input = newsletterForm.querySelector("input");
        const email = input ? input.value : "";
        if (validateEmail(email)) {
          showNotification2("Successfully subscribed! Welcome aboard!");
          newsletterForm.reset();
        } else {
          showNotification2("Please enter a valid email address");
        }
      });
    }
    if (contactForm) {
      contactForm.addEventListener("submit", (e) => {
        e.preventDefault();
        showNotification2("Message sent successfully! We will get back to you soon.");
        contactForm.reset();
      });
    }
  }
})();
//# sourceMappingURL=script.js.map
