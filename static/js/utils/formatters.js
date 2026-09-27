window.Formatters = {
    formatDate(isoString) {
        if (!isoString) return '--';
        const d = new Date(isoString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    },
    formatDateTime(isoString) {
        if (!isoString) return '--';
        const d = new Date(isoString);
        return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    },
    formatTime(isoString) {
        if (!isoString) return '--';
        const d = new Date(isoString);
        return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    },
    formatEAT() {
        const d = new Date();
        const options = { timeZone: 'Africa/Addis_Ababa', hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false };
        return d.toLocaleTimeString('en-US', options) + ' EAT';
    },
    formatNumber(n) {
        if (n == null) return '--';
        return new Intl.NumberFormat().format(n);
    },
    formatPercent(n) {
        if (n == null) return '--';
        return `${Number(n).toFixed(1)}%`;
    },
    formatCurrency(n) {
        if (n == null) return '--';
        return `ETB ${new Intl.NumberFormat().format(n)}`;
    },
    truncate(str, len) {
        if (!str) return '';
        if (str.length <= len) return str;
        return str.substring(0, len) + '...';
    },
    initials(firstName, lastName) {
        const f = firstName ? firstName.charAt(0).toUpperCase() : '';
        const l = lastName ? lastName.charAt(0).toUpperCase() : '';
        return (f + l) || '?';
    },
    capitalize(str) {
        if (!str) return '';
        return str.split('_').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    },
    relativeTime(isoString) {
        if (!isoString) return '--';
        const msPerMinute = 60 * 1000;
        const msPerHour = msPerMinute * 60;
        const msPerDay = msPerHour * 24;
        
        const current = new Date();
        const previous = new Date(isoString);
        const elapsed = current - previous;
        
        if (elapsed < msPerMinute) return Math.round(elapsed/1000) + ' seconds ago';
        else if (elapsed < msPerHour) return Math.round(elapsed/msPerMinute) + ' minutes ago';
        else if (elapsed < msPerDay) return Math.round(elapsed/msPerHour) + ' hours ago';
        else if (elapsed < msPerDay * 2) return 'Yesterday';
        else return Math.round(elapsed/msPerDay) + ' days ago';
    }
};
