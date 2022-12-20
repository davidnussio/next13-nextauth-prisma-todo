import type { NextApiRequest, NextApiResponse } from "next";
import { prisma } from "../../../server/db/client";

import type { NextHandler } from "next-connect";
import nc from "next-connect";
import type { AnyZodObject } from "zod";
import { z } from "zod";
import { authOptions } from "../auth/[...nextauth]";
import type { Session } from "next-auth";
import { unstable_getServerSession } from "next-auth";
import { env } from "~/env/server.mjs";
import { createHash } from "crypto";

type NextApiRequestWithSession = NextApiRequest & {
  session?: Session;
};

export const validate =
  (schema: AnyZodObject) =>
  async (
    req: NextApiRequestWithSession,
    res: NextApiResponse,
    next: NextHandler
  ) => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
      });
      return next();
    } catch (error) {
      return res.status(400).json(error);
    }
  };

export const useSession = async (
  req: NextApiRequestWithSession,
  res: NextApiResponse,
  next: NextHandler
) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  req.session = session || undefined;
  next();
};
export const useAuth = async (
  req: NextApiRequestWithSession,
  res: NextApiResponse,
  next: NextHandler
) => {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session?.user) {
    return next();
  }
  res.status(401).end("Unauthorized");
};
export const verifyNextAuthCsrfToken = (
  req: NextApiRequestWithSession,
  res: NextApiResponse,
  next: NextHandler
) => {
  const secret = env.NEXTAUTH_SECRET;
  const csrfMethods = ["POST", "PUT", "PATCH", "DELETE"];
  const method = req.method || "";
  const tokenToCheck = req.body.csrfToken || req.query.csrfToken || "";

  console.log("- tokenToCheck", tokenToCheck);
  console.log("- method", method);

  if (!csrfMethods.includes(method)) {
    // we dont need to check the CSRF if it's not within the method.
    return next();
  }

  try {
    const useSecureCookies = req.url?.startsWith("https://");
    const csrfProp = `${useSecureCookies ? "__Host-" : ""}next-auth.csrf-token`;
    console.log("- csrfProp", csrfProp);
    if (req.cookies[csrfProp]) {
      console.log("- req.cookies[csrfProp]", req.cookies[csrfProp]);
      const cookieValue = req.cookies[csrfProp] || "";
      const cookieSplitKey = cookieValue.match("|") ? "|" : "%7C";

      const [csrfTokenValue, csrfTokenHash] = cookieValue.split(cookieSplitKey);

      console.log("- csrfTokenValue", csrfTokenValue);
      console.log("- csrfTokenHash", csrfTokenHash);
      const generatedHash = createHash("sha256")
        .update(`${tokenToCheck}${secret}`)
        .digest("hex");

      if (csrfTokenHash === generatedHash) {
        // If hash matches then we trust the CSRF token value
        if (csrfTokenValue === tokenToCheck) return next();
      }
    }
  } catch (error) {
    console.error("Error verifying CSRF token", error);
  } finally {
    return res.status(401).end("Unauthorized");
  }
};

export const api = () =>
  nc<NextApiRequestWithSession, NextApiResponse>({
    onError: (err, req, res) => {
      console.error(err.stack);
      res.status(500).end("Something broke!");
    },
    onNoMatch: (req, res) => {
      res.status(404).end("Page is not found");
    },
  }).use(useSession);

export const authApi = () => api().use(useAuth);

const handler = authApi()
  .use(
    validate(
      z.object({
        query: z.object({ id: z.string() }),
        body: z.object({
          completed: z.boolean({
            required_error: "Full name is required",
          }),
        }),
      })
    )
  )
  .patch(async (req, res) => {
    const userId = req.session?.user?.id;
    const { completed } = req.body;
    const { id } = req.query as { id: string };

    if (
      (await prisma.todo.count({
        where: {
          id,
          authorId: userId,
        },
      })) === 0
    ) {
      return res.status(404).end("Not found");
    }

    const todo = await prisma.todo.update({
      data: { completed },
      where: { id },
    });
    res.status(200).json(todo);
  });

export default handler;
