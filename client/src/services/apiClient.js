import axios from "axios";

// Engineering: timeout + retry (GET only, 2 attempts, 1 s back-off)
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  process.env.REACT_APP_API_URL ||
  "http://localhost:8000";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

// Attach Bearer token from localStorage on every request
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Retry GET requests up to 2 times on network errors (no response)
apiClient.interceptors.response.use(
  (res) => res,
  async (err) => {
    const cfg = err.config;
    if (!cfg) return Promise.reject(err);

    const isNetwork = !err.response;
    const isGet     = cfg.method?.toUpperCase() === "GET";
    cfg._retryCount  = cfg._retryCount ?? 0;

    if (isNetwork && isGet && cfg._retryCount < 2) {
      cfg._retryCount += 1;
      await new Promise((r) => setTimeout(r, 1000));
      return apiClient(cfg);
    }
    return Promise.reject(err);
  }
);

export function setApiAuthToken(token) {
  if (token) {
    apiClient.defaults.headers.common.Authorization = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete apiClient.defaults.headers.common.Authorization;
    localStorage.removeItem("token");
  }
}

export default apiClient;
export { API_BASE_URL };
