import { Suspense } from "react";
import { LoginComponent } from "./login-component";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <div className="container flex flex-col items-center justify-center gap-12 px-4 py-16 ">
        <h1 className="text-5xl font-extrabold tracking-tight text-white sm:text-[5rem]">
          Create <span className="text-[hsl(280,100%,70%)]">dambox Sagl</span>{" "}
          App
        </h1>
        <div className="grid grid-cols-1 gap-4 md:gap-8">
          <div className="flex max-w-xs flex-col gap-4 rounded-xl bg-white/10 p-4 text-white hover:bg-white/20">
            <h3 className="text-2xl font-bold">Todo</h3>
            <div className="text-lg">
              Just the basics - Everything you need to do, here.
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center gap-2">
          <Suspense fallback={<div>loading...</div>}>
            {/* @ts-expect-error Async Server Component */}
            <LoginComponent />
          </Suspense>
        </div>
      </div>
    </main>
  );
}
