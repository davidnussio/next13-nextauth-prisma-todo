"use client";

import ky from "ky";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { cn } from "~/lib/utils";
import type { TodoSerialize } from "../api";
async function update(id: string, completed: boolean, callback?: () => void) {
  await ky.patch(`/api/todo/${id}`, { json: { completed } });
  if (typeof callback === "function") {
    callback();
  }
}

export default function Todo(todo: TodoSerialize) {
  const router = useRouter();

  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);

  const isMutating = isFetching || isPending;

  async function handleChange() {
    setIsFetching(true);
    await update(todo.id, !todo.completed);
    setIsFetching(false);
    startTransition(() => {
      router.refresh();
    });
  }

  return (
    <li
      className={cn(
        "rounded py-4",
        isMutating ? "animate-pulse bg-white/20" : "bg-white/10"
      )}
    >
      <div className="ml-3 flex">
        <p className="text-sm font-medium ">
          <input
            disabled={isMutating}
            className="mr-2"
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
          className={cn("text-sm", {
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
    </li>
  );
}
