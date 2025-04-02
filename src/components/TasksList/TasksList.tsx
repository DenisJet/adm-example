import { useMemo, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tooltip,
} from "@mui/material";
import { useAppSelector } from "@/store/store.hooks";
import * as SC from "./TasksList.style";
import TaskEdit from "../TaskEdit/TaskEdit";
import TaskCreate from "../TaskCreate/TaskCreate";

export default function TasksList() {
  const [open, setOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [isCreate, setIsCreate] = useState(false);

  const { tasks, isLoading, error } = useAppSelector((state) => state.tasks);
  const { priorities } = useAppSelector((state) => state.priorities);

  const toggleDrawer = (newOpen: boolean, taskId?: number) => () => {
    setOpen(newOpen);
    if (taskId) {
      setActiveTaskId(taskId);
      setIsCreate(false);
    }
  };

  const handleCreateClick = () => {
    setOpen(true);
    setActiveTaskId(null);
    setIsCreate(true);
  };

  const rows = useMemo(() => {
    const priorityMap = new Map(priorities.map((p) => [p.id, p.rgb]));

    return tasks.map((task) => ({
      priorityColor: priorityMap.get(task.priorityId) || "",
      id: task.id,
      name: task.name,
      status: task.statusName,
      statusColor: task.statusRgb,
      executor: task.executorName,
    }));
  }, [tasks, priorities]);

  if (isLoading) return <div>Loading...</div>;

  if (error) return <div>{error}</div>;

  return (
    <>
      <SC.StyledButton
        size="small"
        variant="contained"
        onClick={handleCreateClick}
      >
        Создать заявку
      </SC.StyledButton>
      <TableContainer>
        <SC.StyledTable>
          <TableHead>
            <TableRow>
              <TableCell style={{ width: "5%" }}>ID</TableCell>
              <TableCell style={{ width: "30%" }} align="left">
                Название
              </TableCell>
              <TableCell style={{ width: "5%" }} align="left">
                Статус
              </TableCell>
              <TableCell style={{ width: "10%" }} align="left">
                Исполнитель
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                onClick={toggleDrawer(true, row.id)}
                sx={{
                  "&:last-child td, &:last-child th": { border: 0 },
                  borderLeft: `5px solid ${row.priorityColor}`,
                }}
              >
                <TableCell>{row.id}</TableCell>
                <Tooltip title={row.name}>
                  <TableCell align="left">{row.name}</TableCell>
                </Tooltip>
                <TableCell align="left">
                  <span style={{ backgroundColor: row.statusColor }}>
                    {row.status}
                  </span>
                </TableCell>
                <TableCell align="left">{row.executor}</TableCell>
                <TableCell></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </SC.StyledTable>
      </TableContainer>
      <Drawer
        anchor="right"
        open={open}
        onClose={toggleDrawer(false)}
        aria-hidden="false"
      >
        <Box sx={{ width: "60vw" }}>
          <div>
            {isCreate ? (
              <TaskCreate onClose={toggleDrawer(false)} />
            ) : activeTaskId ? (
              <TaskEdit taskId={activeTaskId} onClose={toggleDrawer(false)} />
            ) : null}
          </div>
        </Box>
      </Drawer>
    </>
  );
}
