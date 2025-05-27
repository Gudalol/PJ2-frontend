export async function fetchComToken(input: RequestInfo, init: RequestInit = {}) {
  let token = localStorage.getItem("token");
  let refreshToken = localStorage.getItem("refreshToken");
  const authHeaders = token
    ? { Authorization: `Bearer ${token}` }
    : {};

  init.headers = {
    ...(init.headers || {}),
    ...authHeaders,
  };

  let response = await fetch(input, init);

  if ((response.status === 401 || response.status === 403) && refreshToken) {
    const refreshRes = await fetch(
      `${import.meta.env.VITE_API_URL}/auth/refresh-token`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken }),
      }
    );
    if (refreshRes.ok) {
      const data = await refreshRes.json();
      if (data.token) {
        localStorage.setItem("token", data.token);
        token = data.token;
        init.headers = {
          ...(init.headers || {}),
          Authorization: `Bearer ${token}`,
        };
        response = await fetch(input, init);
      }
    }else {
      // Se o refresh falhar, é removido os tokens e redirecionado para login
      localStorage.removeItem("token");
      localStorage.removeItem("refreshToken");
      window.location.href = "/login";
    }
  }
  return response;
}
