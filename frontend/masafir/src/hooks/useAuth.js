import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  loginThunk,
  registerThunk,
  logoutThunk,
  clearError,
  googleLoginThunk,
} from "../store/authSlice";

import { useNavigate } from "react-router-dom";

export function useAuth() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { user, isAuthenticated, loading, error } = useSelector(
    (s) => s.auth
  );

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  // ✅ Login
  const login = async (email, password) => {
    const result = await dispatch(
      loginThunk({
        email,
        password,
      })
    );

    if (loginThunk.fulfilled.match(result)) {
      navigate("/");
    }
  };

  // ✅ Register
  const register = async (data) => {
    const result = await dispatch(registerThunk(data));

    if (registerThunk.fulfilled.match(result)) {
      navigate("/");
    }
  };

  // ✅ Google Login
  const googleLogin = async (credential) => {
    const result = await dispatch(
      googleLoginThunk(credential)
    );

    if (googleLoginThunk.fulfilled.match(result)) {
      navigate("/");
    }
  };

  // ✅ Logout
  const logout = async () => {
    await dispatch(logoutThunk());
    navigate("/login");
  };

  // ✅ Return
  return {
    user,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    googleLogin,
    clearError: () => dispatch(clearError()),
  };
}