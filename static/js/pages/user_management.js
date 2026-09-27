window.UserManagementPage = {
    roles: ['super_admin', 'government_official', 'agency_operator', 'community_reporter'],
    pagesKeys: [
        'overview', 'map', 'disaster_analytics', 'model_tester',
        'approval', 'dispatch', 'resources',
        'community', 'donations', 'reports', 'mini_apps',
        'user_management', 'activity_logs'
    ],
    originalPerms: {},
    usersData: [],
    loadingMatrix: false,

    init() {
        this.initPermissionsMatrix();
        this.initUserTable();
    },

    async initPermissionsMatrix() {
        if (this.loadingMatrix) return;
        this.loadingMatrix = true;

        try {
            const headerRow = document.getElementById('perm-header-row');
            const body = document.getElementById('perm-body');
            if (!headerRow || !body) return;

            // Fetch permissions first
            const res = await ApiClient.get('/api/permissions');
            if (res.error) {
                window.App.showToast('Failed to load permissions matrix', 'error');
                return;
            }

            // Clear existing headers except first 'Role' column
            while (headerRow.children.length > 1) {
                headerRow.removeChild(headerRow.lastChild);
            }
            body.innerHTML = '';

            // Add headers exactly once
            this.pagesKeys.forEach(key => {
                const th = document.createElement('th');
                th.className = 'px-3 py-2 text-center font-medium whitespace-nowrap min-w-[100px]';
                th.textContent = window.Sidebar.pages[key]?.label || key;
                headerRow.appendChild(th);
            });

        const roleColors = {
            'super_admin': { bg: '#F3E8FF', text: '#6B21A8', label: 'Super Admin' },
            'government_official': { bg: '#DBEAFE', text: '#1D4ED8', label: 'Gov Official' },
            'agency_operator': { bg: '#FEF3C7', text: '#B45309', label: 'Agency Operator' },
            'community_reporter': { bg: '#CCFBF1', text: '#0F766E', label: 'Community Reporter' }
        };

        this.originalPerms = {};

        this.roles.forEach(role => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-black/5 dark:hover:bg-white/5 transition-colors';
            
            const color = roleColors[role];
            tr.innerHTML = `
                <td class="px-3 py-2 whitespace-nowrap sticky left-0 bg-card z-10 border-r border-border/50 shadow-[1px_0_0_0_rgba(0,0,0,0.1)]">
                    <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider" style="background-color: ${color.bg}; color: ${color.text}">
                        ${color.label}
                    </span>
                </td>
            `;

            this.originalPerms[role] = {};

            this.pagesKeys.forEach(key => {
                const td = document.createElement('td');
                td.className = 'px-3 py-2 text-center';
                
                let hasAccess = false;
                if (res && res[role] && res[role][key] !== undefined) {
                    hasAccess = !!res[role][key];
                } else if (Array.isArray(res)) {
                    hasAccess = res.some(p => p.role === role && p.page_key === key && (p.has_access === 1 || p.has_access === true));
                }
                this.originalPerms[role][key] = hasAccess;
                
                const isLocked = role === 'super_admin' && (key === 'user_management' || key === 'activity_logs');
                
                td.innerHTML = `
                    <label class="flex items-center justify-center w-full h-full cursor-pointer">
                        <input type="checkbox" class="perm-checkbox w-4 h-4 text-brand-green rounded border-border focus:ring-brand-green bg-card"
                            data-role="${role}" data-page="${key}"
                            ${hasAccess ? 'checked' : ''}
                            ${isLocked ? 'disabled' : ''}>
                    </label>
                `;
                tr.appendChild(td);
            });
            body.appendChild(tr);
        });

        document.getElementById('btn-save-permissions').onclick = () => this.savePermissions();
        } finally {
            this.loadingMatrix = false;
        }
    },

    async savePermissions() {
        const checkboxes = document.querySelectorAll('.perm-checkbox');
        const changes = [];

        checkboxes.forEach(cb => {
            const role = cb.getAttribute('data-role');
            const page = cb.getAttribute('data-page');
            const checked = cb.checked;
            
            if (this.originalPerms[role] && this.originalPerms[role][page] !== checked) {
                changes.push({ role, page_key: page, has_access: checked });
            }
        });

        if (changes.length === 0) {
            window.App.showToast('No changes detected', 'info');
            return;
        }

        let successCount = 0;
        const btn = document.getElementById('btn-save-permissions');
        btn.innerHTML = '<i data-lucide="loader-2" class="w-3 h-3 animate-spin"></i> Saving...';
        btn.disabled = true;
        lucide.createIcons();

        for (const change of changes) {
            const res = await ApiClient.put('/api/permissions', change);
            if (!res.error) successCount++;
        }

        btn.innerHTML = '<i data-lucide="save" class="w-3 h-3"></i> Save Changes';
        btn.disabled = false;
        lucide.createIcons();

        if (successCount === changes.length) {
            window.App.showToast('Permissions updated successfully', 'success');
            this.initPermissionsMatrix();
        } else {
            window.App.showToast(`Saved ${successCount}/${changes.length} changes`, 'error');
        }
    },

    initUserTable() {
        document.getElementById('btn-refresh-users').onclick = () => this.loadUsers();
        document.getElementById('user-search').oninput = () => this.renderUsers();
        document.getElementById('user-role-filter').onchange = () => this.renderUsers();
        document.getElementById('user-status-filter').onchange = () => this.renderUsers();
        
        document.getElementById('btn-add-user').onclick = () => this.openUserModal();
        
        this.loadUsers();
    },

    async loadUsers() {
        const res = await ApiClient.get('/api/users');
        if (res.error) {
            window.App.showToast(res.error, 'error');
            return;
        }
        this.usersData = res;
        this.renderUsers();
    },

    renderUsers() {
        const tbody = document.getElementById('users-table-body');
        const search = document.getElementById('user-search').value.toLowerCase();
        const role = document.getElementById('user-role-filter').value;
        const status = document.getElementById('user-status-filter').value;
        const currentUser = PermissionManager.getUser();

        tbody.innerHTML = '';

        const filtered = this.usersData.filter(u => {
            const matchSearch = (u.first_name + ' ' + u.last_name).toLowerCase().includes(search) || 
                                u.user_name.toLowerCase().includes(search);
            const matchRole = role ? u.role === role : true;
            const matchStatus = status ? (status === 'active' ? u.is_active : !u.is_active) : true;
            return matchSearch && matchRole && matchStatus;
        });

        if (filtered.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-slate-500">No users found</td></tr>`;
            return;
        }

        filtered.forEach(u => {
            const isSelf = u.user_id === currentUser.user_id;
            
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-black/5 dark:hover:bg-white/5 transition-colors';
            
            tr.innerHTML = `
                <td class="px-4 py-3">
                    <div class="flex items-center gap-3">
                        <div class="w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center text-xs font-bold text-main">
                            ${Formatters.initials(u.first_name, u.last_name)}
                        </div>
                        <div>
                            <div class="font-medium text-main">${u.first_name} ${u.last_name} ${isSelf ? '<span class="text-xs text-brand-green font-semibold">(You)</span>' : ''}</div>
                        </div>
                    </div>
                </td>
                <td class="px-4 py-3 font-mono text-xs text-muted">${u.user_name}</td>
                <td class="px-4 py-3">
                    <select class="role-select bg-card border border-border rounded px-2 py-1 text-xs focus:border-brand-green text-main" data-id="${u.user_id}" ${isSelf ? 'disabled' : ''}>
                        <option value="super_admin" ${u.role === 'super_admin' ? 'selected' : ''}>Super Admin</option>
                        <option value="government_official" ${u.role === 'government_official' ? 'selected' : ''}>Gov Official</option>
                        <option value="agency_operator" ${u.role === 'agency_operator' ? 'selected' : ''}>Agency Operator</option>
                        <option value="community_reporter" ${u.role === 'community_reporter' ? 'selected' : ''}>Community Reporter</option>
                    </select>
                </td>
                <td class="px-4 py-3 text-sm text-main">${u.region || '--'}</td>
                <td class="px-4 py-3">
                    <select class="status-select bg-card border border-border rounded px-2 py-1 text-xs focus:border-brand-green text-main" data-id="${u.user_id}" ${isSelf ? 'disabled' : ''}>
                        <option value="true" ${u.is_active ? 'selected' : ''}>Active</option>
                        <option value="false" ${!u.is_active ? 'selected' : ''}>Inactive</option>
                    </select>
                </td>
                <td class="px-4 py-3 text-xs text-muted">${Formatters.relativeTime(u.last_login_at)}</td>
                <td class="px-4 py-3 text-right">
                    <div class="flex justify-end gap-2">
                        <button class="btn-save-user p-1.5 text-muted hover:text-brand-green transition-colors disabled:opacity-30 disabled:hover:text-muted" data-id="${u.user_id}" disabled title="Save Changes">
                            <i data-lucide="save" class="w-4 h-4"></i>
                        </button>
                        <button class="btn-delete-user p-1.5 text-muted hover:text-brand-red transition-colors ${isSelf ? 'hidden' : ''}" data-id="${u.user_id}" title="Delete User">
                            <i data-lucide="trash-2" class="w-4 h-4"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        lucide.createIcons();

        // Bind events
        document.querySelectorAll('.role-select, .status-select').forEach(el => {
            el.addEventListener('change', (e) => {
                const id = e.target.getAttribute('data-id');
                const row = e.target.closest('tr');
                const saveBtn = row.querySelector('.btn-save-user');
                saveBtn.disabled = false;
            });
        });

        document.querySelectorAll('.btn-save-user').forEach(btn => {
            btn.addEventListener('click', (e) => this.saveUser(e.currentTarget.getAttribute('data-id'), e.currentTarget));
        });

        document.querySelectorAll('.btn-delete-user').forEach(btn => {
            btn.addEventListener('click', (e) => this.deleteUser(e.currentTarget.getAttribute('data-id')));
        });
    },

    async saveUser(id, btnElement) {
        const row = btnElement.closest('tr');
        const role = row.querySelector('.role-select').value;
        const isActive = row.querySelector('.status-select').value === 'true';

        btnElement.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i>';
        lucide.createIcons();

        const res = await ApiClient.put(`/api/users/${id}`, {
            role: role,
            is_active: isActive
        });

        if (res.error) {
            window.App.showToast(res.error, 'error');
            btnElement.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i>';
        } else {
            window.App.showToast('User updated', 'success');
            btnElement.disabled = true;
            btnElement.innerHTML = '<i data-lucide="save" class="w-4 h-4"></i>';
            this.loadUsers();
        }
        lucide.createIcons();
    },

    async deleteUser(id) {
        if (!confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
        
        const res = await ApiClient.del(`/api/users/${id}`);
        if (res.error) {
            window.App.showToast(res.error, 'error');
        } else {
            window.App.showToast('User deleted', 'success');
            this.loadUsers();
        }
    },

    openUserModal() {
        const modal = document.getElementById('user-modal');
        modal.innerHTML = `
            <div class="bg-card border border-border rounded-xl shadow-2xl w-full max-w-md overflow-hidden">
                <div class="p-4 border-b border-border flex justify-between items-center bg-card/60">
                    <h3 class="font-semibold text-main">Add New User</h3>
                    <button class="text-muted hover:text-main transition-colors" onclick="document.getElementById('user-modal').classList.add('hidden')">
                        <i data-lucide="x" class="w-5 h-5"></i>
                    </button>
                </div>
                <form id="add-user-form" class="p-5 space-y-4">
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-muted mb-1">First Name</label>
                            <input type="text" name="first_name" required class="w-full bg-card border border-border rounded px-3 py-2 text-sm text-main focus:outline-none focus:border-brand-green">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-muted mb-1">Last Name</label>
                            <input type="text" name="last_name" required class="w-full bg-card border border-border rounded px-3 py-2 text-sm text-main focus:outline-none focus:border-brand-green">
                        </div>
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-muted mb-1">Username</label>
                        <input type="text" name="user_name" required class="w-full bg-card border border-border rounded px-3 py-2 text-sm text-main focus:outline-none focus:border-brand-green">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-muted mb-1">Email</label>
                        <input type="email" name="email" required class="w-full bg-card border border-border rounded px-3 py-2 text-sm text-main focus:outline-none focus:border-brand-green">
                    </div>
                    <div>
                        <label class="block text-xs font-medium text-muted mb-1">Password</label>
                        <input type="password" name="password" required class="w-full bg-card border border-border rounded px-3 py-2 text-sm text-main focus:outline-none focus:border-brand-green">
                    </div>
                    <div class="grid grid-cols-2 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-muted mb-1">Role</label>
                            <select name="role" required class="w-full bg-card border border-border rounded px-3 py-2 text-sm text-main focus:outline-none focus:border-brand-green">
                                <option value="community_reporter">Community Reporter</option>
                                <option value="agency_operator">Agency Operator</option>
                                <option value="government_official">Gov Official</option>
                                <option value="super_admin">Super Admin</option>
                            </select>
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-muted mb-1">Region</label>
                            <input type="text" name="region" class="w-full bg-card border border-border rounded px-3 py-2 text-sm text-main focus:outline-none focus:border-brand-green" placeholder="e.g. Oromia">
                        </div>
                    </div>
                </form>
                <div class="p-4 border-t border-border bg-card/60 flex justify-end gap-2">
                    <button class="px-4 py-2 text-sm text-muted hover:text-main transition-colors" onclick="document.getElementById('user-modal').classList.add('hidden')">Cancel</button>
                    <button id="btn-submit-user" class="px-4 py-2 text-sm bg-brand-green hover:bg-brand-greenDark text-white font-medium rounded shadow transition-colors">Create User</button>
                </div>
            </div>
        `;
        lucide.createIcons();
        modal.classList.remove('hidden');

        document.getElementById('btn-submit-user').onclick = async () => {
            const form = document.getElementById('add-user-form');
            if (!form.checkValidity()) {
                form.reportValidity();
                return;
            }
            
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());
            data.is_active = true;

            const res = await ApiClient.post('/api/users', data);
            if (res.error) {
                window.App.showToast(res.error, 'error');
            } else {
                window.App.showToast('User created successfully', 'success');
                modal.classList.add('hidden');
                this.loadUsers();
            }
        };
    }
};
