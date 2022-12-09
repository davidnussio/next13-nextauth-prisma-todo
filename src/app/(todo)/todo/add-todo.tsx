"use client";

import ky from "ky";
import { useRouter } from "next/navigation";
import { useRef, useState, useTransition } from "react";

async function update(value: string) {
  // Refresh the current route and fetch new data from the server
  await ky.post("/api/todo", { json: { title: value } });
}

export default function AddTodo() {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [value, setValue] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isFetching, setIsFetching] = useState(false);

  const isMutating = isFetching || isPending;

  const changeInputValue = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
  };

  const addTodo = async () => {
    setValue("");
    setIsFetching(true);
    await update(value.trim());
    setIsFetching(false);
    startTransition(() => {
      router.refresh();
      inputRef.current?.focus();
    });
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
        className="grow rounded border-2 border-purple-500 p-2 disabled:bg-gray-400 disabled:text-slate-200"
        ref={(ref) => {
          inputRef.current = ref;
          inputRef.current?.focus();
        }}
        type="text"
        onChange={changeInputValue}
        onKeyDown={filterKeyDown(["Enter"], addTodo)}
        value={value}
        disabled={isMutating}
      />
      <button
        className="rounded border border-slate-500 bg-slate-200 p-2 disabled:bg-gray-400 disabled:text-slate-200"
        onClick={addTodo}
        disabled={isMutating}
      >
        Add Todo
      </button>
    </div>
  );
}
