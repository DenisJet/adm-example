import { useState } from "react";
import axios from "axios";
import { BASE_API_URL, TENANT_GUID } from "@/constants/common";
import { Task } from "@/store/tasks.slice";
import { Status } from "@/store/statuses.slice";

export const useTaskStatusUpdate = () => {
  const [loadStatus, setLoadStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  const updateTaskStatus = async (
    task: Task,
    newStatusName: string,
    statuses: Status[],
    onSuccess: () => void,
  ) => {
    try {
      const status = statuses.find((status) => status.name === newStatusName);

      if (!status?.id) {
        throw new Error("Selected status not found");
      }

      await axios.put(`${BASE_API_URL}api/${TENANT_GUID}/Tasks/`, {
        id: task.id,
        statusId: status.id,
        executorId: task.executorId,
      });

      onSuccess();
      setIsError(false);
      setSnackbarOpen(true);
      setLoadStatus("Статус задачи обновлен");
      return true;
    } catch (err) {
      console.error(err);
      setIsError(true);
      setSnackbarOpen(true);
      setLoadStatus("Не удалось обновить статус");
      return false;
    }
  };

  return {
    loadStatus,
    isError,
    snackbarOpen,
    setSnackbarOpen,
    updateTaskStatus,
  };
};
