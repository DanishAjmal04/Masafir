import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { authService } from "../services/authService";

export const loginThunk = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      return await authService.login(email, password);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Login failed");
    }
  }
);

export const registerThunk = createAsyncThunk(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      return await authService.register(data);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Register failed");
    }
  }
);

export const logoutThunk = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await authService.logout();
    } catch {
      // Backend fail ho bhi jaye — frontend pe logout ho jaye
      authService.clearTokens();
    }
  }
);

export const fetchProfileThunk = createAsyncThunk(
  "auth/fetchProfile",
  async (_, { rejectWithValue }) => {
    try {
      return await authService.getProfile();
    } catch {
      return rejectWithValue("Failed to fetch profile");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user:            null,
    isAuthenticated: !!localStorage.getItem("access_token"),
    loading:         false,
    error:           null,
  },
  reducers: {
    clearError: (state) => { state.error = null; },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginThunk.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(loginThunk.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.isAuthenticated = true; })
      .addCase(loginThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      // Register
      .addCase(registerThunk.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(registerThunk.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.isAuthenticated = true; })
      .addCase(registerThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; })

      // Logout
      .addCase(logoutThunk.pending,   (s) => { s.loading = true; })
      .addCase(logoutThunk.fulfilled, (s) => { s.loading = false; s.user = null; s.isAuthenticated = false; })
      .addCase(logoutThunk.rejected,  (s) => { s.loading = false; s.user = null; s.isAuthenticated = false; })// ← yeh add karo
      // Fetch Profile
      .addCase(fetchProfileThunk.fulfilled, (s, a) => { s.user = a.payload; })

      // authSlice extraReducers mein yeh add karo:
      .addCase(googleLoginThunk.pending,   (s) => { s.loading = true;  s.error = null; })
      .addCase(googleLoginThunk.fulfilled, (s, a) => { s.loading = false; s.user = a.payload.user; s.isAuthenticated = true; })
      .addCase(googleLoginThunk.rejected,  (s, a) => { s.loading = false; s.error = a.payload; });
  },
});
export const googleLoginThunk = createAsyncThunk(
  "auth/googleLogin",
  async (credential, { rejectWithValue }) => {
    try {
      return await authService.googleLogin(credential);
    } catch (err) {
      return rejectWithValue(err.response?.data || "Google login failed");
    }
  }
);
export const { clearError } = authSlice.actions;
export default authSlice.reducer;