// ===== Jobs Module =====
// Handles job listing filters, search, deadlines, bookmarks, and countdowns

const doc = document;

const qsa = (selector, root = doc) => Array.from(root.querySelectorAll(selector));
const qs = (selector, root = doc) => root.querySelector(selector);

function getActiveFilter() {
    const activeBtn = qs('.filter-btn.active');
    return activeBtn ? activeBtn.getAttribute('data-filter') : 'all';
}

function getSearchQuery() {
    const searchInput = qs('#job-search');
    return searchInput ? searchInput.value.toLowerCase().trim() : '';
}

function getCardSearchText(card) {
    const selectors = ['.job-title', '.job-info h4', '.job-location', '.job-badge', '.salary', '.job-type'];
    let text = '';
    selectors.forEach((selector) => {
        const el = qs(selector, card);
        if (el) text += `${el.textContent} `;
    });
    qsa('.tag', card).forEach((tag) => { text += `${tag.textContent} `; });
    return text.toLowerCase();
}

function filterAndSearchJobs() {
    const filter = getActiveFilter();
    const query = getSearchQuery();
    const jobCards = qsa('.job-card');
    let visibleCount = 0;

    jobCards.forEach((card) => {
        const matchesFilter = filter === 'all' || card.getAttribute('data-type') === filter;
        const matchesSearch = !query || getCardSearchText(card).includes(query);

        if (matchesFilter && matchesSearch) {
            card.style.display = 'block';
            visibleCount += 1;
        } else {
            card.style.display = 'none';
        }
    });

    const noResults = qs('#no-results');
    if (noResults) noResults.style.display = visibleCount === 0 ? 'block' : 'none';
}

function showNotification(message) {
    const notification = doc.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = message;
    notification.style.cssText = 'position:fixed;bottom:100px;right:30px;padding:1rem 1.5rem;background:linear-gradient(135deg,#6366f1,#0ea5e9);color:white;border-radius:10px;font-weight:500;z-index:9999;animation:slideIn 0.3s ease,slideOut 0.3s ease 2.7s forwards;';
    doc.body.appendChild(notification);
    setTimeout(() => notification.remove(), 3000);
}

export function initJobs() {
    const filterBtns = qsa('.filter-btn');
    const jobSearchInput = qs('#job-search');
    const jobSearchClear = qs('#job-search-clear');

    if (filterBtns.length === 0 && !jobSearchInput) return;

    filterBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            filterBtns.forEach((b) => b.classList.remove('active'));
            btn.classList.add('active');
            filterAndSearchJobs();
        });
    });

    if (jobSearchInput) {
        let searchTimeout = null;
        jobSearchInput.addEventListener('input', () => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                filterAndSearchJobs();
                if (jobSearchClear) jobSearchClear.style.display = jobSearchInput.value ? 'flex' : 'none';
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

    checkJobDeadlines();

    const bookmarkBtns = qsa('.bookmark-btn');
    bookmarkBtns.forEach((btn) => {
        btn.addEventListener('click', () => {
            const icon = qs('i', btn);
            if (!icon) return;
            icon.classList.toggle('far');
            icon.classList.toggle('fas');
            showNotification(icon.classList.contains('fas') ? 'Job bookmarked!' : 'Bookmark removed');
        });
    });

    const countdowns = qsa('.countdown');
    if (countdowns.length > 0) {
        setInterval(() => {
            countdowns.forEach((countdown) => {
                const parts = countdown.textContent.split(':').map((p) => parseInt(p, 10));
                if (parts.length !== 3 || parts.some((p) => isNaN(p))) return;
                let [h, m, s] = parts;
                if (--s < 0) { s = 59; if (--m < 0) { m = 59; if (--h < 0) h = 23; } }
                countdown.textContent = `${String(h).padStart(2,'0')}:${String(m).padStart(2,'0')}:${String(s).padStart(2,'0')}`;
            });
        }, 1000);
    }
}

function checkJobDeadlines() {
    const now = new Date();
    qsa('.job-card[data-deadline]').forEach((card) => {
        const deadline = new Date(card.getAttribute('data-deadline') || '');
        if (!(deadline instanceof Date) || isNaN(deadline.getTime()) || now <= deadline) return;

        const deadlineTag = qs('.deadline-tag', card) || qs('.tag[style*="color: #ef4444"]', card);
        const applyBtn = qs('.apply-btn', card);
        const viewJobBtn = qs('.view-job-btn', card);
        const badge = qs('.job-badge', card);

        if (deadlineTag) { deadlineTag.textContent = 'Closed'; deadlineTag.style.background = '#f3f4f6'; deadlineTag.style.color = '#6b7280'; }
        if (applyBtn) { applyBtn.textContent = 'Closed'; applyBtn.style.background = '#9ca3af'; applyBtn.style.cursor = 'not-allowed'; applyBtn.style.pointerEvents = 'none'; }
        if (viewJobBtn) { viewJobBtn.innerHTML = '<i class="fas fa-ban"></i> Closed'; viewJobBtn.style.background = '#9ca3af'; viewJobBtn.style.cursor = 'not-allowed'; viewJobBtn.style.pointerEvents = 'none'; }
        if (badge) { badge.textContent = 'CLOSED'; badge.style.background = 'linear-gradient(135deg, #6b7280, #4b5563)'; }
        card.style.borderColor = '#d1d5db';
        card.classList.remove('hot-job');
        card.classList.add('expired-job');
    });

    setTimeout(checkJobDeadlines, 60000);
}