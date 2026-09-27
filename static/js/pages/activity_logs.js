window.ActivityLogsPage = {
    init() {
        document.getElementById('btn-refresh-logs').addEventListener('click', () => this.loadLogs());
        document.getElementById('btn-filter-logs').addEventListener('click', () => this.loadLogs());
        document.getElementById('btn-export-logs').addEventListener('click', () => this.exportLogs());
        
        // Setup intersection observer to auto-refresh when visible
        const observer = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                this.loadLogs();
            }
        });
        observer.observe(document.getElementById('view-activity-logs'));
    },

    async loadLogs() {
        const actionType = document.getElementById('log-action-filter').value;
        const search = document.getElementById('log-search').value;
        
        let url = '/api/activity-logs?limit=100';
        if (actionType) url += `&action_type=${encodeURIComponent(actionType)}`;
        if (search) url += `&search=${encodeURIComponent(search)}`;

        const tbody = document.getElementById('logs-table-body');
        tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-slate-500"><i data-lucide="loader-2" class="w-6 h-6 animate-spin mx-auto mb-2"></i>Loading logs...</td></tr>`;
        lucide.createIcons();

        const logs = await ApiClient.get(url);
        if (logs.error) {
            tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-brand-red">Error loading logs</td></tr>`;
            return;
        }

        tbody.innerHTML = '';
        if (logs.length === 0) {
            tbody.innerHTML = `<tr><td colspan="7" class="px-4 py-8 text-center text-slate-500">No logs found</td></tr>`;
            return;
        }

        logs.forEach(log => {
            const tr = document.createElement('tr');
            tr.className = 'hover:bg-black/5 dark:hover:bg-white/5 transition-colors';
            
            const actionText = log.action_type || log.action || 'UNKNOWN';
            const logTime = log.created_at || log.timestamp;
            const target = log.target_name || log.target_user_name || '--';
            const badgeColor = this.getBadgeColor(actionText);
            
            tr.innerHTML = `
                <td class="px-4 py-3 text-xs text-slate-500">#${log.log_id}</td>
                <td class="px-4 py-3 text-xs whitespace-nowrap">${Formatters.formatDateTime(logTime)}</td>
                <td class="px-4 py-3 font-medium text-xs text-white">${log.actor_name || '--'}</td>
                <td class="px-4 py-3">
                    <span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style="${badgeColor}">
                        ${actionText}
                    </span>
                </td>
                <td class="px-4 py-3 text-xs text-slate-300">${target}</td>
                <td class="px-4 py-3 text-xs text-slate-400 max-w-xs truncate" title="${log.details || ''}">${log.details || '--'}</td>
                <td class="px-4 py-3 text-xs text-right font-mono text-slate-500">${log.ip_address || '--'}</td>
            `;
            tbody.appendChild(tr);
        });
    },

    exportLogs() {
        ApiClient.download('/api/activity-logs/export');
    },

    getBadgeColor(action) {
        const a = (action || '').toUpperCase();
        if (a.includes('CREATED')) return 'background-color: rgba(12,156,114,0.15); color: #0c9c72; border: 1px solid rgba(12,156,114,0.3);';
        if (a.includes('ROLE')) return 'background-color: rgba(37,99,235,0.15); color: #3b82f6; border: 1px solid rgba(37,99,235,0.3);';
        if (a.includes('STATUS')) return 'background-color: rgba(249,115,22,0.15); color: #f97316; border: 1px solid rgba(249,115,22,0.3);';
        if (a.includes('PERMISSIONS')) return 'background-color: rgba(147,51,234,0.15); color: #a855f7; border: 1px solid rgba(147,51,234,0.3);';
        if (a.includes('DELETED')) return 'background-color: rgba(231,59,69,0.15); color: #e73b45; border: 1px solid rgba(231,59,69,0.3);';
        if (a.includes('PASSWORD')) return 'background-color: rgba(20,184,166,0.15); color: #14b8a6; border: 1px solid rgba(20,184,166,0.3);';
        if (a.includes('LOGIN')) return 'background-color: rgba(100,116,139,0.15); color: #94a3b8; border: 1px solid rgba(100,116,139,0.3);';
        return 'background-color: rgba(100,116,139,0.15); color: #94a3b8;';
    }
};
