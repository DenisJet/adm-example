import { useMemo } from "react";
import {
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useAppSelector } from "@/store/store.hooks";
import * as SC from "./TasksList.style";

interface TableRowData {
  priorityColor: string;
  id: number;
  name: string;
  status: string;
  statusColor: string;
  executor: string;
}

export default function TasksList() {
  const { tasks } = useAppSelector((state) => state.tasks);
  const { priorities } = useAppSelector((state) => state.priorities);

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
              sx={{
                "&:last-child td, &:last-child th": { border: 0 },
                borderLeft: `5px solid ${row.priorityColor}`,
              }}
            >
              <TableCell>{row.id}</TableCell>
              <TableCell align="left">{row.name}</TableCell>
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
  );
}
