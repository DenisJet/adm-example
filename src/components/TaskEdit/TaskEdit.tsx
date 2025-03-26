import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Alert,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
  TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store.hooks";
import { getTask } from "@/store/activeTask.slice";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import * as SC from "./TaskEdit.style";
import { formatDatePlan } from "@/helpers/common";
import { useEffect, useState } from "react";
import { tasksActions } from "../../store/tasks.slice";
import Snackbar from "@mui/material/Snackbar";
import TaskComment from "../TaskComment/TaskComment";
import axios from "axios";
import { BASE_API_URL, TENANT_GUID } from "@/constants/common";
import { getUsers } from "@/store/users.slice";

export default function TaskEdit({
  taskId,
  onClose,
}: {
  taskId: number;
  onClose: () => void;
}) {
  const [activeStatus, setActiveStatus] = useState("");
  const [activeExecutor, setActiveExecutor] = useState("");
  const [newComment, setNewComment] = useState("");
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    isError: false,
  });

  const { task } = useAppSelector((state) => state.activeTask);
  const { statuses } = useAppSelector((state) => state.statuses);
  const { users } = useAppSelector((state) => state.users);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTask(taskId));
    dispatch(getUsers());
  }, [taskId, dispatch]);

  useEffect(() => {
    if (task) {
      setActiveStatus(task.statusName);
      setActiveExecutor(task.executorName);
    }
  }, [task]);

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

      await dispatch(getTask(taskId)).unwrap();

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

  if (!task) return <div>Loading...</div>;

  return (
    <SC.StyledCard>
      <CardHeader
        avatar={`№ ${task.id}`}
        title={task.name}
        action={<CloseIcon onClick={onClose} />}
      />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "3fr auto 262px",
          height: "100%",
        }}
      >
        <div>
          <CardContent>
            <Typography color="text.secondary" variant="subtitle2">
              Описание
            </Typography>
            <Typography gutterBottom>{task.description}</Typography>
          </CardContent>
          <Divider />
          <CardContent>
            <Typography color="text.secondary" variant="subtitle2">
              Новый комментарий
            </Typography>
            <TextField
              required
              value={newComment}
              onChange={handleCommentChange}
              id="comment"
              label="Напишите новый комментарий здесь"
              variant="standard"
              multiline
              fullWidth
              rows={4}
            />
          </CardContent>
          <CardActions>
            <SC.StyledButton
              size="small"
              variant="contained"
              disabled={!newComment.trim()}
              onClick={handleAddComment}
            >
              Добавить комментарий
            </SC.StyledButton>
          </CardActions>
          <CardContent style={{ overflow: "auto", height: "60vh" }}>
            {task.lifetimeItems &&
              task.lifetimeItems.length > 0 &&
              task?.lifetimeItems
                .filter((items) => items.comment !== null)
                ?.map((item) => {
                  return (
                    <div key={item.id}>
                      <TaskComment comment={item} />
                    </div>
                  );
                })}
          </CardContent>
        </div>
        <Divider orientation="vertical" />
        <SC.StyledCardContent>
          <div>
            <FormControl fullWidth>
              <Select
                value={activeStatus}
                onChange={handleStatusChange}
                size="small"
                style={{
                  backgroundColor: statuses.find(
                    (status) => status.name === activeStatus,
                  )?.rgb,
                }}
              >
                {statuses.map((status) => {
                  return (
                    <MenuItem key={status.id} value={status.name}>
                      {status.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div>
            <Typography color="text.secondary" variant="subtitle2">
              Заявитель
            </Typography>
            <Typography gutterBottom noWrap>
              {task.initiatorName}
            </Typography>
          </div>
          <div>
            <Typography color="text.secondary" variant="subtitle2">
              Создана
            </Typography>
            <Typography gutterBottom noWrap>
              {task.executorName}
            </Typography>
          </div>
          <div>
            <Typography color="text.secondary" variant="subtitle2">
              Исполнитель
            </Typography>
            <FormControl fullWidth>
              <Select
                value={activeExecutor}
                onChange={handleExecutorChange}
                size="small"
              >
                {users.map((user) => {
                  return (
                    <MenuItem key={user.id} value={user.name}>
                      {user.name}
                    </MenuItem>
                  );
                })}
              </Select>
            </FormControl>
          </div>
          <div>
            <Typography color="text.secondary" variant="subtitle2">
              Приоритет
            </Typography>
            <Typography gutterBottom noWrap>
              {task.priorityName}
            </Typography>
          </div>
          <div>
            <Typography color="text.secondary" variant="subtitle2">
              Срок
            </Typography>
            <Stack direction="row" spacing={1}>
              <CalendarMonthOutlinedIcon htmlColor="gray" />
              <Typography gutterBottom noWrap>
                {formatDatePlan(task.resolutionDatePlan)}
              </Typography>
            </Stack>
          </div>
          <div>
            <Typography color="text.secondary" variant="subtitle2">
              Теги
            </Typography>
            <Stack direction="row" spacing={1}>
              {task.tags &&
                task.tags.map((tag) => {
                  return (
                    <Chip key={tag.id} label={tag.name} variant="outlined" />
                  );
                })}
            </Stack>
          </div>
        </SC.StyledCardContent>
      </div>
      <Snackbar
        open={snackbar.open}
        onClose={handleSnackbarClose}
        autoHideDuration={3000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={snackbar.isError ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </SC.StyledCard>
  );
}
