// ===== COOKIE CONSENT BANNER =====
// Manages cookie consent for GDPR compliance
(function () {
    'use strict';

    const CONSENT_KEY = 'GetUp_cookie_consent';
    const CONSENT_EXPIRY_DAYS = 365;

    function getConsent() {
        try {
            const data = JSON.parse(localStorage.getItem(CONSENT_KEY));
            if (data && data.expiry > Date.now()) {
                return data.value;
            }
            localStorage.removeItem(CONSENT_KEY);
        } catch { /* stored consent unreadable; treat as no consent */ }
        return null;
    }

    function setConsent(value) {
        const data = {
            value: value,
            expiry: Date.now() + CONSENT_EXPIRY_DAYS * 24 * 60 * 60 * 1000,
            timestamp: new Date().toISOString()
        };
        localStorage.setItem(CONSENT_KEY, JSON.stringify(data));
    }

    function hideBanner() {
        const banner = document.getElementById('cookie-consent');
        if (banner) {
            banner.classList.remove('show');
            setTimeout(function () {
                banner.style.display = 'none';
            }, 400);
        }
    }

    // The AdSense loader is gated by an inline script in <head> that reads the
    // same stored consent and sets requestNonPersonalizedAds when it is absent
    // or declined. That runs before the loader, so a choice made here applies
    // from the next page view onwards — ads already requested on this page
    // cannot be recalled. Nothing else on the site sets non-essential cookies.
    function applyConsent(value) {
        if (value !== 'accepted') {
            (window.adsbygoogle = window.adsbygoogle || []).requestNonPersonalizedAds = 1;
        }
    }

    function init() {
        var consent = getConsent();
        if (consent === 'accepted' || consent === 'declined') {
            applyConsent(consent);
            return; // Choice already on record; don't show banner
        }
        applyConsent(null); // No choice yet — stay non-personalized

        // No consent yet — show banner
        var banner = document.getElementById('cookie-consent');
        if (banner) {
            banner.classList.add('show');
        }

        // Attach event listeners
        var acceptBtn = document.getElementById('cookie-accept');
        var declineBtn = document.getElementById('cookie-decline');

        if (acceptBtn) {
            acceptBtn.addEventListener('click', function () {
                setConsent('accepted');
                applyConsent('accepted');
                hideBanner();
            });
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', function () {
                setConsent('declined');
                applyConsent('declined');
                hideBanner();
            });
        }
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
