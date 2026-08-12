import api from "./api";

export const authService = {
  register: async (data) => {
    const res = await api.post("/users/register/", data);
    authService.saveTokens(res.data.tokens);
    return res.data;
  },

  login: async (email, password) => {
    const res = await api.post("/users/login/", { email, password });
    authService.saveTokens(res.data.tokens);
    return res.data;
  },
googleLogin: async (credential) => {
  const res = await api.post("/users/google/", { credential });
  authService.saveTokens(res.data.tokens);
  return res.data;
},
  logout: async () => {
  const refresh = localStorage.getItem("refresh_token");
  try {
    if (refresh) {
      await api.post("/users/logout/", { refresh });
    }
  } catch {
    // silently fail — tokens clear karo anyway
  } finally {
    authService.clearTokens();  // ← hamesha clear ho
  }
},

  getProfile: () => api.get("/users/profile/").then((r) => r.data),

  updateProfile: (data) => api.put("/users/profile/", data).then((r) => r.data),

  changePassword: (data) => api.post("/users/change-password/", data).then((r) => r.data),

  getAddresses: () => api.get("/users/addresses/").then((r) => r.data),

  addAddress: (data) => api.post("/users/addresses/", data).then((r) => r.data),

  updateAddress: (id, data) => api.put(`/users/addresses/${id}/`, data).then((r) => r.data),

  deleteAddress: (id) => api.delete(`/users/addresses/${id}/`),

  setDefaultAddress: (id) => api.post(`/users/addresses/${id}/set-default/`),

  saveTokens: (tokens) => {
    localStorage.setItem("access_token",  tokens.access);
    localStorage.setItem("refresh_token", tokens.refresh);
  },

  clearTokens: () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
  },
};