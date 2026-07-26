// ===== Main Application Entry Point =====
// Import and initialize all modules

import { initNavbar } from './navbar.js';
import { initTheme } from './theme.js';
import { initHero } from './hero.js';
import { initJobs } from './jobs.js';
import { initOffers } from './offers.js';
import { initContact } from './contact.js';
import {
    initNotifications,
    initPreloader,
    initBackToTop,
    initSmoothScroll,
    initScrollReveal,
    initCardEffects,
    initEasterEgg,
    showNotification
} from './utils.js';

// Initialize all modules when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
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

    console.log('%c GetUp', 'font-size: 24px; font-weight: bold; color: #6366f1;');
    console.log('%c Welcome to GetUp - Your Gateway to Success!', 'font-size: 14px; color: #0ea5e9;');
});

function initWhatsAppFloat() {
    if (document.querySelector('.whatsapp-float')) return;

    const styleId = 'gu-whatsapp-float-style';
    if (!document.getElementById(styleId)) {
        const waStyle = document.createElement('style');
        waStyle.id = styleId;
        waStyle.textContent = `.whatsapp-float{position:fixed;bottom:42px;right:42px;width:60px;height:60px;background-color:#25d366;border-radius:50%;display:flex;justify-content:center;align-items:center;box-shadow:2px 2px 10px rgba(0,0,0,0.2);z-index:2147483647;animation:pulse-animation 2s infinite}.whatsapp-float img{width:35px;height:35px}@keyframes pulse-animation{0%{transform:scale(1);box-shadow:0 0 0 0 rgba(37,211,102,0.7)}50%{transform:scale(1.1);box-shadow:0 0 0 15px rgba(37,211,102,0)}100%{transform:scale(1);box-shadow:0 0 0 0 rgba(37,211,102,0)}}.whatsapp-float:hover{animation:none;transform:scale(1.1);transition:transform 0.2s ease-in-out}@media(max-width:576px){.whatsapp-float{right:18px;bottom:22px;width:52px;height:52px}.whatsapp-float img{width:28px;height:28px}}`;
        document.head.appendChild(waStyle);
    }

    const waLink = document.createElement('a');
    waLink.href = 'https://whatsapp.com/channel/0029Vb7OqCF3QxS6oVWKm83a';
    waLink.className = 'whatsapp-float';
    waLink.target = '_blank';
    waLink.rel = 'noopener noreferrer';
    waLink.setAttribute('aria-label', 'Follow us on WhatsApp Channel');
    waLink.innerHTML = '<img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="Follow us on WhatsApp" />';
    document.body.appendChild(waLink);
}

function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function initForms() {
    const newsletterForm = document.getElementById('newsletter-form');
    const contactForm = document.getElementById('contact-form');

    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const input = newsletterForm.querySelector('input');
            const email = input ? input.value : '';
            if (validateEmail(email)) {
                showNotification('Successfully subscribed! Welcome aboard!');
                newsletterForm.reset();
            } else {
                showNotification('Please enter a valid email address');
            }
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Message sent successfully! We will get back to you soon.');
            contactForm.reset();
        });
    }
}