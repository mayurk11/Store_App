// const API_BASE = "http://backend:8000"; // Direct backend URL for development
// const API_BASE = "/api"; // Proxy through nginx
const API_BASE = "http://127.0.0.1:8000";



export const apiFetch = async (url, options = {}) => {
  let accessToken = localStorage.getItem("access_token");
  const refreshToken = localStorage.getItem("refresh_token");

  const response = await fetch(`${API_BASE}${url}`, {
    ...options,
    headers: {
      ...options.headers,
      Authorization: `Bearer ${accessToken}`,
    },
  });

  if (response.status === 401 && refreshToken) {
    // Try refreshing token
    const refreshResponse = await fetch(`${API_BASE}/auth/refresh`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(refreshToken),
    });

    if (refreshResponse.ok) {
      const data = await refreshResponse.json();
      localStorage.setItem("access_token", data.access_token);

      // Retry original request
      return fetch(`${API_BASE}${url}`, {
        ...options,
        headers: {
          ...options.headers,
          Authorization: `Bearer ${data.access_token}`,
        },
      });
    } else {
      // Refresh failed → logout
      localStorage.clear();
      window.location.href = "/";
    }
  }

  return response;
};
