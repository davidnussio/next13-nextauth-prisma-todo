import { prisma } from "../../server/db/client";

import { api } from "./todo/[id]";

const handler = api().get(async (req, res) => {
  const data = await prisma.todo.create({
    data: {
      title: new Date().toISOString(),
      authorId: "demo",
      completed: false,
    },
  });
  res.json(data);
});

export default handler;
