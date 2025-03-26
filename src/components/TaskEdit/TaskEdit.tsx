import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import {
  Alert,
  Avatar,
  Card,
  CardHeader,
  Chip,
  Divider,
  FormControl,
  MenuItem,
  Select,
  SelectChangeEvent,
  Stack,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store.hooks";
import { getTask } from "@/store/activeTask.slice";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import * as SC from "./TaskEdit.style";
import { formatCommentDate, formatDatePlan } from "@/helpers/common";
import { useEffect, useState } from "react";
import axios from "axios";
import { BASE_API_URL, TENANT_GUID } from "@/constants/common";
import { tasksActions } from "../../store/tasks.slice";
import Snackbar from "@mui/material/Snackbar";
import TaskComment from "../TaskComment/TaskComment";
import { useTaskStatusUpdate } from "@/hooks/useTaskStatusUpdate";

export default function TaskEdit({
  taskId,
  onClose,
}: {
  taskId: number;
  onClose: () => void;
}) {
  const [activeStatus, setActiveStatus] = useState("");

  const { task } = useAppSelector((state) => state.activeTask);
  const { statuses } = useAppSelector((state) => state.statuses);

  const dispatch = useAppDispatch();

  const {
    loadStatus,
    isError,
    snackbarOpen,
    setSnackbarOpen,
    updateTaskStatus,
  } = useTaskStatusUpdate();

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
    if (!task) return;

    const success = await updateTaskStatus(task, newStatus, statuses, () => {
      const status = statuses.find((s) => s.name === newStatus);
      if (status) {
        dispatch(
          tasksActions.changeStatus({
            id: task.id,
            statusId: status.id,
            statusName: status.name,
            statusRgb: status.rgb,
          }),
        );
      }
    });

    if (success) {
      setActiveStatus(newStatus);
    } else {
      setActiveStatus(task.statusName);
    }
  };

  const handleClose = () => {
    setSnackbarOpen(false);
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
          gridTemplateColumns: "3fr auto 1fr",
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
          <CardActions>
            <SC.StyledButton size="small" variant="contained">
              Добавить комментарий
            </SC.StyledButton>
          </CardActions>
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
        </div>
        <Divider orientation="vertical" />
        <SC.StyledCardContent>
          <div>
            <FormControl fullWidth>
              <Select value={activeStatus} onChange={handleStatusChange}>
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
          {loadStatus}
        </Alert>
      </Snackbar>
    </SC.StyledCard>
  );
}
