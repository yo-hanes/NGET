LOCKED_PERMISSIONS = {
    'super_admin': ['user_management', 'activity_logs']
}

ALL_PAGE_KEYS = [
    'overview', 'map', 'disaster_analytics', 'approval', 'dispatch',
    'resources', 'community', 'donations', 'reports', 'model_tester',
    'mini_apps', 'user_management', 'activity_logs'
]

ALL_ROLES = [
    'super_admin',
    'government_official',
    'agency_operator',
    'community_reporter'
]

ROLE_DISPLAY_NAMES = {
    'super_admin': 'Super Admin',
    'government_official': 'Government Official',
    'agency_operator': 'Agency Operator',
    'community_reporter': 'Community Reporter'
}

ROLE_COLORS = {
    'super_admin': {'bg': '#F3E8FF', 'text': '#6B21A8'},
    'government_official': {'bg': '#DBEAFE', 'text': '#1D4ED8'},
    'agency_operator': {'bg': '#FEF3C7', 'text': '#B45309'},
    'community_reporter': {'bg': '#CCFBF1', 'text': '#0F766E'}
}

# Default matrix based on spec
DEFAULT_PERMISSIONS_MATRIX = {
    'super_admin': {
        'overview': True, 'map': True, 'disaster_analytics': True, 'approval': True, 'dispatch': True,
        'resources': False, 'community': True, 'donations': True, 'reports': True, 'model_tester': False,
        'mini_apps': True, 'user_management': True, 'activity_logs': True
    },
    'government_official': {
        'overview': True, 'map': True, 'disaster_analytics': True, 'approval': True, 'dispatch': False,
        'resources': False, 'community': False, 'donations': True, 'reports': False, 'model_tester': False,
        'mini_apps': True, 'user_management': False, 'activity_logs': False
    },
    'agency_operator': {
        'overview': True, 'map': True, 'disaster_analytics': True, 'approval': False, 'dispatch': True,
        'resources': False, 'community': False, 'donations': True, 'reports': False, 'model_tester': False,
        'mini_apps': True, 'user_management': False, 'activity_logs': False
    },
    'community_reporter': {
        'overview': True, 'map': True, 'disaster_analytics': True, 'approval': False, 'dispatch': False,
        'resources': False, 'community': False, 'donations': True, 'reports': False, 'model_tester': False,
        'mini_apps': True, 'user_management': False, 'activity_logs': False
    }
}

async def get_user_permissions(db, role: str) -> list[str]:
    cursor = await db.execute("SELECT page_key FROM role_permissions WHERE role = ? AND has_access = 1", (role,))
    rows = await cursor.fetchall()
    keys = [row['page_key'] for row in rows]
    key_order = {k: i for i, k in enumerate(ALL_PAGE_KEYS)}
    return sorted(keys, key=lambda k: key_order.get(k, 999))

def check_page_access(permissions: list[str], page_key: str) -> bool:
    return page_key in permissions
