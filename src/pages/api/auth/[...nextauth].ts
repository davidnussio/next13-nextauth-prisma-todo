import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email"; // Prisma adapter for NextAuth, optional and can be removed
import GoogleProvider from "next-auth/providers/google";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(prisma),
  session: {
    strategy: "jwt",
  },
  // pages: {
  //   signIn: "/login",
  // },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    EmailProvider({
      from: process.env.SMTP_FROM,
      sendVerificationRequest: async ({ identifier, url, provider }) => {
        // const user = await prisma.user.findUnique({
        //   where: {
        //     email: identifier,
        //   },
        //   select: {
        //     emailVerified: true,
        //   },
        // });

        // console.log("user", user);
        console.log("identifier", identifier);
        console.log("url", url);
        console.log("provider", provider);

        // const templateId = user?.emailVerified
        //   ? process.env.POSTMARK_SIGN_IN_TEMPLATE
        //   : process.env.POSTMARK_ACTIVATION_TEMPLATE;
        // const result = await postmarkClient.sendEmailWithTemplate({
        //   TemplateId: parseInt(templateId),
        //   To: identifier,
        //   From: provider.from,
        //   TemplateModel: {
        //     action_url: url,
        //     product_name: siteConfig.name,
        //   },
        //   Headers: [
        //     {
        //       // Set this to prevent Gmail from threading emails.
        //       // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
        //       Name: "X-Entity-Ref-ID",
        //       Value: new Date().getTime() + "",
        //     },
        //   ],
        // });

        // if (result.ErrorCode) {
        //   throw new Error(result.Message);
        // }
      },
    }),
  ],
  callbacks: {
    async session({ token, session }) {
      console.log("session", token, session);
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user }) {
      console.log("jwt", token, user);
      const dbUser = await prisma.user.findFirst({
        where: {
          email: token.email,
        },
      });

      if (!dbUser) {
        token.id = user?.id;
        return token;
      }

      return {
        id: dbUser.id,
        name: dbUser.name,
        email: dbUser.email,
        picture: dbUser.image,
      };
    },
  },
};

export default NextAuth(authOptions);
