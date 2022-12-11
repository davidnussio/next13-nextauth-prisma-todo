import NextAuth, { type NextAuthOptions } from "next-auth";
import EmailProvider from "next-auth/providers/email"; // Prisma adapter for NextAuth, optional and can be removed
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";

import { PrismaAdapter } from "@next-auth/prisma-adapter";

import { env } from "../../../env/server.mjs";
import { prisma } from "../../../server/db/client";
import type { Provider } from "next-auth/providers/index.js";

const providers: Provider[] = [
  GoogleProvider({
    clientId: env.GOOGLE_ID,
    clientSecret: env.GOOGLE_SECRET,
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
      console.log(url);
      // console.log("provider", provider);

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
];

if (env.FAKE_LOGIN === "true") {
  providers.push(
    CredentialsProvider({
      id: "email-password-credentials",
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Sign in with Email and Password",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        username: { label: "Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        console.log(credentials);
        console.log(req.body);
        console.log(req.body?.username);
        console.log("&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");

        let user;
        try {
          user = await prisma.user.findUnique({
            where: {
              email: req.body?.username,
            },
          });
        } catch (e: any) {
          console.log(e);
        }

        console.log("1 -------> user", user);

        if (!user) {
          user = await prisma.user.create({
            data: {
              email: req.body?.email,
              name: "test",
              emailVerified: new Date(),
            },
          });
        }

        console.log("2 -------> user", user);

        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user;
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null;

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      },
    })
  );
}

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  adapter: PrismaAdapter(prisma),
  debug: false,
  session: {
    strategy: "jwt",
  },
  // pages: {
  //   signIn: "/login",
  // },
  theme: {
    colorScheme: "dark",
  },
  providers,
  callbacks: {
    async session({ token, session }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.name = token.name;
        session.user.email = token.email;
        session.user.image = token.picture;
      }

      return session;
    },
    async jwt({ token, user }) {
      // Frist time this function pass user, add user id to token
      if (user) {
        token.id = user.id;
      }

      return token;
    },
  },
};

export default NextAuth(authOptions);
