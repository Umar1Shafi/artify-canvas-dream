import React, { PropsWithChildren } from "react";

export function Footer() {
  return (
    <footer className="border-t mt-10">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs text-slate-500">
        © {new Date().getFullYear()} Artify Canvas Dream — FastAPI + React
      </div>
    </footer>
  );
}

export default function Layout({ children }: PropsWithChildren) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-teal-50 to-purple-50">
      <main className="mx-auto max-w-6xl px-4 py-6">{children}</main>
      <Footer />
    </div>
  );
}
