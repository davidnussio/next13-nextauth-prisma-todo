import { z } from "zod";
import { prisma } from "../../../server/db/client";

import { api, validate } from "./[id]";

const handler = api()
  .get(async (req, res) => {
    const userId = req.session?.user?.id;

    const data = await prisma.todo.findMany({
      where: {
        authorId: userId,
      },
    });
    res.json(data);
  })
  .use(validate(z.object({ body: z.object({ title: z.string() }) })))
  .post(async (req, res) => {
    const userId = req.session?.user?.id;
    const { title } = req.body;

    if (!userId) {
      return res.status(401).end("Unauthorized");
    }

    const data = await prisma.todo.create({
      data: {
        title,
        authorId: userId,
      },
    });
    res.json(data);
  });

export default handler;
