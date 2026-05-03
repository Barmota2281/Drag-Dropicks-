const REFRESH_URL = `https://securetoken.googleapis.com/v1/token?key=${import.meta.env.VITE_FIREBASE_API_KEY}`;

export function saveToken(idToken, refreshToken = null, expiresIn = 3600) {
    const expiresAt = Date.now() + parseInt(expiresIn) * 1000;
    localStorage.setItem('token', idToken);
    localStorage.setItem('tokenExpiresAt', expiresAt.toString());
    if (refreshToken) {
        localStorage.setItem('refreshToken', refreshToken);
    }
}

export function getToken() {
    return localStorage.getItem('token');
}

export function isTokenExpired() {
    const expiresAt = localStorage.getItem('tokenExpiresAt');
    if (!expiresAt) return true;
    return Date.now() > parseInt(expiresAt) - 60000;
}

export async function refreshToken() {
    const refreshToken = localStorage.getItem('refreshToken');
    if (!refreshToken) return null;

    const response = await fetch(REFRESH_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grant_type: 'refresh_token', refresh_token: refreshToken }),
    });

    const data = await response.json();
    if (data.id_token) {
        saveToken(data.id_token, data.refresh_token, data.expires_in);
        return data.id_token;
    }

    // Refresh не удался — чистим всё
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    localStorage.removeItem('tokenExpiresAt');
    return null;
}