window.Sidebar = {
    pages: {
        'overview': { label: 'Overview', icon: 'layout-dashboard', section: null },
        'map': { label: 'Map', icon: 'map-pin', section: 'Intelligence' },
        'disaster_analytics': { label: 'Disaster Analytics', icon: 'alert-triangle', section: 'Intelligence' },
        'model_tester': { label: 'Model Tester', icon: 'flask-conical', section: 'Intelligence' },
        
        'approval': { label: 'Approval', icon: 'shield-check', section: 'Operations' },
        'dispatch': { label: 'Dispatch', icon: 'truck', section: 'Operations' },
        'resources': { label: 'Resources', icon: 'package', section: 'Operations' },
        
        'community': { label: 'Community', icon: 'users', section: 'Community' },
        'donations': { label: 'Donations', icon: 'heart', section: 'Community' },
        'reports': { label: 'Reports', icon: 'file-text', section: 'Community' },
        'mini_apps': { label: 'Mini Apps', icon: 'smartphone', section: 'Community' },
        
        'user_management': { label: 'User Management', icon: 'user-cog', section: 'Administration' },
        'activity_logs': { label: 'Activity Logs', icon: 'scroll-text', section: 'Administration' }
    },

    init() {
        const nav = document.getElementById('sidebar-nav');
        nav.innerHTML = '';
        
        const allowed = PermissionManager.getAllowedPages();

        // 1. Overview at the very top of sidebar navigation
        if (allowed.includes('overview')) {
            const overviewPage = this.pages['overview'];
            const btn = document.createElement('button');
            btn.className = 'sidebar-tab-btn mb-2.5 font-semibold';
            btn.setAttribute('data-tab', 'overview');
            btn.innerHTML = `
                <i data-lucide="${overviewPage.icon}" class="w-4 h-4"></i>
                <span class="flex-1 text-left truncate">${overviewPage.label}</span>
                <span class="badge-count hidden bg-white/20 text-white px-1.5 py-0.5 rounded text-[10px] font-bold"></span>
            `;
            btn.addEventListener('click', () => {
                window.App.switchTab('overview');
                this.closeMobileDrawer();
            });
            nav.appendChild(btn);
        }

        // 2. Section navigation in defined page order
        const sections = {};
        Object.keys(this.pages).forEach(key => {
            if (key === 'overview') return;
            if (!allowed.includes(key)) return;
            const page = this.pages[key];
            if (!page || !page.section) return;
            if (!sections[page.section]) sections[page.section] = [];
            sections[page.section].push({ key, ...page });
        });
        
        const orderedSections = ['Intelligence', 'Operations', 'Community', 'Administration'];
        
        orderedSections.forEach(secName => {
            const items = sections[secName];
            if (!items || items.length === 0) return;
            
            const secHeader = document.createElement('div');
            secHeader.className = 'text-[10px] font-bold text-white/70 uppercase tracking-wider px-3 mt-3 mb-2';
            secHeader.textContent = secName;
            nav.appendChild(secHeader);
            
            items.forEach(item => {
                const btn = document.createElement('button');
                btn.className = 'sidebar-tab-btn';
                btn.setAttribute('data-tab', item.key);
                btn.innerHTML = `
                    <i data-lucide="${item.icon}" class="w-4 h-4"></i>
                    <span class="flex-1 text-left truncate">${item.label}</span>
                    <span class="badge-count hidden bg-white/20 text-white px-1.5 py-0.5 rounded text-[10px] font-bold"></span>
                `;
                btn.addEventListener('click', () => {
                    window.App.switchTab(item.key);
                    this.closeMobileDrawer();
                });
                nav.appendChild(btn);
            });
        });
        
        this.initMobileDrawer();
        this.populateUserCard();
    },

    setActiveTab(pageKey) {
        document.querySelectorAll('.sidebar-tab-btn').forEach(btn => {
            if (btn.getAttribute('data-tab') === pageKey) {
                btn.classList.add('active-tab');
            } else {
                btn.classList.remove('active-tab');
            }
        });
    },

    updateBadge(pageKey, count) {
        const btn = document.querySelector(`.sidebar-tab-btn[data-tab="${pageKey}"]`);
        if (btn) {
            const badge = btn.querySelector('.badge-count');
            if (count > 0) {
                badge.textContent = count;
                badge.classList.remove('hidden');
            } else {
                badge.classList.add('hidden');
            }
        }
    },

    initMobileDrawer() {
        const hamburger = document.getElementById('btn-hamburger');
        const closeBtn = document.getElementById('btn-sidebar-close');
        const overlay = document.getElementById('sidebar-overlay');
        const sidebar = document.getElementById('app-sidebar');
        
        const open = () => {
            sidebar.classList.remove('-translate-x-full');
            overlay.classList.remove('hidden');
        };
        
        const close = () => {
            sidebar.classList.add('-translate-x-full');
            overlay.classList.add('hidden');
        };
        
        this.closeMobileDrawer = close;
        
        hamburger?.addEventListener('click', open);
        closeBtn?.addEventListener('click', close);
        overlay?.addEventListener('click', close);
    },
    
    populateUserCard() {
        const user = PermissionManager.getUser();
        if (!user) return;
        
        const nameEl = document.getElementById('sidebar-name');
        const avatarEl = document.getElementById('sidebar-avatar');
        const roleBadge = document.getElementById('sidebar-role-badge');
        
        if (nameEl) nameEl.textContent = `${user.first_name} ${user.last_name}`;
        if (avatarEl) avatarEl.textContent = Formatters.initials(user.first_name, user.last_name);
        
        if (roleBadge) {
            const display = PermissionManager.getRoleDisplay();
            const colors = PermissionManager.getRoleColors();
            roleBadge.textContent = display;
            roleBadge.style.backgroundColor = colors.bg;
            roleBadge.style.color = colors.text;
        }
    }
};
