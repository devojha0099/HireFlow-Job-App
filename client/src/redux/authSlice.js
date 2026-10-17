import { createSlice } from "@reduxjs/toolkit";
import api, { TOKEN_KEY } from "../api/axios.js";
import { createApiThunk } from "./createApiThunk.js";

// ---------- Thunks (async API calls) ----------

export const registerUser = createApiThunk("auth/register", async (formData) => {
  const { data } = await api.post("/auth/register", formData);
  return data; // { token, user }
});

export const loginUser = createApiThunk("auth/login", async (credentials) => {
  const { data } = await api.post("/auth/login", credentials);
  return data; // { token, user }
});

export const fetchMe = createApiThunk("auth/fetchMe", async () => {
  const { data } = await api.get("/auth/me");
  return data.user;
});

export const updateProfile = createApiThunk("auth/updateProfile", async (profile) => {
  const { data } = await api.put("/auth/profile", profile);
  return data.user;
});

// ---------- Slice ----------

const token = localStorage.getItem(TOKEN_KEY);

const initialState = {
  user: null,
  token,
  loading: false, 
  error: null,
  initializing: Boolean(token),
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      localStorage.removeItem(TOKEN_KEY);
      state.user = null;
      state.token = null;
      state.error = null;
      state.initializing = false;
    },
    clearAuthError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    [registerUser, loginUser].forEach((thunk) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
          state.initializing = false;
          localStorage.setItem(TOKEN_KEY, action.payload.token);
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    });

    builder
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.user = action.payload;
        state.initializing = false;
      })
      .addCase(fetchMe.rejected, (state) => {
        localStorage.removeItem(TOKEN_KEY);
        state.user = null;
        state.token = null;
        state.initializing = false;
      })
      .addCase(updateProfile.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(updateProfile.rejected, (state) => {
        state.loading = false;
      });
  },
});

export const { logout, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
