import type { Todo } from "@prisma/client";
import { prisma } from "~/server/db/client";

export type TodoSerialize = Omit<Todo, "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export const getAuthorTodos = async (
  authorId: string
): Promise<TodoSerialize[]> => {
  const data = await prisma.todo.findMany({
    where: {
      authorId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return data.map(({ createdAt, updatedAt, ...todo }) => ({
    ...todo,
    createdAt: createdAt.toISOString(),
    updatedAt: updatedAt.toISOString(),
  }));
};
