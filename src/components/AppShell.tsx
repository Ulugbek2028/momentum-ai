import { Outlet } from "@tanstack/react-router";
import { Sidebar, MobileTabBar } from "./Sidebar";

export function AppShell() {
  return (
    <div className="min-h-dvh bg-bg-base">
      <Sidebar />
      <main className="lg:pl-60 pb-20 lg:pb-0 min-h-dvh">
        <div className="mx-auto max-w-7xl px-4 lg:px-10 py-6 lg:py-10">
          <Outlet />
        </div>
      </main>
      <MobileTabBar />
    </div>
  );
}
