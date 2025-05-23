import { BASE_API_URL, TENANT_GUID } from "@/constants/common";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { Task } from "./tasks.slice";

export interface LifetimeItem {
  id: number;
  userName: string;
  lifetimeType: number;
  createdAt: string;
  comment: string;
  fieldName: string;
  oldFieldValue: string;
  newFieldValue: string;
}

export interface ActiveTask extends Task {
  lifetimeItems: LifetimeItem[];
}

interface ActiveTaskState {
  task: ActiveTask | null;
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
      .addCase(getTask.rejected, (state) => {
        state.isLoading = false;
        state.error = "Failed to load task";
      });
  },
});

export default activeTaskSlice.reducer;
