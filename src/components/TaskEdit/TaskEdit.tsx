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
  Stack,
  TextField,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store.hooks";
import { getTask } from "@/store/activeTask.slice";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import * as SC from "./TaskEdit.style";
import { formatDatePlan } from "@/helpers/common";
import { useEffect } from "react";
import Snackbar from "@mui/material/Snackbar";
import TaskComment from "../TaskComment/TaskComment";
import { getUsers } from "@/store/users.slice";
import { useTaskActions } from "@/hooks/useTaskActions";

export default function TaskEdit({
  taskId,
  onClose,
}: {
  taskId: number;
  onClose: () => void;
}) {
  const { task, isLoading, error } = useAppSelector(
    (state) => state.activeTask,
  );
  const { statuses } = useAppSelector((state) => state.statuses);
  const { users } = useAppSelector((state) => state.users);

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTask(taskId));
    dispatch(getUsers());
  }, [taskId, dispatch]);

  const {
    snackbar,
    handleStatusChange,
    activeStatus,
    setActiveStatus,
    activeExecutor,
    setActiveExecutor,
    handleExecutorChange,
    newComment,
    handleCommentChange,
    handleAddComment,
    handleSnackbarClose,
  } = useTaskActions(task!);

  useEffect(() => {
    if (task) {
      setActiveStatus(task.statusName);
      setActiveExecutor(task.executorName);
    }
  }, [task]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  if (!task) return <div>Задача не найдена</div>;

  return (
    <SC.StyledCard>
      <CardHeader
        avatar={`№ ${task?.id}`}
        title={task?.name}
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
            <Typography gutterBottom>{task?.description}</Typography>
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
            {task?.lifetimeItems &&
              task.lifetimeItems.length > 0 &&
              task.lifetimeItems
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
              {task?.initiatorName}
            </Typography>
          </div>
          <div>
            <Typography color="text.secondary" variant="subtitle2">
              Создана
            </Typography>
            <Typography gutterBottom noWrap>
              {task?.initiatorName}
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
              {task?.priorityName}
            </Typography>
          </div>
          <div>
            <Typography color="text.secondary" variant="subtitle2">
              Срок
            </Typography>
            <Stack direction="row" spacing={1}>
              <CalendarMonthOutlinedIcon htmlColor="gray" />
              <Typography gutterBottom noWrap>
                {task && formatDatePlan(task.resolutionDatePlan)}
              </Typography>
            </Stack>
          </div>
          <div>
            <Typography color="text.secondary" variant="subtitle2">
              Теги
            </Typography>
            <Stack direction="row" spacing={1}>
              {task?.tags &&
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
