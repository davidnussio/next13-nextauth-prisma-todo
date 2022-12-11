"use client";

import { useState } from "react";
import useSWR from "swr";
import { cn } from "~/lib/utils";
import type { TodoSerialize } from "../api";
import Todo from "./todo";

const fetchTodo = async () => {
  const res = await fetch("/api/todo");
  const data = await res.json();
  return data;
};

export const ListTodos = () => {
  const { isLoading, data } = useSWR("/api/todo", fetchTodo, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });
  const [filter, setFilter] = useState(false);

  const applyFilter = () => setFilter(!filter);

  const todos = data || [];

  if (todos.length === 0) return <p>{isLoading ? "Loading..." : "No todos"}</p>;

  const filteredTodos = (todos: TodoSerialize[]) =>
    filter ? todos?.filter((todo) => !todo.completed || todo.saving) : todos;

  return (
    <div className="w-96">
      <div
        className={cn("mb-4 rounded bg-white/10 py-4", {
          "bg-red-500/20": filter,
        })}
      >
        <button type="button" className="w-full" onClick={applyFilter}>
          {filter ? "Show only incomplete todos" : "Show all todo"}
        </button>
      </div>
      <ul role="list" className="flex flex-col space-y-2">
        {filteredTodos(todos).map((todo) => (
          <Todo key={todo.id} {...todo} />
        ))}
      </ul>
    </div>
  );
};
