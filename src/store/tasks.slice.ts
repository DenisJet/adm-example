import { BASE_API_URL, TENANT_GUID } from "@/constants/common";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

interface Task {
  id: number;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
  price: number;
  taskTypeId: number;
  taskTypeName: string;
  statusId: number;
  statusName: string;
  statusRgb: string;
  priorityId: number;
  priorityName: string;
  serviceId: number;
  serviceName: string;
  resolutionDatePlan: string;
  initiatorId: number;
  initiatorName: string;
  executorId: number;
  executorName: string;
  executorGroupId: number;
  executorGroupName: string;
  tags: {
    id: number;
    name: string;
  }[];
}

interface TasksState {
  tasks: Task[];
  isLoading: boolean;
  error: string | null;
}

const initialState = {
  tasks: [],
  isLoading: false,
  error: null,
} satisfies TasksState as TasksState;

export const getTasks = createAsyncThunk("task/getTasks", async () => {
  const response = await axios.get(
    `${BASE_API_URL}odata/tasks?tenantguid=${TENANT_GUID}`,
  );
  return response.data.value;
});

const tasksSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getTasks.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getTasks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.tasks = action.payload;
      })
      .addCase(getTasks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || "Failed to load tasks";
      });
  },
});

export default tasksSlice.reducer;
