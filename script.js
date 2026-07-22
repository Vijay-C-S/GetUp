(() => {
    'use strict';

    const doc = document;

    const qsa = (selector, root = doc) => Array.from(root.querySelectorAll(selector));
    const qs = (selector, root = doc) => root.querySelector(selector);

    const onReady = (callback) => {
        if (doc.readyState === 'loading') {
            doc.addEventListener('DOMContentLoaded', callback, { once: true });
            return;
        }
        callback();
    };

    const safeStorage = {
        get(key) {
            try {
                return window.localStorage.getItem(key);
            } catch {
                return null;
            }
        },
        set(key, value) {
            try {
                window.localStorage.setItem(key, value);
            } catch {
                // Ignore storage failures (private mode or blocked storage).
            }
        }
    };

    function ensureWhatsAppFloat() {
        if (qs('.whatsapp-float')) {
            return;
        }

        const styleId = 'gu-whatsapp-float-style';
        if (!doc.getElementById(styleId)) {
            const waStyle = doc.createElement('style');
            waStyle.id = styleId;
            waStyle.textContent = '.whatsapp-float{position:fixed;bottom:42px;right:42px;width:60px;height:60px;background-color:#25d366;border-radius:50%;display:flex;justify-content:center;align-items:center;box-shadow:2px 2px 10px rgba(0,0,0,0.2);z-index:2147483647;animation:pulse-animation 2s infinite}.whatsapp-float img{width:35px;height:35px}@keyframes pulse-animation{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(37,211,102,0.7)}50%{transform:scale(1.1);box-shadow:0 0 0 15px rgba(37,211,102,0)}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(37,211,102,0)}}.whatsapp-float:hover{animation:none;transform:scale(1.1);transition:transform 0.2s ease-in-out}@media (max-width:576px){.whatsapp-float{right:18px;bottom:22px;width:52px;height:52px}.whatsapp-float img{width:28px;height:28px}}';
            doc.head.appendChild(waStyle);
        }

        const waLink = doc.createElement('a');
        waLink.href = 'https://whatsapp.com/channel/0029Vb7OqCF3QxS6oVWKm83a';
        waLink.className = 'whatsapp-float';
        waLink.target = '_blank';
        waLink.rel = 'noopener noreferrer';
        waLink.setAttribute('aria-label', 'Follow us on WhatsApp Channel');
        waLink.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Follow us on WhatsApp" />';
        doc.body.appendChild(waLink);
    }

    function initPreloader() {
        const preloader = doc.getElementById('preloader');
        if (!preloader) {
            return;
        }

        window.addEventListener('load', () => {
            window.setTimeout(() => {
                preloader.classList.add('hidden');
            }, 2000);
        });
    }

    function initNavbar() {
        const navbar = doc.getElementById('navbar');
        const hamburger = doc.getElementById('hamburger');
        const navMenu = doc.getElementById('nav-menu');
        const navLinks = qsa('.nav-link');

        if (navbar) {
            window.addEventListener('scroll', () => {
                navbar.classList.toggle('scrolled', window.scrollY > 50);
            });
        }

        if (hamburger && navMenu) {
            const closeMenu = () => {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                hamburger.setAttribute('aria-expanded', 'false');
            };

            hamburger.setAttribute('aria-expanded', 'false');
            hamburger.addEventListener('click', (event) => {
                event.preventDefault();
                const isOpen = navMenu.classList.toggle('active');
                hamburger.classList.toggle('active', isOpen);
                hamburger.setAttribute('aria-expanded', String(isOpen));
            });

            navLinks.forEach((link) => {
                link.addEventListener('click', closeMenu);
            });

            doc.addEventListener('click', (event) => {
                const target = event.target;
                if (!(target instanceof Element)) {
                    return;
                }

                if (!navMenu.contains(target) && !hamburger.contains(target)) {
                    closeMenu();
                }
            });

            window.addEventListener('resize', () => {
                if (window.innerWidth > 900) {
                    closeMenu();
                }
            });
        }

        const sections = qsa('section[id]');
        if (sections.length === 0 || navLinks.length === 0) {
            return;
        }

        window.addEventListener('scroll', () => {
            const scrollY = window.pageYOffset;

            sections.forEach((section) => {
                const sectionHeight = section.offsetHeight;
                const sectionTop = section.offsetTop - 100;
                const sectionId = section.getAttribute('id');
                const navLink = qs(`.nav-link[href="#${sectionId}"], .nav-link[href="/#${sectionId}"]`);

                if (navLink && scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
                    navLinks.forEach((link) => link.classList.remove('active'));
                    navLink.classList.add('active');
                }
            });
        });
    }

    function initTheme() {
        const body = doc.body;
        const themeToggle = doc.getElementById('theme-toggle');
        const savedTheme = safeStorage.get('theme');
        const initialTheme = savedTheme === 'light' || savedTheme === 'dark' ? savedTheme : 'dark';

        body.setAttribute('data-theme', initialTheme);

        if (!themeToggle) {
            return;
        }

        themeToggle.addEventListener('click', (event) => {
            event.preventDefault();
            const currentTheme = body.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            body.setAttribute('data-theme', newTheme);
            safeStorage.set('theme', newTheme);
        });
    }

    function setCounterValue(element, target) {
        if (!Number.isFinite(target) || target < 0) {
            return;
        }
        element.textContent = Math.floor(target).toLocaleString();
    }

    function animateCounter(element, target) {
        if (!Number.isFinite(target) || target < 0) {
            return;
        }

        const startValue = Number.parseInt((element.textContent || '0').replace(/,/g, ''), 10);
        if (Number.isFinite(startValue) && startValue >= target) {
            setCounterValue(element, target);
            return;
        }

        let current = Number.isFinite(startValue) && startValue >= 0 ? startValue : 0;
        const frames = 100;
        const increment = (target - current) / frames;
        const duration = 2000;
        const stepTime = duration / frames;

        const timer = window.setInterval(() => {
            current += increment;
            if (current >= target) {
                setCounterValue(element, target);
                window.clearInterval(timer);
                return;
            }

            element.textContent = Math.floor(current).toLocaleString();
        }, stepTime);
    }

    function initCounters() {
        const counters = qsa('.stat-number');
        if (counters.length === 0) {
            return;
        }

        if (typeof window.IntersectionObserver !== 'function') {
            counters.forEach((counter) => {
                const target = Number.parseInt(counter.getAttribute('data-count') || '0', 10);
                setCounterValue(counter, target);
            });
            return;
        }

        const counterObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                const counter = entry.target;
                const target = Number.parseInt(counter.getAttribute('data-count') || '0', 10);
                animateCounter(counter, target);
                observer.unobserve(counter);
            });
        }, { threshold: 0.3 });

        counters.forEach((counter) => counterObserver.observe(counter));
    }

    function getActiveFilter() {
        const activeBtn = qs('.filter-btn.active');
        return activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
    }

    function getSearchQuery() {
        const searchInput = doc.getElementById('job-search');
        return searchInput ? searchInput.value.toLowerCase().trim() : '';
    }

    function getCardSearchText(card) {
        const selectors = [
            '.job-title',
            '.job-info h4',
            '.job-location',
            '.job-badge',
            '.salary',
            '.job-type'
        ];

        let text = '';
        selectors.forEach((selector) => {
            const el = qs(selector, card);
            if (el) {
                text += `${el.textContent} `;
            }
        });

        qsa('.tag', card).forEach((tag) => {
            text += `${tag.textContent} `;
        });

        return text.toLowerCase();
    }

    function initJobFilters() {
        const filterBtns = qsa('.filter-btn');
        const jobCards = qsa('.job-card');
        const jobSearchInput = doc.getElementById('job-search');
        const jobSearchClear = doc.getElementById('job-search-clear');

        if (filterBtns.length === 0 && !jobSearchInput && !jobSearchClear) {
            return;
        }

        const filterAndSearchJobs = () => {
            const filter = getActiveFilter();
            const query = getSearchQuery();
            let visibleCount = 0;
            const totalCount = jobCards.length;

            jobCards.forEach((card) => {
                const matchesFilter = filter === 'all' || card.getAttribute('data-type') === filter;
                const matchesSearch = !query || getCardSearchText(card).includes(query);

                if (matchesFilter && matchesSearch) {
                    card.style.display = 'block';
                    card.style.animation = 'fadeIn 0.5s ease';
                    visibleCount += 1;
                    return;
                }

                card.style.display = 'none';
            });

            const noResults = doc.getElementById('no-results');
            const searchCount = doc.getElementById('job-search-count');

            if (noResults) {
                noResults.style.display = visibleCount === 0 ? 'block' : 'none';
            }

            if (searchCount) {
                searchCount.textContent = query ? `Showing ${visibleCount} of ${totalCount} jobs` : '';
            }
        };

        filterBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                filterBtns.forEach((button) => button.classList.remove('active'));
                btn.classList.add('active');
                filterAndSearchJobs();
            });
        });

        if (jobSearchInput) {
            let searchTimeout = null;
            jobSearchInput.addEventListener('input', () => {
                if (searchTimeout) {
                    window.clearTimeout(searchTimeout);
                }

                searchTimeout = window.setTimeout(() => {
                    filterAndSearchJobs();
                    if (jobSearchClear) {
                        jobSearchClear.style.display = jobSearchInput.value ? 'flex' : 'none';
                    }
                }, 200);
            });
        }

        if (jobSearchClear && jobSearchInput) {
            jobSearchClear.addEventListener('click', () => {
                jobSearchInput.value = '';
                jobSearchClear.style.display = 'none';
                filterAndSearchJobs();
                jobSearchInput.focus();
            });
        }

        const style = doc.createElement('style');
        style.textContent = '@keyframes fadeIn{from{opacity:0;transform:translateY(20px)}to{opacity:1;transform:translateY(0)}}';
        doc.head.appendChild(style);
    }

    function initJobDeadlines() {
        const checkJobDeadlines = () => {
            const jobCardsWithDeadline = qsa('.job-card[data-deadline]');
            const now = new Date();

            jobCardsWithDeadline.forEach((card) => {
                const deadlineStr = card.getAttribute('data-deadline');
                const deadline = new Date(deadlineStr || '');
                if (!(deadline instanceof Date) || Number.isNaN(deadline.getTime()) || now <= deadline) {
                    return;
                }

                const deadlineTag = qs('.deadline-tag', card) || qs('.tag[style*="color: #ef4444"]', card);
                const applyBtn = qs('.apply-btn', card);
                const viewJobBtn = qs('.view-job-btn', card);
                const badge = qs('.job-badge', card);

                if (deadlineTag) {
                    deadlineTag.textContent = 'Closed';
                    deadlineTag.style.background = '#f3f4f6';
                    deadlineTag.style.color = '#6b7280';
                }

                if (applyBtn) {
                    applyBtn.textContent = 'Closed';
                    applyBtn.style.background = '#9ca3af';
                    applyBtn.style.cursor = 'not-allowed';
                    applyBtn.style.pointerEvents = 'none';
                    applyBtn.removeAttribute('href');
                }

                if (viewJobBtn) {
                    viewJobBtn.innerHTML = '<i class="fas fa-ban"></i> Closed';
                    viewJobBtn.style.background = '#9ca3af';
                    viewJobBtn.style.cursor = 'not-allowed';
                    viewJobBtn.style.pointerEvents = 'none';
                    viewJobBtn.removeAttribute('href');
                }

                if (badge) {
                    badge.textContent = 'CLOSED';
                    badge.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)';
                }

                card.style.borderColor = '#d1d5db';
                card.classList.remove('hot-job');
                card.classList.add('expired-job');
            });
        };

        checkJobDeadlines();
        window.setInterval(checkJobDeadlines, 60000);
    }

    function showNotification(message) {
        const notification = doc.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = message;
        notification.style.cssText = 'position:fixed;bottom:100px;right:30px;padding:1rem 1.5rem;background:linear-gradient(135deg,#6366f1,#0ea5e9);color:white;border-radius:10px;font-weight:500;z-index:9999;animation:slideIn 0.3s ease,slideOut 0.3s ease 2.7s;box-shadow:0 10px 30px rgba(99,102,241,0.4)';

        doc.body.appendChild(notification);
        window.setTimeout(() => notification.remove(), 3000);
    }

    function initNotificationsStyle() {
        if (doc.getElementById('rf-notification-keyframes')) {
            return;
        }

        const notifStyle = doc.createElement('style');
        notifStyle.id = 'rf-notification-keyframes';
        notifStyle.textContent = '@keyframes slideIn{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}@keyframes slideOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(100px)}}';
        doc.head.appendChild(notifStyle);
    }

    function initBookmarks() {
        const bookmarkBtns = qsa('.bookmark-btn');
        bookmarkBtns.forEach((btn) => {
            btn.addEventListener('click', () => {
                const icon = qs('i', btn);
                if (!icon) {
                    return;
                }

                icon.classList.toggle('far');
                icon.classList.toggle('fas');
                showNotification(icon.classList.contains('fas') ? 'Job bookmarked successfully!' : 'Bookmark removed');
            });
        });
    }

    function initCountdowns() {
        const countdowns = qsa('.countdown');
        if (countdowns.length === 0) {
            return;
        }

        const tick = () => {
            countdowns.forEach((countdown) => {
                const parts = countdown.textContent.split(':').map((part) => Number.parseInt(part, 10));
                if (parts.length !== 3 || parts.some((part) => Number.isNaN(part))) {
                    return;
                }

                let [hours, minutes, seconds] = parts;
                seconds -= 1;
                if (seconds < 0) {
                    seconds = 59;
                    minutes -= 1;
                }
                if (minutes < 0) {
                    minutes = 59;
                    hours -= 1;
                }
                if (hours < 0) {
                    hours = 23;
                }

                countdown.textContent = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
            });
        };

        window.setInterval(tick, 1000);
    }

    function initBackToTop() {
        const backToTop = doc.getElementById('back-to-top');
        if (!backToTop) {
            return;
        }

        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 500);
        });

        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    function initForms() {
        const newsletterForm = doc.getElementById('newsletter-form');
        const contactForm = doc.getElementById('contact-form');

        if (newsletterForm) {
            newsletterForm.addEventListener('submit', (event) => {
                event.preventDefault();
                const input = qs('input', newsletterForm);
                const email = input ? input.value : '';

                if (validateEmail(email)) {
                    showNotification('Successfully subscribed! Welcome aboard!');
                    newsletterForm.reset();
                    return;
                }

                showNotification('Please enter a valid email address');
            });
        }

        if (contactForm) {
            contactForm.addEventListener('submit', (event) => {
                event.preventDefault();
                showNotification('Message sent successfully! We will get back to you soon.');
                contactForm.reset();
            });
        }
    }

    function initScrollReveal() {
        const revealElements = qsa('.service-card, .tech-card, .job-card, .income-card, .offer-card, .testimonial-card');
        if (revealElements.length === 0 || typeof window.IntersectionObserver !== 'function') {
            return;
        }

        const revealObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (!entry.isIntersecting) {
                    return;
                }

                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                revealObserver.unobserve(entry.target);
            });
        }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

        revealElements.forEach((element) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            revealObserver.observe(element);
        });
    }

    function initParallaxShapes() {
        const shapes = qsa('.shape');
        if (shapes.length === 0) {
            return;
        }

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.1;
                shape.style.transform = `translateY(${scrolled * speed}px)`;
            });
        });
    }

    function initHeroTitleAnimation() {
        const heroTitle = qs('.hero-title');
        if (!heroTitle) {
            return;
        }

        const spans = qsa('.gradient-text', heroTitle);
        spans.forEach((span, index) => {
            span.style.animation = `fadeInUp 0.8s ease ${index * 0.3}s forwards`;
            span.style.opacity = '0';
        });

        if (!doc.getElementById('rf-fadeup-keyframes')) {
            const typingStyle = doc.createElement('style');
            typingStyle.id = 'rf-fadeup-keyframes';
            typingStyle.textContent = '@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}';
            doc.head.appendChild(typingStyle);
        }
    }

    function initSmoothScroll() {
        qsa('a[href^="#"], a[href^="/#"]').forEach((anchor) => {
            anchor.addEventListener('click', (event) => {
                const href = anchor.getAttribute('href');
                if (!href) {
                    return;
                }

                const hash = href.includes('#') ? `#${href.split('#')[1]}` : href;
                if (!hash || hash === '#') {
                    return;
                }

                const target = qs(hash);
                if (!target) {
                    return;
                }

                event.preventDefault();
                const offsetTop = target.offsetTop - 80;
                window.scrollTo({ top: offsetTop, behavior: 'smooth' });
            });
        });
    }

    function initCardEffects() {
        const cards = qsa('.service-card, .job-card, .income-card, .offer-card');
        cards.forEach((card) => {
            card.addEventListener('mousemove', (event) => {
                const rect = card.getBoundingClientRect();
                const x = event.clientX - rect.left;
                const y = event.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = (y - centerY) / 20;
                const rotateY = (centerX - x) / 20;

                card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-10px)`;
            });

            card.addEventListener('mouseleave', () => {
                card.style.transform = 'perspective(1000px) rotateX(0) rotateY(0) translateY(0)';
            });
        });
    }

    function initKonamiCode() {
        const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
        let konamiIndex = 0;

        doc.addEventListener('keydown', (event) => {
            if (event.key === konamiCode[konamiIndex]) {
                konamiIndex += 1;
                if (konamiIndex === konamiCode.length) {
                    showNotification('Konami Code activated! You found the secret!');
                    doc.body.style.animation = 'rainbow 2s ease';
                    konamiIndex = 0;
                }
                return;
            }

            konamiIndex = 0;
        });

        if (!doc.getElementById('rf-rainbow-keyframes')) {
            const rainbowStyle = doc.createElement('style');
            rainbowStyle.id = 'rf-rainbow-keyframes';
            rainbowStyle.textContent = '@keyframes rainbow{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}';
            doc.head.appendChild(rainbowStyle);
        }
    }

    function applyA11yEnhancements() {
        if (window.__guA11yInitialized) {
            return;
        }

        window.__guA11yInitialized = true;

        qsa('button.bookmark-btn').forEach((btn) => {
            if (!btn.getAttribute('type')) {
                btn.setAttribute('type', 'button');
            }
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', 'Bookmark this job');
            }
        });

        qsa('button.share-btn, button.mobile-sticky-share').forEach((btn) => {
            if (!btn.getAttribute('type')) {
                btn.setAttribute('type', 'button');
            }
            if (!btn.getAttribute('aria-label')) {
                btn.setAttribute('aria-label', 'Share this item');
            }
        });
    }

    onReady(() => {
        ensureWhatsAppFloat();
        initNotificationsStyle();
        initPreloader();
        initNavbar();
        initTheme();
        initCounters();
        initJobFilters();
        initJobDeadlines();
        initBookmarks();
        initCountdowns();
        initBackToTop();
        initForms();
        initScrollReveal();
        initParallaxShapes();
        initHeroTitleAnimation();
        initSmoothScroll();
        initCardEffects();
        initKonamiCode();
        applyA11yEnhancements();

        if ('serviceWorker' in navigator) {
            window.addEventListener('load', () => {
                console.log('GetUp website loaded successfully!');
            });
        }

        console.log('%c GetUp', 'font-size: 24px; font-weight: bold; color: #6366f1');
        console.log('%c Welcome to GetUp - Your Gateway to Success!', 'font-size: 14px; color: #0ea5e9;');
    });
})();
