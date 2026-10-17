import { createAsyncThunk } from "@reduxjs/toolkit";
import { getErrorMessage } from "../api/axios.js";


export const createApiThunk = (type, request) =>
  createAsyncThunk(type, async (arg, { rejectWithValue }) => {
    try {
      return await request(arg);
    } catch (error) {
      return rejectWithValue(getErrorMessage(error));
    }
  });
