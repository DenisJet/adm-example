import { configureStore } from "@reduxjs/toolkit";
import prioritiesSlice from "./priorities.slice";
import statusesSlice from "./statuses.slice";
import tasksSlice from "./tasks.slice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      priorities: prioritiesSlice,
      statuses: statusesSlice,
      tasks: tasksSlice,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
