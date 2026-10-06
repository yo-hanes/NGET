window.App = {
    currentTab: null,

    init() {
        lucide.createIcons();
        window.Sidebar.init();
        window.Header.init();

        const allowed = PermissionManager.getAllowedPages();
        const defaultTab = allowed.includes('map') ? 'map' : (allowed.includes('overview') ? 'overview' : (allowed[0] || 'map'));
        const hash = window.location.hash.replace('#', '') || defaultTab;
        
        window.addEventListener('hashchange', () => {
            const newHash = window.location.hash.replace('#', '');
            if (newHash && newHash !== this.currentTab) {
                this.switchTab(newHash);
            }
        });

        if (hash) {
            this.switchTab(hash);
        }
    },

    switchTab(pageKey) {
        if (!PermissionManager.hasAccess(pageKey)) {
            this.showAccessDenied();
            return;
        }

        this.currentTab = pageKey;

        // Hide all
        document.querySelectorAll('.tab-view').forEach(el => el.classList.add('hidden'));

        // Show target
        const targetId = `view-${pageKey.replace(/_/g, '-')}`;
        const targetView = document.getElementById(targetId);
        if (targetView) {
            targetView.classList.remove('hidden');
        } else {
            console.error('View not found:', targetId);
        }

        window.Sidebar.setActiveTab(pageKey);
        if (window.location.hash !== '#' + pageKey) {
            window.location.hash = pageKey;
        }
        
        const label = window.Sidebar.pages[pageKey]?.label || Formatters.capitalize(pageKey);
        document.title = `${label} - Negarit ET`;

        // Initialize specific pages
        if (pageKey === 'overview' && window.OverviewPage) {
            window.OverviewPage.init();
        } else if (pageKey === 'map' && window.MapTelemetryPage) {
            window.MapTelemetryPage.init();
            if (window.MapController) {
                setTimeout(() => window.MapController.invalidateSize(), 150);
                setTimeout(() => window.MapController.invalidateSize(), 400);
            }
        } else if (pageKey === 'disaster_analytics' && window.DisasterAnalyticsPage) {
            window.DisasterAnalyticsPage.init();
        } else if (pageKey === 'approval' && window.ApprovalQueuePage) {
            window.ApprovalQueuePage.init();
        } else if (pageKey === 'dispatch' && window.DispatchPage) {
            window.DispatchPage.init();
        } else if (pageKey === 'resources' && window.ResourcesPage) {
            window.ResourcesPage.init();
        } else if (pageKey === 'community' && window.CommunityPage) {
            window.CommunityPage.init();
        } else if (pageKey === 'donations' && window.DonationsPage) {
            window.DonationsPage.init();
        } else if (pageKey === 'reports' && window.ReportsPage) {
            window.ReportsPage.init();
        } else if (pageKey === 'model_tester' && window.ModelTesterPage) {
            window.ModelTesterPage.init();
        } else if (pageKey === 'mini_apps' && window.MiniAppsPage) {
            window.MiniAppsPage.init();
        } else if (pageKey === 'user_management' && window.UserManagementPage) {
            window.UserManagementPage.init();
        } else if (pageKey === 'activity_logs' && window.ActivityLogsPage) {
            window.ActivityLogsPage.init();
        }

        if (window.lucide) window.lucide.createIcons();
    },

    showToast(message, type = 'info') {
        const container = document.getElementById('toast-container');
        if (!container) return;

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        
        let icon = 'info';
        if (type === 'success') icon = 'check-circle';
        if (type === 'error') icon = 'alert-circle';

        toast.innerHTML = `
            <i data-lucide="${icon}" class="w-4 h-4"></i>
            <span>${message}</span>
        `;
        
        container.appendChild(toast);
        lucide.createIcons();

        // Trigger animation
        setTimeout(() => toast.classList.add('show'), 10);

        // Remove after 3 seconds
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    showAccessDenied() {
        this.showToast('Access denied to this module.', 'error');
        const allowed = PermissionManager.getAllowedPages();
        if (allowed.length > 0) {
            const fallback = allowed.includes('map') ? 'map' : (allowed.includes('overview') ? 'overview' : allowed[0]);
            this.switchTab(fallback);
        }
    }
};

document.addEventListener('DOMContentLoaded', () => {
    window.App.init();
});
