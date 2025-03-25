import { BASE_API_URL, TENANT_GUID } from "@/constants/common";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Task } from "./tasks.slice";

interface ActiveTaskState {
  task: Task | null;
  isLoading: boolean;
  error: string | null;
}

const initialState = {
  task: null,
  isLoading: false,
  error: null,
} satisfies ActiveTaskState as ActiveTaskState;

export const getTask = createAsyncThunk(
  "activeTask/getTask",
  async (id: number) => {
    const response = await axios.get(
      `${BASE_API_URL}api/${TENANT_GUID}/Tasks/${id}`,
    );
    return response.data;
  },
);

const activeTaskSlice = createSlice({
  name: "activeTask",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTask.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTask.fulfilled, (state, action) => {
        state.isLoading = false;
        state.task = action.payload;
      })
      .addCase(getTask.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load task";
      });
  },
});

export default activeTaskSlice.reducer;
