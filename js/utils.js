// ===== Utils Module =====
// Common utility functions

// Notification System
export function initNotifications() {
    document.addEventListener('showNotification', (e) => {
        showNotification(e.detail);
    });
}

export function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
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
    setTimeout(() => notification.remove(), 3000);
}

// Preloader
export function initPreloader() {
    window.addEventListener('load', () => {
        setTimeout(() => {
            const preloader = document.getElementById('preloader');
            if (preloader) preloader.classList.add('hidden');
        }, 2000);
    });
}

// Back to Top Button
export function initBackToTop() {
    const backToTop = document.getElementById('back-to-top');
    if (!backToTop) return;

    window.addEventListener('scroll', () => {
        backToTop.classList.toggle('visible', window.scrollY > 500);
    });

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// Smooth Scroll for Navigation Links
export function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"], a[href^="/#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const href = this.getAttribute('href');
            const hash = href.includes('#') ? `#${href.split('#')[1]}` : href;
            const target = document.querySelector(hash);
            if (target) {
                window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
            }
        });
    });
}

// Scroll Reveal Animation
export function initScrollReveal() {
    if (typeof IntersectionObserver !== 'function') return;

    const addAnimStyle = () => {
        if (document.getElementById('rf-scrollreveal-style')) return;
        const s = document.createElement('style');
        s.id = 'rf-scrollreveal-style';
        s.textContent = '@keyframes slideIn{from{opacity:0;transform:translateX(100px)}to{opacity:1;transform:translateX(0)}}@keyframes slideOut{from{opacity:1;transform:translateX(0)}to{opacity:0;transform:translateX(100px)}}@keyframes fadeInUp{from{opacity:0;transform:translateY(30px)}to{opacity:1;transform:translateY(0)}}@keyframes rainbow{0%{filter:hue-rotate(0deg)}100%{filter:hue-rotate(360deg)}}';
        document.head.appendChild(s);
    };
    addAnimStyle();

    const revealElements = document.querySelectorAll('.service-card, .tech-card, .job-card, .income-card, .offer-card, .blog-card');
    if (revealElements.length === 0) return;

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            revealObserver.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    revealElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        revealObserver.observe(element);
    });
}

// Card Hover Effect
export function initCardEffects() {
    const cards = document.querySelectorAll('.service-card, .job-card, .income-card, .offer-card, .blog-card');
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
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

// Easter Egg - Konami Code
export function initEasterEgg() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                const event = new CustomEvent('showNotification', { detail: 'Konami Code activated! You found the secret!' });
                document.dispatchEvent(event);
                document.body.style.animation = 'rainbow 2s ease';
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}