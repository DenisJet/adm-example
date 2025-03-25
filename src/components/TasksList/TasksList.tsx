import { useMemo, useState } from "react";
import {
  Box,
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

interface TableRowData {
  priorityColor: string;
  id: number;
  name: string;
  status: string;
  statusColor: string;
  executor: string;
}

export default function TasksList() {
  const [open, setOpen] = useState(false);
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);

  const { tasks } = useAppSelector((state) => state.tasks);
  const { priorities } = useAppSelector((state) => state.priorities);

  const toggleDrawer = (newOpen: boolean, taskId?: number) => () => {
    setOpen(newOpen);
    if (taskId) setActiveTaskId(taskId);
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

  return (
    <>
      <TableContainer>
        <SC.StyledTable>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell align="left">Название</TableCell>
              <TableCell align="left">Статус</TableCell>
              <TableCell align="left">Исполнитель</TableCell>
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
              </TableRow>
            ))}
          </TableBody>
        </SC.StyledTable>
      </TableContainer>
      {activeTaskId && (
        <Drawer anchor="right" open={open} onClose={toggleDrawer(false)}>
          <Box sx={{ width: "50vw" }} role="presentation">
            <div>
              <TaskEdit taskId={activeTaskId} onClose={toggleDrawer(false)} />
            </div>
          </Box>
        </Drawer>
      )}
    </>
  );
}
