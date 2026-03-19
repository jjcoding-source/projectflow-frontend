import { useState } from "react"
import { Search, Bell, Plus, Menu, X, ChevronDown, CheckSquare, Bug, FolderKanban } from "lucide-react"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../store/authStore"
import type { Notification } from "../../types"

const MOCK_NOTIFICATIONS: Notification[] = [
  { id: "1", title: "Task assigned", message: "JWT refresh token logic was assigned to you", type: "task", isRead: false, createdAt: "2025-03-19T10:00:00Z" },
  { id: "2", title: "Bug reported", message: "Critical: Payment gateway double-charge", type: "bug", isRead: false, createdAt: "2025-03-19T09:30:00Z" },
  { id: "3", title: "Sprint ending soon", message: "Sprint 14 ends in 3 days", type: "sprint", isRead: false, createdAt: "2025-03-19T08:00:00Z" },
  { id: "4", title: "Mentioned in comment", message: "Rajan mentioned you in Auth middleware PR", type: "mention", isRead: true, createdAt: "2025-03-18T16:00:00Z" },
]

const QUICK_CREATE = [
  { icon: CheckSquare, label: "New task", color: "text-brand-600" },
  { icon: Bug, label: "Report bug", color: "text-red-500" },
  { icon: FolderKanban, label: "New project", color: "text-purple-600" },
]

interface TopbarProps {
  sidebarCollapsed: boolean
  onToggleSidebar: () => void
}

export default function Topbar({ sidebarCollapsed, onToggleSidebar }: TopbarProps) {
  const [notifOpen, setNotifOpen] = useState(false)
  const [createOpen, setCreateOpen] = useState(false)
  const user = useAuthStore((s) => s.user)

  const unreadCount = MOCK_NOTIFICATIONS.filter((n) => !n.isRead).length

  const notifTypeIcon = (type: Notification["type"]) => {
    switch (type) {
      case "task": return "🗂"
      case "bug": return "🐛"
      case "sprint": return "⚡"
      case "mention": return "💬"
      default: return "📌"
    }
  }

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  return (
    <header className="h-14 bg-white border-b border-surface-border flex items-center px-4 gap-3 flex-shrink-0 relative z-20">
      {/* Sidebar toggle */}
      <button
        onClick={onToggleSidebar}
        className="btn-ghost p-1.5 -ml-1"
        title={sidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {sidebarCollapsed ? <Menu className="w-4 h-4" /> : <X className="w-4 h-4" />}
      </button>

      {/* Search */}
      <div className="flex items-center gap-2 flex-1 max-w-sm bg-surface-secondary border border-surface-border rounded-lg px-3 py-1.5 text-sm text-gray-400 cursor-text hover:border-surface-border-strong transition-colors">
        <Search className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="flex-1">Search tasks, projects, bugs...</span>
        <kbd className="hidden md:block text-[10px] bg-surface-tertiary border border-surface-border rounded px-1 py-0.5 text-gray-400">⌘K</kbd>
      </div>

      <div className="flex items-center gap-2 ml-auto">
        {/* Quick create */}
        <div className="relative">
          <button
            onClick={() => { setCreateOpen(!createOpen); setNotifOpen(false) }}
            className="btn-primary btn-sm gap-1.5"
          >
            <Plus className="w-3.5 h-3.5" />
            Create
            <ChevronDown className="w-3 h-3" />
          </button>

          {createOpen && (
            <>
              <div className="fixed inset-0" onClick={() => setCreateOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-44 bg-white rounded-xl border border-surface-border shadow-modal py-1.5 animate-slide-up z-50">
                {QUICK_CREATE.map(({ icon: Icon, label, color }) => (
                  <button
                    key={label}
                    className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-surface-secondary transition-colors"
                    onClick={() => setCreateOpen(false)}
                  >
                    <Icon className={cn("w-4 h-4", color)} />
                    {label}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            onClick={() => { setNotifOpen(!notifOpen); setCreateOpen(false) }}
            className="relative btn-ghost p-2 rounded-lg"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
            )}
          </button>

          {notifOpen && (
            <>
              <div className="fixed inset-0" onClick={() => setNotifOpen(false)} />
              <div className="absolute right-0 top-full mt-1.5 w-80 bg-white rounded-xl border border-surface-border shadow-modal animate-slide-up z-50">
                <div className="flex items-center justify-between px-4 py-3 border-b border-surface-border">
                  <span className="text-sm font-semibold text-gray-900">Notifications</span>
                  {unreadCount > 0 && (
                    <span className="badge-blue text-[10px]">{unreadCount} new</span>
                  )}
                </div>
                <div className="divide-y divide-surface-border max-h-80 overflow-y-auto">
                  {MOCK_NOTIFICATIONS.map((n) => (
                    <div
                      key={n.id}
                      className={cn(
                        "flex items-start gap-3 px-4 py-3 hover:bg-surface-secondary cursor-pointer transition-colors",
                        !n.isRead && "bg-brand-50/50"
                      )}
                    >
                      <span className="text-base mt-0.5">{notifTypeIcon(n.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xs font-medium text-gray-900">{n.title}</span>
                          <span className="text-[10px] text-gray-400 flex-shrink-0">{timeAgo(n.createdAt)}</span>
                        </div>
                        <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                      </div>
                      {!n.isRead && (
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-500 mt-1.5 flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </div>
                <div className="px-4 py-2.5 border-t border-surface-border">
                  <button className="text-xs text-brand-600 hover:text-brand-700 font-medium">
                    Mark all as read
                  </button>
                </div>
              </div>
            </>
          )}
        </div>

        {/* Avatar */}
        <div className="flex items-center gap-2 pl-1 cursor-pointer group">
          <div className="w-8 h-8 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
            {user?.initials ?? "??"}
          </div>
          <div className="hidden md:block">
            <div className="text-xs font-medium text-gray-900 leading-none">{user?.name}</div>
            <div className="text-[10px] text-gray-400 mt-0.5">{user?.role}</div>
          </div>
        </div>
      </div>
    </header>
  )
}