"use client";

import { useDeferredValue, useState, useTransition } from "react";
import { useSWRConfig } from "swr";
import { cn } from "~/lib/utils";
import type { TodoSerialize } from "../api";
async function update(id: string, completed: boolean) {
  const res = await fetch(`/api/todo/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ completed }),
  });

  return await res.json();
}

export default function Todo(todo: TodoSerialize) {
  const { mutate } = useSWRConfig();
  const [isMutating, setIsMutating] = useState(false);
  const [currentUpdateAt, setCurrentUpdateAt] = useState(todo.updatedAt);

  if (currentUpdateAt !== todo.updatedAt) {
    console.log(
      "stale object",

      todo.updatedAt,
      todo
    );
    setCurrentUpdateAt(todo.updatedAt);
    setIsMutating(false);
  }

  async function handleChange() {
    try {
      setIsMutating(true);
      await mutate(
        "/api/todo",
        async () => {
          await update(todo.id, !todo.completed);
        }
        // {
        //   optimisticData: (current: TodoSerialize[]) => {
        //     return current.map((item) => {
        //       if (item.id === todo.id) {
        //         return {
        //           ...item,
        //           title: item.title,
        //           saving: true,
        //           completed: !item.completed,
        //         };
        //       }
        //       return item;
        //     });
        //   },
        // }
      );
    } catch (e) {
      console.error("error", e);
      setIsMutating(false);
    }
  }

  return (
    <li
      className={cn(
        "rounded py-4",
        isMutating ? "animate-pulse bg-white/20" : "bg-white/10"
      )}
    >
      <div className="ml-3 flex">
        <p className="text-sm font-medium">
          <input
            disabled={isMutating}
            className="mr-2 h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
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
      {/* <div className="ml-3 h-4 text-xs">{todo.saving && "saving..."}</div> */}
    </li>
  );
}
