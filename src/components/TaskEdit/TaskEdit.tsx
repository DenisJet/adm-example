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

export default function TaskEdit({
  taskId,
  onClose,
}: {
  taskId: number;
  onClose: () => void;
}) {
  const [activeStatus, setActiveStatus] = useState("");
  const [isError, setIsError] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [newComment, setNewComment] = useState("");

  const { task } = useAppSelector((state) => state.activeTask);
  const { statuses } = useAppSelector((state) => state.statuses);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTask(taskId));
  }, [taskId, dispatch]);

  useEffect(() => {
    if (task) {
      setActiveStatus(task.statusName);
    }
  }, [task]);

  const handleStatusChange = async (event: SelectChangeEvent) => {
    const newStatus = event.target.value;
    setActiveStatus(newStatus);

    if (!task) return;

    try {
      const status = statuses.find((status) => status.name === newStatus);

      if (!status?.id) {
        throw new Error("Selected status not found");
      }

      await axios
        .put(`${BASE_API_URL}api/${TENANT_GUID}/Tasks/`, {
          id: task.id,
          statusId: status.id,
          executorId: task.executorId,
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
          setIsError(false);
          setSnackbarOpen(true);
          setSnackbarMessage("Статус задачи обновлен");
        });
    } catch (err) {
      console.error(err);
      setIsError(true);
      setSnackbarOpen(true);
      setSnackbarMessage("Не удалось обновить статус");
      setActiveStatus(task.statusName);
    }
  };

  const handleClose = () => {
    setSnackbarOpen(false);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !task) return;
    console.log(newComment);

    try {
      await axios.put(`${BASE_API_URL}api/${TENANT_GUID}/Tasks/`, {
        id: task.id,
        statusId: task.statusId,
        comment: newComment,
        executorId: task.executorId,
      });

      await dispatch(getTask(taskId)).unwrap();

      setNewComment("");
      setSnackbarMessage("Комментарий успешно добавлен");
      setSnackbarOpen(true);
    } catch (error) {
      console.error("Ошибка при добавлении комментария:", error);
      setSnackbarMessage("Не удалось добавить комментарий");
      setSnackbarOpen(true);
    }
  };

  const handleCommentChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewComment(e.target.value);
  };

  if (!task) return <div>Failed to load task</div>;

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
            <TextField
              value={newComment}
              onChange={handleCommentChange}
              id="comment"
              label="Напишите новый комментарий здесь"
              variant="filled"
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
            <Typography gutterBottom noWrap>
              {task.executorName}
            </Typography>
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
        open={snackbarOpen}
        onClose={handleClose}
        autoHideDuration={2000}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          severity={isError ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </SC.StyledCard>
  );
}
