"use client";

import { useSession } from "next-auth/react";
import { useRef, useState } from "react";
import { useSWRConfig } from "swr";
import type { TodoSerialize } from "../api";

async function update(value: string) {
  await fetch("/api/todo", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ title: value }),
  });
}

export default function AddTodo() {
  const { mutate } = useSWRConfig();

  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");

  const changeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const addTodo = async () => {
    const title = value.trim();
    setValue("");

    mutate(
      "/api/todo",
      async () => {
        await update(title);
      },
      {
        optimisticData: (current: TodoSerialize[]) => {
          const newItem: TodoSerialize = {
            title: title + " (saving...)",
            completed: false,
            id: "null",
            authorId: "null",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
          return [newItem].concat(current);
        },
      }
    );
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
    <div className="flex space-x-2 pb-4">
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
