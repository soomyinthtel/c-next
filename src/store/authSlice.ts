import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: string | null;
  isAuthenticated: boolean;
}

const initialState: AuthState = {
  user: typeof window !== "undefined" ? localStorage.getItem("user") : null,
  isAuthenticated:
    typeof window !== "undefined" ? !!localStorage.getItem("user") : false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    login: (state, action: PayloadAction<string>) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      localStorage.setItem("user", action.payload);
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      localStorage.removeItem("user");
    },
  },
});

export const { login, logout } = authSlice.actions;
export default authSlice.reducer;
