"use client";

import { getTasks } from "@/store/tasks.slice";
import { useAppDispatch, useAppSelector } from "@/store/store.hooks";
import { useEffect } from "react";
import TasksList from "@/components/TasksList/TasksList";
import { getPriorities } from "@/store/priorities.slice";
import { getStatuses } from "@/store/statuses.slice";

export default function TasksPage() {
  const { priorities } = useAppSelector((state) => state.priorities);
  const { statuses } = useAppSelector((state) => state.statuses);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (priorities.length < 1) dispatch(getPriorities());
    if (statuses.length < 1) dispatch(getStatuses());
    dispatch(getTasks());
  }, []);

  return (
    <div>
      <TasksList />
    </div>
  );
}
