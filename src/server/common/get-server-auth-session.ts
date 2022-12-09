import type { User } from "@prisma/client";
import { unstable_getServerSession } from "next-auth";

import { authOptions } from "../../pages/api/auth/[...nextauth]";

/**
 * Wrapper for unstable_getServerSession https://next-auth.js.org/configuration/nextjs
 * See example usage in trpc createContext or the restricted API route
 */
// export const getServerAuthSession = async (ctx: {
//   req: GetServerSidePropsContext["req"];
//   res: GetServerSidePropsContext["res"];
// }) => {
//   return await unstable_getServerSession(ctx.req, ctx.res, authOptions);
// };
export const getSession = async () => {
  return await unstable_getServerSession(authOptions);
};

export const getCurrentUser = async () => {
  return (await getSession())?.user;
};
