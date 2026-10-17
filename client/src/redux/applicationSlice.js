import { createSlice } from "@reduxjs/toolkit";
import api from "../api/axios.js";
import { createApiThunk } from "./createApiThunk.js";


export const applyToJob = createApiThunk("applications/apply", async ({ jobId, resumeUrl }) => {
  const { data } = await api.post(`/applications/${jobId}`, { resumeUrl });
  return data.application;
});

export const fetchMyApplications = createApiThunk("applications/fetchMine", async () => {
  const { data } = await api.get("/applications/my");
  return data.applications;
});

export const fetchJobApplicants = createApiThunk("applications/fetchApplicants", async (jobId) => {
  const { data } = await api.get(`/applications/job/${jobId}`);
  return data; 
});

export const updateApplicationStatus = createApiThunk(
  "applications/updateStatus",
  async ({ id, status }) => {
    const { data } = await api.patch(`/applications/${id}/status`, { status });
    return data.application; 
  }
);

export const fetchRecruiterStats = createApiThunk("applications/fetchStats", async () => {
  const { data } = await api.get("/applications/recruiter/stats");
  return data.stats;
});

// ---------- Slice ----------

const initialState = {
  mine: [],
  mineStatus: "idle",
  mineError: null,

  applicantsJob: null,
  applicants: [],
  applicantsStatus: "idle",
  applicantsError: null,

  stats: { totalJobs: 0, totalApplicants: 0, shortlisted: 0, interviews: 0 },
};

const applicationSlice = createSlice({
  name: "applications",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyApplications.pending, (state) => {
        state.mineStatus = "loading";
        state.mineError = null;
      })
      .addCase(fetchMyApplications.fulfilled, (state, action) => {
        state.mineStatus = "succeeded";
        state.mine = action.payload;
      })
      .addCase(fetchMyApplications.rejected, (state, action) => {
        state.mineStatus = "failed";
        state.mineError = action.payload;
      })

      .addCase(fetchJobApplicants.pending, (state) => {
        state.applicantsStatus = "loading";
        state.applicantsError = null;
        state.applicants = [];
        state.applicantsJob = null;
      })
      .addCase(fetchJobApplicants.fulfilled, (state, action) => {
        state.applicantsStatus = "succeeded";
        state.applicantsJob = action.payload.job;
        state.applicants = action.payload.applications;
      })
      .addCase(fetchJobApplicants.rejected, (state, action) => {
        state.applicantsStatus = "failed";
        state.applicantsError = action.payload;
      })

      .addCase(updateApplicationStatus.fulfilled, (state, action) => {
        const row = state.applicants.find((a) => a._id === action.payload._id);
        if (row) row.status = action.payload.status;
      })

      .addCase(fetchRecruiterStats.fulfilled, (state, action) => {
        state.stats = action.payload;
      });
  },
});

export default applicationSlice.reducer;
