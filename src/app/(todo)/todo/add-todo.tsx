"use client";

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRef, useState } from "react";
import type { TodoSerialize } from "../api";

async function updateTodo(newTodos: TodoSerialize): Promise<TodoSerialize> {
  return fetch("/api/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: newTodos.title }),
  }).then((response) => {
    if (response.ok) {
      return response.json();
    }
    throw new Error("Error");
  });
}

const useTodoMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: updateTodo,
    // When mutate is called:
    onMutate: async (newTodos: TodoSerialize) => {
      // Cancel any outgoing refetches
      // (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({ queryKey: ["todos"] });

      // Snapshot the previous value
      const previousTodos = queryClient.getQueryData<TodoSerialize[]>([
        "todos",
      ]);

      const nextTodos = Array.isArray(previousTodos)
        ? [newTodos].concat(previousTodos)
        : [newTodos];

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

export default function AddTodo() {
  const mutation = useTodoMutation();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");

  const changeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const addTodo = async () => {
    setValue("");

    const newTodos: TodoSerialize = {
      title: value.trim(),
      completed: false,
      saving: true,
      id: "null",
      authorId: "null",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    mutation.mutate(newTodos);
  };

  // Filter key down event to only allow enter key
  const filterKeyDown =
    (keys: string[], callback: () => void) =>
    (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (keys.includes(e.key)) {
        callback();
      }
    };

  return (
    <div className="flex flex-col space-y-2 pb-4 sm:flex-row sm:space-y-0 sm:space-x-2">
      <input
        className="grow rounded border-2 border-purple-500 p-2 text-black/90 disabled:bg-white/40"
        ref={(ref) => {
          inputRef.current = ref;
          inputRef.current?.focus();
        }}
        type="text"
        onChange={changeInputValue}
        onKeyDown={filterKeyDown(["Enter"], addTodo)}
        value={value}
      />
      <button
        className="disabled:text-white-300 rounded border-2 border-purple-500 bg-white/10 p-2 disabled:bg-white/40"
        onClick={addTodo}
      >
        Add Todo
      </button>
    </div>
  );
}
