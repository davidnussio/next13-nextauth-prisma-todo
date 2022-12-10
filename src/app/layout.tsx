import "~/styles/globals.css";

function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head />
      <body className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c] text-white">
        {children}
      </body>
    </html>
  );
}

export default RootLayout;
