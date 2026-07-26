// ===== Contact Module =====
// Handles contact form submission

import { showNotification } from './utils.js';

export function initContact() {
    const contactForm = document.getElementById('contact-form');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            showNotification('Message sent successfully! We will get back to you soon.');
            contactForm.reset();
        });
    }
}