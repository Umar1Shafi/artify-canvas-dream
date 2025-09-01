// src/components/AppShell.tsx
import "@/styles/pro.css";
import AppHeader from "./AppHeader";

export default function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen">
      <AppHeader />
      <main className="pro-shell">{children}</main>
      <footer className="pro-shell text-xs opacity-60 mt-12">
        © {new Date().getFullYear()} Artify Canvas — crafted with care.
      </footer>
    </div>
  );
}
