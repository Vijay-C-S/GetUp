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

    function enableAnalytics() {
        // Google Analytics is already loaded async; ensure it's not blocked
        // Google Analytics removed: no-op
    }

    function disableAnalytics() {
        // Google Analytics removed: no-op
    }

    function init() {
        var consent = getConsent();
        if (consent === 'accepted') {
            enableAnalytics();
            return; // Don't show banner
        }
        if (consent === 'declined') {
            disableAnalytics();
            return; // Don't show banner
        }

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
                enableAnalytics();
                hideBanner();
            });
        }

        if (declineBtn) {
            declineBtn.addEventListener('click', function () {
                setConsent('declined');
                disableAnalytics();
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
