"use client";

import { getTasks } from "@/store/tasks.slice";
import { useAppDispatch, useAppSelector } from "@/store/store.hooks";
import { useEffect } from "react";

export default function TasksPage() {
  const tasks = useAppSelector((state) => state.tasks).tasks;
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getTasks());
  }, []);

  console.log("tasks", tasks);

  return <h1>Заявки</h1>;
}
