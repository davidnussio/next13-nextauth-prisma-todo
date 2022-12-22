import { Suspense } from "react";
import "~/styles/globals.css";
import Header from "./header";
import TailwindDimesions from "./tailwind-dimensions";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head />
      <body className="min-h-screen bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        <Suspense>
          {/* @ts-expect-error Async Server Component */}
          <Header />
        </Suspense>
        {children}
        <TailwindDimesions />
      </body>
    </html>
  );
}

export default RootLayout;
