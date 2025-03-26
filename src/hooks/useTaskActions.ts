import { BASE_API_URL, TENANT_GUID } from "@/constants/common";
import { ActiveTask, getTask } from "@/store/activeTask.slice";
import { useAppDispatch, useAppSelector } from "@/store/store.hooks";
import { tasksActions } from "@/store/tasks.slice";
import { SelectChangeEvent } from "@mui/material";
import axios from "axios";
import { useState } from "react";

export const useTaskActions = (task: ActiveTask) => {
  const [activeStatus, setActiveStatus] = useState("");
  const [activeExecutor, setActiveExecutor] = useState("");
  const [newComment, setNewComment] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    isError: false,
  });

  const dispatch = useAppDispatch();

  const { statuses } = useAppSelector((state) => state.statuses);
  const { users } = useAppSelector((state) => state.users);

  const handleStatusChange = async (event: SelectChangeEvent) => {
    const newStatus = event.target.value;
    setActiveStatus(newStatus);

    if (!task) return;

    try {
      const status = statuses.find((status) => status.name === newStatus);
      const executor = users.find((user) => user.name === activeExecutor);

      if (!status) {
        throw new Error("Selected status not found");
      }

      await axios
        .put(`${BASE_API_URL}api/${TENANT_GUID}/Tasks/`, {
          id: task.id,
          statusId: status.id,
          executorId: executor?.id,
        })
        .then(() => {
          dispatch(
            tasksActions.changeStatus({
              id: task.id,
              statusId: status.id,
              statusName: status.name,
              statusRgb: status.rgb,
            }),
          );
          setSnackbar({
            open: true,
            message: "Статус задачи обновлен",
            isError: false,
          });
        });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Не удалось обновить статус",
        isError: true,
      });
      setActiveStatus(task.statusName);
    }
  };

  const handleExecutorChange = async (event: SelectChangeEvent) => {
    const newExecutor = event.target.value;
    setActiveExecutor(newExecutor);

    if (!task) return;

    try {
      const executor = users.find((user) => user.name === newExecutor);
      const status = statuses.find((status) => status.name === activeStatus);

      if (!executor) {
        throw new Error("Selected executor not found");
      }

      await axios
        .put(`${BASE_API_URL}api/${TENANT_GUID}/Tasks/`, {
          id: task.id,
          executorId: executor?.id,
          statusId: status?.id,
        })
        .then(() => {
          dispatch(
            tasksActions.changeExecutor({
              id: task.id,
              statusId: status?.id,
              executorId: executor?.id,
              executorName: executor?.name,
            }),
          );
          setSnackbar({
            open: true,
            message: "Исполнитель задачи изменён",
            isError: false,
          });
        });
    } catch (err) {
      console.error(err);
      setSnackbar({
        open: true,
        message: "Не удалось изменить исполнителя",
        isError: true,
      });
      setActiveExecutor(task.executorName);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !task) return;

    try {
      const executor = users.find((user) => user.name === activeExecutor);
      const status = statuses.find((status) => status.name === activeStatus);

      await axios.put(`${BASE_API_URL}api/${TENANT_GUID}/Tasks/`, {
        id: task.id,
        statusId: status?.id,
        comment: newComment,
        executorId: executor?.id,
      });

      await dispatch(getTask(task.id)).unwrap();

      setSnackbar({
        open: true,
        message: "Комментарий успешно добавлен",
        isError: false,
      });
      setNewComment("");
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
      setSnackbar({
        open: true,
        message: "Не удалось добавить комментарий",
        isError: true,
      });
      setNewComment("");
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  const handleSnackbarClose = () => {
    setSnackbar({ open: false, message: "", isError: false });
  };

  return {
    snackbar,
    activeStatus,
    setActiveStatus,
    handleStatusChange,
    activeExecutor,
    setActiveExecutor,
    handleExecutorChange,
    newComment,
    handleCommentChange,
    handleAddComment,
    handleSnackbarClose,
  };
};
