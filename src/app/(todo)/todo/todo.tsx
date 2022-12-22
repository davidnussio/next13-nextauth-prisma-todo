"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { cn } from "~/lib/utils";
import type { TodoSerialize } from "../api";

async function updateTodo({ id, completed }: TodoSerialize) {
  const response = await fetch(`/api/todo/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  });

  if (!response.ok) {
    throw new Error("");
  }

  return await response.json();
}

const useTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    // When mutate is called:
    onMutate: async (todo: TodoSerialize) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<TodoSerialize[]>([
        "todos",
      ]);

      const nextTodos = Array.isArray(previousTodos)
        ? previousTodos.map((it) => (it.id === todo.id ? todo : it))
        : [todo];

      // Optimistically update to the new value
      queryClient.setQueryData(["todos"], nextTodos);

      // Return a context object with the snapshotted value
      // return { oldTodo: previousTodos.find((todo) => todo.id === newTodo.id) };
      return { previousTodos };
    },
    // If the mutation fails,
    // use the context returned from onMutate to roll back
    onError: (err, newTodo, context) => {
      console.log("ERRORE", err, { newTodo }, { context });
      queryClient.setQueryData(["todos"], context?.previousTodos || []);
    },
    // Always refetch after error or success:
    onSettled: () => {
      console.log("onSettled");
      queryClient.invalidateQueries({ queryKey: ["todos"] });
    },
  });
};

export default function Todo(todo: TodoSerialize) {
  const mutation = useTodoMutation();

  async function handleChange() {
    mutation.mutate({ ...todo, completed: !todo.completed });
  }

  return (
    <li
      className={cn(
        "rounded py-4",
        mutation.isLoading ? "animate-pulse bg-white/20" : "bg-white/10"
      )}
    >
      <div className="flex space-x-4 px-2">
        <p>
          <input
            disabled={mutation.isLoading}
            className="h-6 w-6 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            type="checkbox"
            checked={todo.completed}
            onChange={handleChange}
          />
        </p>
        <p
          className={cn("grow text-sm", {
            "line-through": todo.completed,
          })}
        >
          {todo.title}
        </p>
        <p
          className={cn("text-xs text-white/60", {
            "line-through": todo.completed,
          })}
        >
          {new Intl.DateTimeFormat("it-CH", {
            hour: "numeric",
            minute: "numeric",
            timeZone: "Europe/Zurich",
          }).format(new Date(todo.createdAt))}
        </p>
      </div>
      {/* <div className="ml-3 h-4 text-xs">{todo.saving && "saving..."}</div> */}
    </li>
  );
}
