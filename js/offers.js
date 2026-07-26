// ===== Offers Module =====
// Handles offer/deal cards and scroll reveal for offer sections

const doc = document;

export function initOffers() {
    const offerCards = doc.querySelectorAll('.offer-card');
    if (offerCards.length === 0) return;

    if (typeof IntersectionObserver !== 'function') {
        offerCards.forEach((card) => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        });
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (!entry.isIntersecting) return;
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

    offerCards.forEach((card) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(card);
    });
}