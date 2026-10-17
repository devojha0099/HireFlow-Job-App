import { createSlice } from "@reduxjs/toolkit";
import api from "../api/axios.js";
import { createApiThunk } from "./createApiThunk.js";

// ---------- Thunks ----------

export const fetchJobs = createApiThunk("jobs/fetchJobs", async (params) => {
  const { data } = await api.get("/jobs", { params });
  return data; // { jobs, page, pages, total }
});

export const fetchJobById = createApiThunk("jobs/fetchJobById", async (id) => {
  const { data } = await api.get(`/jobs/${id}`);
  return data.job;
});

export const fetchMyJobs = createApiThunk("jobs/fetchMyJobs", async () => {
  const { data } = await api.get("/jobs/mine");
  return data.jobs;
});

export const createJob = createApiThunk("jobs/createJob", async (job) => {
  const { data } = await api.post("/jobs", job);
  return data.job;
});

export const updateJob = createApiThunk("jobs/updateJob", async ({ id, ...job }) => {
  const { data } = await api.put(`/jobs/${id}`, job);
  return data.job;
});

export const closeJob = createApiThunk("jobs/closeJob", async (id) => {
  const { data } = await api.patch(`/jobs/${id}/close`);
  return data.job;
});

// ---------- Slice ----------


const initialState = {
  list: { jobs: [], page: 1, pages: 1, total: 0 },
  listStatus: "idle",
  listError: null,

  current: null,
  currentStatus: "idle",
  currentError: null,

  mine: [],
  mineStatus: "idle",
  mineError: null,
};

const jobSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // --- job list ---
      .addCase(fetchJobs.pending, (state) => {
        state.listStatus = "loading";
        state.listError = null;
      })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.listStatus = "succeeded";
        state.list = action.payload;
      })
      .addCase(fetchJobs.rejected, (state, action) => {
        state.listStatus = "failed";
        state.listError = action.payload;
      })

      // --- single job ---
      .addCase(fetchJobById.pending, (state) => {
        state.currentStatus = "loading";
        state.currentError = null;
        state.current = null; 
      })
      .addCase(fetchJobById.fulfilled, (state, action) => {
        state.currentStatus = "succeeded";
        state.current = action.payload;
      })
      .addCase(fetchJobById.rejected, (state, action) => {
        state.currentStatus = "failed";
        state.currentError = action.payload;
      })

      // --- recruiter's jobs ---
      .addCase(fetchMyJobs.pending, (state) => {
        state.mineStatus = "loading";
        state.mineError = null;
      })
      .addCase(fetchMyJobs.fulfilled, (state, action) => {
        state.mineStatus = "succeeded";
        state.mine = action.payload;
      })
      .addCase(fetchMyJobs.rejected, (state, action) => {
        state.mineStatus = "failed";
        state.mineError = action.payload;
      })

      // --- close a job: update just that row, keep applicantCount ---
      .addCase(closeJob.fulfilled, (state, action) => {
        state.mine = state.mine.map((job) =>
          job._id === action.payload._id ? { ...job, status: action.payload.status } : job
        );
      });
  },
});

export default jobSlice.reducer;
