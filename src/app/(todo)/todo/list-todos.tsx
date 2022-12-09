"use client";

import { useState } from "react";
import { cn } from "~/lib/utils";
import type { TodoSerialize } from "../api";
import Todo from "./todo";

export const ListTodos = ({ todos }: { todos: TodoSerialize[] }) => {
  const [filter, setFilter] = useState(false);

  const applyFilter = () => setFilter(!filter);

  const filteredTodos = (todos: TodoSerialize[]) =>
    filter ? todos.filter((todo) => !todo.completed) : todos;

  if (!todos || todos.length === 0) return <p>No todos</p>;

  return (
    <div>
      <div
        className={cn("mb-4 rounded bg-green-100 py-4", {
          "bg-green-300": filter,
        })}
      >
        <input type="checkbox" className="ml-3 mr-2" onChange={applyFilter} />{" "}
        Show only incomplete todos
      </div>
      <ul role="list" className="flex flex-col space-y-2">
        {filteredTodos(todos).map((todo) => (
          <Todo key={todo.id} {...todo} />
        ))}
      </ul>
    </div>
  );
};
