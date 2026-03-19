import { Outlet } from "react-router-dom"

export default function AppLayout() {
  return (
    <div className="flex h-screen bg-surface-secondary">
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  )
}