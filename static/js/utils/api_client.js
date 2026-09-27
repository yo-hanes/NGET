window.ApiClient = {
    async request(url, options = {}) {
        options.credentials = 'same-origin';
        
        try {
            const response = await fetch(url, options);
            
            if (response.status === 401) {
                window.location.href = '/login';
                return { error: 'Unauthorized' };
            }
            
            if (!response.ok) {
                const data = await response.json().catch(() => ({}));
                return { error: data.detail || `HTTP Error ${response.status}` };
            }
            
            if (response.headers.get('content-type')?.includes('application/json')) {
                return await response.json();
            }
            return response;
        } catch (err) {
            console.error('API Error:', err);
            return { error: 'Network or connection error' };
        }
    },

    async get(url) {
        return this.request(url, { method: 'GET' });
    },

    async post(url, data) {
        return this.request(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },

    async postForm(url, formData) {
        return this.request(url, {
            method: 'POST',
            body: formData
        });
    },

    async put(url, data) {
        return this.request(url, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    },

    async del(url) {
        return this.request(url, { method: 'DELETE' });
    },

    download(url) {
        const link = document.createElement('a');
        link.href = url;
        link.target = '_blank';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }
};
