"use client";

import { useSWRConfig } from "swr";
import { cn } from "~/lib/utils";
import type { TodoSerialize } from "../api";
async function update(id: string, completed: boolean) {
  await fetch(`/api/todo/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  });
}

export default function Todo(todo: TodoSerialize) {
  const { mutate } = useSWRConfig();

  const isMutating = todo?.saving ?? false;

  async function handleChange() {
    mutate(
      "/api/todo",
      async () => {
        console.log("mutate");
        await update(todo.id, !todo.completed);
      },
      {
        optimisticData: (current: TodoSerialize[]) => {
          return current.map((item) => {
            if (item.id === todo.id) {
              return {
                ...item,
                title: item.title,
                saving: true,
              };
            }
            return item;
          });
        },
      }
    );
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
