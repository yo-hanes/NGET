window.Header = {
    init() {
        this.initClock();
        this.initTheme();
        this.populateUserProfile();
        this.initProfileDropdown();
        this.initModals();
        this.initLocationSearch();
    },

    populateUserProfile() {
        const user = window.PermissionManager?.getUser();
        if (!user) return;

        const nameEl = document.getElementById('header-name');
        const roleText = document.getElementById('header-role-text');
        const avatarEl = document.getElementById('header-avatar');
        const roleEl = document.getElementById('header-role-badge');
        const dropdownName = document.getElementById('dropdown-user-name');
        const dropdownRole = document.getElementById('dropdown-user-role');
        const initials = window.Formatters ? window.Formatters.initials(user.first_name, user.last_name) : 'U';
        const display = window.PermissionManager?.getRoleDisplay() || 'User';
        const colors = window.PermissionManager?.getRoleColors() || { bg: '#DBEAFE', text: '#1D4ED8' };

        if (nameEl) nameEl.textContent = `${user.first_name} ${user.last_name}`;
        if (roleText) roleText.textContent = display;
        if (avatarEl) avatarEl.textContent = initials;
        if (roleEl) {
            roleEl.textContent = display;
            roleEl.style.backgroundColor = colors.bg;
            roleEl.style.color = colors.text;
        }
        if (dropdownName) dropdownName.textContent = `${user.first_name} ${user.last_name}`;
        if (dropdownRole) dropdownRole.textContent = display;
    },

    initLocationSearch() {
        const input = document.getElementById('location-search-input');
        const dropdown = document.getElementById('location-search-dropdown');
        const clearBtn = document.getElementById('btn-search-clear');
        if (!input || !dropdown) return;

        input.placeholder = 'Search Ethiopian cities (e.g. Addis Ababa, Hawassa, Mekelle)...';

        const renderDropdown = (cities) => {
            dropdown.innerHTML = '';
            if (!cities || cities.length === 0) {
                dropdown.innerHTML = '<div class="p-3 text-xs text-slate-400 text-center">No matching locations found</div>';
                dropdown.classList.remove('hidden');
                return;
            }

            cities.slice(0, 8).forEach(city => {
                const item = document.createElement('button');
                item.type = 'button';
                item.className = 'w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-800/80 transition-colors border-b last:border-b-0 border-border/50 group';
                item.innerHTML = `
                    <div class="flex items-center gap-2.5">
                        <i data-lucide="map-pin" class="w-4 h-4 text-brand-blue group-hover:scale-110 transition-transform"></i>
                        <div>
                            <div class="text-xs font-semibold text-white">${city.name}</div>
                            <div class="text-[10px] text-slate-400">${city.region || 'Ethiopia'}</div>
                        </div>
                    </div>
                    <div class="text-[10px] font-mono text-slate-500">${city.elevation || ''}</div>
                `;

                item.onmousedown = (e) => {
                    e.preventDefault();
                    input.value = city.name;
                    dropdown.classList.add('hidden');
                    if (clearBtn) clearBtn.classList.remove('hidden');
                    
                    // Dispatch location change
                    if (window.MapTelemetryPage) {
                        window.MapTelemetryPage.selectCity(city);
                    }
                    if (window.DisasterAnalyticsPage) {
                        window.DisasterAnalyticsPage.init();
                    }
                };

                dropdown.appendChild(item);
            });

            dropdown.classList.remove('hidden');
            if (window.lucide) lucide.createIcons();
        };

        input.addEventListener('focus', () => {
            const results = window.WeatherAPI?.searchLocation(input.value) || [];
            renderDropdown(results);
        });

        input.addEventListener('input', (e) => {
            const query = e.target.value.trim();
            if (clearBtn) {
                if (query.length > 0) clearBtn.classList.remove('hidden');
                else clearBtn.classList.add('hidden');
            }
            const results = window.WeatherAPI?.searchLocation(query) || [];
            renderDropdown(results);
        });

        if (clearBtn) {
            clearBtn.addEventListener('click', () => {
                input.value = '';
                clearBtn.classList.add('hidden');
                dropdown.classList.add('hidden');
            });
        }

        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && e.target !== input) {
                dropdown.classList.add('hidden');
            }
        });
    },

    initClock() {
        const clockEl = document.getElementById('live-clock');
        if (!clockEl) return;
        
        const update = () => {
            clockEl.textContent = Formatters.formatEAT();
        };
        update();
        setInterval(update, 1000);
    },

    initTheme() {
        const toggle = document.getElementById('btn-theme-toggle');
        const html = document.documentElement;
        
        const saved = localStorage.getItem('negarit_theme');
        if (saved === 'light') {
            html.classList.remove('dark');
        } else {
            html.classList.add('dark');
        }
        
        toggle?.addEventListener('click', () => {
            html.classList.toggle('dark');
            const isDark = html.classList.contains('dark');
            localStorage.setItem('negarit_theme', isDark ? 'dark' : 'light');
            window.dispatchEvent(new CustomEvent('negarit:theme-changed', { detail: { isDark } }));
            if (window.ChartController && typeof window.ChartController.refreshTheme === 'function') {
                window.ChartController.refreshTheme();
            }
        });
    },

    initProfileDropdown() {
        const btn = document.getElementById('profile-menu-btn');
        const sidebarBtn = document.getElementById('sidebar-profile-btn');
        const dropdown = document.getElementById('profile-dropdown');
        
        const toggle = (e) => {
            e.stopPropagation();
            dropdown.classList.toggle('hidden');
        };
        
        btn?.addEventListener('click', toggle);
        sidebarBtn?.addEventListener('click', toggle);
        
        document.addEventListener('click', (e) => {
            if (!dropdown.contains(e.target) && !btn.contains(e.target) && !sidebarBtn.contains(e.target)) {
                dropdown.classList.add('hidden');
            }
        });
        
        document.getElementById('btn-sign-out')?.addEventListener('click', async () => {
            await ApiClient.post('/api/auth/logout', {});
            window.location.href = '/login';
        });
    },
    
    initModals() {
        const modal = document.getElementById('password-modal');
        const btnOpen = document.getElementById('btn-open-password');
        const btnSave = document.getElementById('btn-save-password');
        
        btnOpen?.addEventListener('click', () => {
            document.getElementById('profile-dropdown').classList.add('hidden');
            document.getElementById('pwd-current').value = '';
            document.getElementById('pwd-new').value = '';
            document.getElementById('pwd-confirm').value = '';
            modal.classList.remove('hidden');
        });
        
        btnSave?.addEventListener('click', async () => {
            const current = document.getElementById('pwd-current').value;
            const newPwd = document.getElementById('pwd-new').value;
            const confirm = document.getElementById('pwd-confirm').value;
            
            if (!current || !newPwd || !confirm) {
                window.App.showToast('Please fill all fields', 'error');
                return;
            }
            if (newPwd.length < 6) {
                window.App.showToast('New password must be at least 6 characters', 'error');
                return;
            }
            if (newPwd !== confirm) {
                window.App.showToast('Passwords do not match', 'error');
                return;
            }
            
            const user = PermissionManager.getUser();
            const res = await ApiClient.put(`/api/users/${user.user_id}/password`, {
                current_password: current,
                new_password: newPwd
            });
            
            if (res.error) {
                window.App.showToast(res.error, 'error');
            } else {
                window.App.showToast('Password updated successfully', 'success');
                modal.classList.add('hidden');
            }
        });
    }
};
