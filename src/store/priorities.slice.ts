import { BASE_API_URL, TENANT_GUID } from "@/constants/common";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Priorities {
  rgb: string;
  id: number;
  name: string;
}

interface PrioritiesState {
  priorities: Priorities[];
  isLoading: boolean;
  error: string | null;
}

const initialState = {
  priorities: [],
  isLoading: false,
  error: null,
} satisfies PrioritiesState as PrioritiesState;

export const getPriorities = createAsyncThunk(
  "priorities/getPriorities",
  async () => {
    const response = await axios.get(
      `${BASE_API_URL}/${TENANT_GUID}/Priorities`,
    );
    return response.data;
  },
);

const prioritiesSlice = createSlice({
  name: "priorities",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getPriorities.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPriorities.fulfilled, (state, action) => {
        state.isLoading = false;
        state.priorities = action.payload;
      })
      .addCase(getPriorities.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load priorities";
      });
  },
});

export default prioritiesSlice.reducer;
