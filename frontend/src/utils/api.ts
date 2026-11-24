import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// once true, a hard redirect to login is already underway - don't let a
// burst of other in-flight requests that also 401 each try to redirect again
let sessionExpired = false;

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // a 401 here always means "not authenticated" (missing, invalid, or
    // expired token - see backend/src/middlewares/isUser.js), never a
    // legitimate in-context permission denial (that's 403). Without this,
    // every caller's own catch block was left to guess why a request
    // failed, and most assumed "the content was deleted" - which is wrong
    // and confusing when the real reason is just an expired session. A full
    // reload (not a client-side route change) guarantees no stale page or
    // component state survives, even if the tab had been idle on a
    // long-since-stale page.
    if (error.response?.status === 401 && !sessionExpired) {
      sessionExpired = true;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
      localStorage.removeItem('username');
      if (window.location.pathname !== '/') {
        window.location.href = '/';
      }
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
