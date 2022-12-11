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

  if (todos.length === 0)
    return (
      <p className="py-4 text-center text-xl">
        {isLoading ? "Loading..." : "No todos"}
      </p>
    );

  const filteredTodos = (todos: TodoSerialize[]) =>
    filter ? todos?.filter((todo) => !todo.completed || todo.saving) : todos;

  return (
    <>
      <div className="mb-4">
        <button
          type="button"
          className="disabled:text-white-300 w-full rounded border-2 border-purple-500 bg-white/10 p-2 disabled:bg-white/40"
          onClick={applyFilter}
        >
          {filter ? "Show only incomplete todos" : "Show all todo"}
        </button>
      </div>
      <ul role="list" className="flex flex-col space-y-2">
        {filteredTodos(todos).map((todo) => (
          <Todo key={todo.id} {...todo} />
        ))}
      </ul>
    </>
  );
};
