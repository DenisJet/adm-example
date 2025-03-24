"use client";
import { getPriorities } from "@/store/priorities.slice";
import { getStatuses } from "@/store/statuses.slice";
import { useAppDispatch, useAppSelector } from "@/store/store.hooks";
import { useEffect } from "react";

export default function Home() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(getPriorities());
    dispatch(getStatuses());
  }, []);

  return <h1>Home Page</h1>;
}
