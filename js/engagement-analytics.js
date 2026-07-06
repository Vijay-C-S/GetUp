(function () {
    var STORAGE_KEY = 'gu_engagement_event_counts_v1';

    function safeParse(jsonValue) {
        try {
            return JSON.parse(jsonValue || '{}');
        } catch (e) {
            return {};
        }
    }

    function readCounts() {
        return safeParse(localStorage.getItem(STORAGE_KEY));
    }

    function writeCounts(counts) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(counts));
    }

    function normalizeLabel(label) {
        if (!label) {
            return 'unknown';
        }
        var text = String(label).trim();
        return text.length > 120 ? text.slice(0, 120) + '...' : text;
    }

    function incrementCount(eventName, label) {
        var counts = readCounts();
        var key = eventName + ' :: ' + normalizeLabel(label);
        counts[key] = (counts[key] || 0) + 1;
        writeCounts(counts);
    }

    function sendToGtag(eventName, params) {
        // Google Analytics removed: no-op
    }

    function getEngagementStats(limit) {
        var counts = readCounts();
        var rows = Object.keys(counts).map(function (key) {
            return {
                event: key,
                count: counts[key]
            };
        });

        rows.sort(function (a, b) {
            return b.count - a.count;
        });

        var safeLimit = typeof limit === 'number' && limit > 0 ? limit : 20;
        return rows.slice(0, safeLimit);
    }

    function resetEngagementStats() {
        localStorage.removeItem(STORAGE_KEY);
    }

    function trackEngagement(eventName, params) {
        var payload = params || {};
        var label = payload.event_label || payload.label || payload.item_name || 'unknown';
        sendToGtag(eventName, payload);
        incrementCount(eventName, label);

        if (window.__renderEngagementDebugPanel) {
            window.__renderEngagementDebugPanel();
        }
    }

    function createDebugPanel() {
        if (document.getElementById('gu-engagement-debug-panel')) {
            return;
        }

        var style = document.createElement('style');
        style.textContent = '' +
            '#gu-engagement-debug-panel {' +
            'position: fixed;' +
            'right: 16px;' +
            'bottom: 16px;' +
            'width: min(420px, calc(100vw - 32px));' +
            'max-height: 60vh;' +
            'overflow: auto;' +
            'z-index: 2147483646;' +
            'border-radius: 12px;' +
            'border: 1px solid rgba(255,255,255,0.2);' +
            'background: rgba(3, 7, 18, 0.95);' +
            'color: #e5e7eb;' +
            'box-shadow: 0 10px 30px rgba(0, 0, 0, 0.45);' +
            'font: 12px/1.4 Segoe UI, Arial, sans-serif;' +
            '}' +
            '#gu-engagement-debug-panel .gu-head {' +
            'display: flex;' +
            'justify-content: space-between;' +
            'align-items: center;' +
            'padding: 10px 12px;' +
            'border-bottom: 1px solid rgba(255,255,255,0.12);' +
            'position: sticky;' +
            'top: 0;' +
            'background: rgba(3, 7, 18, 0.98);' +
            '}' +
            '#gu-engagement-debug-panel .gu-title {' +
            'font-weight: 600;' +
            'letter-spacing: 0.2px;' +
            '}' +
            '#gu-engagement-debug-panel .gu-actions {' +
            'display: flex;' +
            'gap: 6px;' +
            '}' +
            '#gu-engagement-debug-panel button {' +
            'border: 1px solid rgba(255,255,255,0.2);' +
            'background: rgba(255,255,255,0.08);' +
            'color: #e5e7eb;' +
            'border-radius: 8px;' +
            'padding: 4px 8px;' +
            'cursor: pointer;' +
            'font-size: 11px;' +
            '}' +
            '#gu-engagement-debug-panel button:hover {' +
            'background: rgba(255,255,255,0.16);' +
            '}' +
            '#gu-engagement-debug-panel .gu-body {' +
            'padding: 10px 12px;' +
            '}' +
            '#gu-engagement-debug-panel table {' +
            'width: 100%;' +
            'border-collapse: collapse;' +
            '}' +
            '#gu-engagement-debug-panel th, #gu-engagement-debug-panel td {' +
            'text-align: left;' +
            'padding: 6px 4px;' +
            'border-bottom: 1px dashed rgba(255,255,255,0.12);' +
            'vertical-align: top;' +
            '}' +
            '#gu-engagement-debug-panel .gu-count {' +
            'text-align: right;' +
            'width: 50px;' +
            'font-weight: 700;' +
            '}' +
            '#gu-engagement-debug-panel .gu-empty {' +
            'opacity: 0.8;' +
            '}';
        document.head.appendChild(style);

        var panel = document.createElement('aside');
        panel.id = 'gu-engagement-debug-panel';
        panel.setAttribute('aria-label', 'Engagement debug panel');
        panel.innerHTML = '' +
            '<div class="gu-head">' +
            '<div class="gu-title">Engagement Snapshot</div>' +
            '<div class="gu-actions">' +
            '<button type="button" id="gu-refresh-stats">Refresh</button>' +
            '<button type="button" id="gu-reset-stats">Reset</button>' +
            '</div>' +
            '</div>' +
            '<div class="gu-body" id="gu-stats-body"></div>';

        document.body.appendChild(panel);

        var refreshBtn = document.getElementById('gu-refresh-stats');
        var resetBtn = document.getElementById('gu-reset-stats');

        if (refreshBtn) {
            refreshBtn.addEventListener('click', function () {
                if (window.__renderEngagementDebugPanel) {
                    window.__renderEngagementDebugPanel();
                }
            });
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', function () {
                resetEngagementStats();
                if (window.__renderEngagementDebugPanel) {
                    window.__renderEngagementDebugPanel();
                }
            });
        }
    }

    function renderDebugPanel() {
        var body = document.getElementById('gu-stats-body');
        if (!body) {
            return;
        }

        var rows = getEngagementStats(12);
        if (rows.length === 0) {
            body.innerHTML = '<div class="gu-empty">No events captured yet on this browser.</div>';
            return;
        }

        var table = '<table><thead><tr><th>Event</th><th class="gu-count">Count</th></tr></thead><tbody>';
        rows.forEach(function (row) {
            table += '<tr><td>' + row.event + '</td><td class="gu-count">' + row.count + '</td></tr>';
        });
        table += '</tbody></table>';
        body.innerHTML = table;
    }

    window.trackEngagement = trackEngagement;
    window.getEngagementStats = getEngagementStats;
    window.resetEngagementStats = resetEngagementStats;
    window.__renderEngagementDebugPanel = renderDebugPanel;

    if (window.location.search.indexOf('analytics_debug=1') !== -1) {
        var topRows = getEngagementStats(10);
        if (topRows.length > 0) {
            console.table(topRows);
        } else {
            console.info('No engagement events captured yet in local stats.');
        }

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', function () {
                createDebugPanel();
                renderDebugPanel();
            });
        } else {
            createDebugPanel();
            renderDebugPanel();
        }
    }
})();
