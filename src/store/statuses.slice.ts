import { BASE_API_URL, TENANT_GUID } from "@/constants/common";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Status {
  rgb: string;
  id: number;
  name: string;
}

interface StatusesState {
  statuses: Status[];
  isLoading: boolean;
  error: string | null;
}

const initialState = {
  statuses: [],
  isLoading: false,
  error: null,
} satisfies StatusesState as StatusesState;

export const getStatuses = createAsyncThunk(
  "statuses/getStatuses",
  async () => {
    const response = await axios.get(
      `${BASE_API_URL}api/${TENANT_GUID}/Statuses`,
    );
    return response.data;
  },
);

const statusesSlice = createSlice({
  name: "statuses",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getStatuses.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getStatuses.fulfilled, (state, action) => {
        state.isLoading = false;
        state.statuses = action.payload;
      })
      .addCase(getStatuses.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load statuses";
      });
  },
});

export default statusesSlice.reducer;
