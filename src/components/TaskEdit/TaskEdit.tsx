import * as React from "react";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import { Avatar, Card, CardHeader, Chip, Divider, Stack } from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/store.hooks";
import { getTask } from "@/store/activeTask.slice";
import CloseIcon from "@mui/icons-material/Close";
import CalendarMonthOutlinedIcon from "@mui/icons-material/CalendarMonthOutlined";
import * as SC from "./TaskEdit.style";
import { formatCommentDate, formatDatePlan } from "@/helpers/common";

export default function TaskEdit({
  taskId,
  onClose,
}: {
  taskId: number;
  onClose: () => void;
}) {
  console.log(taskId);
  const { task } = useAppSelector((state) => state.activeTask);

  const dispatch = useAppDispatch();

  React.useEffect(() => {
    dispatch(getTask(taskId));
  }, []);

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
            task.lifetimeItems.map((item) => {
              return (
                <Card
                  key={item.id}
                  sx={{
                    backgroundColor: "#f0f9ff",
                    border: "none",
                    boxShadow: "none",
                  }}
                >
                  <CardHeader
                    avatar={<Avatar></Avatar>}
                    title="Name"
                    subheader={`${formatCommentDate(item.createdAt)}`}
                  />
                  <CardContent>
                    <Typography gutterBottom>{item.comment}</Typography>
                  </CardContent>
                </Card>
              );
            })}
        </div>
        <Divider orientation="vertical" />
        <SC.StyledCardContent>
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
    </SC.StyledCard>
  );
}
