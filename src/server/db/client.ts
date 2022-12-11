import { PrismaClient } from "@prisma/client";
import type { PrismaClientOptions } from "@prisma/client/runtime/index.js";

import { env } from "../../env/server.mjs";

declare let global: {
  prisma: PrismaClient<
    PrismaClientOptions,
    "info" | "warn" | "error" | "query"
  >;
};

export const prisma =
  global.prisma ||
  new PrismaClient({
    log:
      env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["query", "error"],
  });

if (env.NODE_ENV !== "production") {
  global.prisma = prisma;
}

prisma.$on("query", (e) => {
  if (e.duration > 50) {
    console.log("Query: " + e.query);
    console.log("Params: " + e.params);
    console.log("Duration: " + e.duration + "ms");
  }
});
