window.PermissionManager = {
    hasAccess(pageKey) {
        return window.NEGARIT_PERMISSIONS.includes(pageKey);
    },
    getAllowedPages() {
        return window.NEGARIT_PERMISSIONS;
    },
    isRole(role) {
        return window.NEGARIT_USER && window.NEGARIT_USER.role === role;
    },
    getUser() {
        return window.NEGARIT_USER;
    },
    getRoleDisplay() {
        return window.NEGARIT_ROLE_DISPLAY;
    },
    getRoleColors() {
        return window.NEGARIT_ROLE_COLORS;
    }
};
