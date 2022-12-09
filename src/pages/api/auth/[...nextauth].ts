import NextAuth, { type NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

import { env } from "../../../env/server.mjs";

export const authOptions: NextAuthOptions = {
  // huh any! I know.
  // This is a temporary fix for prisma client.
  // @see https://github.com/prisma/prisma/issues/16117
  // adapter: PrismaAdapter(prisma),
  debug: true,
  // session: {
  //   strategy: "jwt",
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  //   updateAge: 24 * 60 * 60, // 24 hours
  // },
  // jwt: {
  //   maxAge: 30 * 24 * 60 * 60, // 30 days
  // },

  // pages: {
  //   signIn: "/login",
  // },
  providers: [
    GoogleProvider({
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    }),
    // EmailProvider({
    //   from: process.env.SMTP_FROM,
    //   sendVerificationRequest: async ({ identifier, url, provider }) => {
    //     // const user = await prisma.user.findUnique({
    //     //   where: {
    //     //     email: identifier,
    //     //   },
    //     //   select: {
    //     //     emailVerified: true,
    //     //   },
    //     // });

    //     // console.log("user", user);
    //     console.log("identifier", identifier);
    //     console.log(url);
    //     // console.log("provider", provider);

    //     // const templateId = user?.emailVerified
    //     //   ? process.env.POSTMARK_SIGN_IN_TEMPLATE
    //     //   : process.env.POSTMARK_ACTIVATION_TEMPLATE;
    //     // const result = await postmarkClient.sendEmailWithTemplate({
    //     //   TemplateId: parseInt(templateId),
    //     //   To: identifier,
    //     //   From: provider.from,
    //     //   TemplateModel: {
    //     //     action_url: url,
    //     //     product_name: siteConfig.name,
    //     //   },
    //     //   Headers: [
    //     //     {
    //     //       // Set this to prevent Gmail from threading emails.
    //     //       // See https://stackoverflow.com/questions/23434110/force-emails-not-to-be-grouped-into-conversations/25435722.
    //     //       Name: "X-Entity-Ref-ID",
    //     //       Value: new Date().getTime() + "",
    //     //     },
    //     //   ],
    //     // });

    //     // if (result.ErrorCode) {
    //     //   throw new Error(result.Message);
    //     // }
    //   },
    // }),
  ],
  theme: {
    colorScheme: "light",
  },
  callbacks: {
    async jwt({ token }) {
      token.userRole = "admin";
      return token;
    },
  },
};

export default NextAuth(authOptions);
