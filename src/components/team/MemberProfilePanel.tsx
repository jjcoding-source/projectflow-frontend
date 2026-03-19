import { useState } from "react"
import {
  X, Mail, Calendar, Clock, CheckCircle2,
  Bug, Briefcase, TrendingUp, Send, MoreHorizontal,
  UserMinus, Shield, FolderKanban
} from "lucide-react"
import { cn } from "../../lib/utils"
import { ROLE_LABELS, ROLE_BADGE, type TeamMember } from "../../data/mockTeam"

const MOCK_RECENT_TASKS = [
  { id: "EC-079", title: "JWT refresh token logic",         status: "InProgress", priority: "Critical" },
  { id: "EC-081", title: "Fix Kanban drag-drop iOS Safari", status: "Todo",       priority: "High"     },
  { id: "EC-071", title: "Setup EF Core migrations",        status: "Done",       priority: "High"     },
  { id: "AG-019", title: "Rate limiting middleware",         status: "Todo",       priority: "Medium"   },
]

const STATUS_STYLES: Record<string, string> = {
  InProgress: "bg-amber-100 text-amber-800",
  Todo:       "bg-blue-100 text-blue-800",
  Done:       "bg-green-100 text-green-800",
  InReview:   "bg-purple-100 text-purple-800",
  Blocked:    "bg-red-100 text-red-800",
}

const PRIORITY_DOT: Record<string, string> = {
  Critical: "bg-red-500",
  High:     "bg-amber-500",
  Medium:   "bg-blue-500",
  Low:      "bg-gray-400",
}

interface MemberProfilePanelProps {
  member: TeamMember | null
  onClose: () => void
}

export default function MemberProfilePanel({ member, onClose }: MemberProfilePanelProps) {
  const [message, setMessage] = useState("")
  const [activeTab, setActiveTab] = useState<"overview" | "tasks" | "message">("overview")
  const [menuOpen, setMenuOpen] = useState(false)

  if (!member) return null

  const completionRate = member.tasksCompleted + member.tasksOpen > 0
    ? Math.round((member.tasksCompleted / (member.tasksCompleted + member.tasksOpen)) * 100)
    : 0

  const timeAgo = (iso: string) => {
    if (!iso) return "Never"
    const diff = Date.now() - new Date(iso).getTime()
    const mins = Math.floor(diff / 60000)
    if (mins < 60) return `${mins}m ago`
    const hrs = Math.floor(mins / 60)
    if (hrs < 24) return `${hrs}h ago`
    return `${Math.floor(hrs / 24)}d ago`
  }

  const joinedDate = (iso: string) =>
    new Date(iso).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-[440px] bg-white border-l border-surface-border shadow-modal z-40 flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-surface-border flex-shrink-0">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Member profile</span>
          <div className="flex items-center gap-1">
            {/* Actions menu */}
            <div className="relative">
              <button
                onClick={() => setMenuOpen(!menuOpen)}
                className="btn-ghost p-1.5 rounded-lg"
              >
                <MoreHorizontal className="w-4 h-4" />
              </button>
              {menuOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                  <div className="absolute right-0 top-full mt-1 w-44 bg-white rounded-xl border border-surface-border shadow-modal py-1.5 z-20 animate-slide-up">
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-surface-secondary">
                      <Shield className="w-4 h-4 text-gray-400" /> Change role
                    </button>
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-gray-700 hover:bg-surface-secondary">
                      <FolderKanban className="w-4 h-4 text-gray-400" /> Manage projects
                    </button>
                    <div className="h-px bg-surface-border my-1" />
                    <button className="flex items-center gap-2.5 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                      <UserMinus className="w-4 h-4" /> Remove from org
                    </button>
                  </div>
                </>
              )}
            </div>
            <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">

          {/* Profile hero */}
          <div className="px-5 py-5 border-b border-surface-border">
            <div className="flex items-start gap-4">
              <div className="relative flex-shrink-0">
                <div className={cn(
                  "w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-semibold",
                  member.avatarColor
                )}>
                  {member.initials}
                </div>
                {/* Online indicator */}
                <span className={cn(
                  "absolute bottom-0.5 right-0.5 w-3.5 h-3.5 rounded-full border-2 border-white",
                  member.isOnline ? "bg-brand-500" : "bg-gray-300"
                )} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h2 className="text-base font-semibold text-gray-900">{member.name}</h2>
                    <p className="text-xs text-gray-500 mt-0.5">{member.jobTitle}</p>
                  </div>
                  {member.status === "invited" && (
                    <span className="badge bg-amber-100 text-amber-700 border border-amber-200 text-[10px] flex-shrink-0">
                      Invite pending
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2 mt-2.5 flex-wrap">
                  <span className={cn("badge text-[10px]", ROLE_BADGE[member.role])}>
                    {ROLE_LABELS[member.role]}
                  </span>
                  <span className={cn(
                    "text-[10px] font-medium",
                    member.isOnline ? "text-brand-600" : "text-gray-400"
                  )}>
                    {member.isOnline ? "● Online now" : `Last seen ${timeAgo(member.lastActive)}`}
                  </span>
                </div>
              </div>
            </div>

            {/* Quick info row */}
            <div className="grid grid-cols-3 gap-3 mt-4">
              {[
                { icon: Mail,     label: "Email",    value: member.email.split("@")[0] + "@..." },
                { icon: Calendar, label: "Joined",   value: joinedDate(member.joinedAt) },
                { icon: Clock,    label: "Last seen", value: member.isOnline ? "Now" : timeAgo(member.lastActive) },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="bg-surface-secondary rounded-xl p-2.5 space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400">
                    <Icon className="w-3 h-3" /> {label}
                  </div>
                  <p className="text-xs font-medium text-gray-700 truncate">{value}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="px-5 py-3 border-b border-surface-border">
            <div className="flex gap-1">
              {(["overview", "tasks", "message"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    "px-3 py-1.5 rounded-lg text-xs font-medium capitalize transition-all",
                    activeTab === tab
                      ? "bg-surface-tertiary text-gray-900"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  {tab}
                </button>
              ))}
            </div>
          </div>

          <div className="px-5 py-4 space-y-5">

            {/* Overview tab */}
            {activeTab === "overview" && (
              <>
                {/* Stats */}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-3">
                    Performance — current sprint
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { icon: CheckCircle2, label: "Tasks completed", value: member.tasksCompleted, color: "text-brand-600", bg: "bg-brand-50" },
                      { icon: Briefcase,    label: "Tasks open",       value: member.tasksOpen,      color: "text-amber-600", bg: "bg-amber-50" },
                      { icon: Bug,          label: "Bugs reported",    value: member.bugsReported,   color: "text-red-500",   bg: "bg-red-50"   },
                      { icon: TrendingUp,   label: "On-time rate",     value: `${member.onTimeRate}%`, color: member.onTimeRate >= 90 ? "text-brand-600" : "text-amber-600", bg: member.onTimeRate >= 90 ? "bg-brand-50" : "bg-amber-50" },
                    ].map(({ icon: Icon, label, value, color, bg }) => (
                      <div key={label} className="card p-3.5">
                        <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center mb-2", bg, color)}>
                          <Icon className="w-3.5 h-3.5" />
                        </div>
                        <p className="text-lg font-semibold text-gray-900">{value}</p>
                        <p className="text-[10px] text-gray-500 mt-0.5">{label}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Completion bar */}
                {member.status !== "invited" && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-gray-500">Overall completion rate</span>
                      <span className="font-semibold text-gray-900">{completionRate}%</span>
                    </div>
                    <div className="h-2 bg-surface-tertiary rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-700",
                          completionRate >= 90 ? "bg-brand-500"
                          : completionRate >= 75 ? "bg-amber-500"
                          : "bg-red-500"
                        )}
                        style={{ width: `${completionRate}%` }}
                      />
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {member.tasksCompleted} completed · {member.tasksOpen} open
                    </p>
                  </div>
                )}

                {/* Projects */}
                <div>
                  <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-2">
                    Active projects ({member.projects.length})
                  </p>
                  <div className="space-y-1.5">
                    {member.projects.map((proj, i) => {
                      const colors = ["#378ADD", "#1D9E75", "#D85A30", "#7F77DD"]
                      return (
                        <div key={proj} className="flex items-center gap-2.5 py-2 px-3 bg-surface-secondary rounded-xl">
                          <span
                            className="w-2 h-2 rounded-full flex-shrink-0"
                            style={{ background: colors[i % colors.length] }}
                          />
                          <span className="text-sm text-gray-700 flex-1">{proj}</span>
                          <FolderKanban className="w-3.5 h-3.5 text-gray-300" />
                        </div>
                      )
                    })}
                  </div>
                </div>
              </>
            )}

            {/* Tasks tab */}
            {activeTab === "tasks" && (
              <div className="space-y-2">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Recent tasks
                </p>
                {MOCK_RECENT_TASKS.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-xl border border-surface-border hover:border-surface-border-strong transition-colors cursor-pointer"
                  >
                    <span className={cn("w-2 h-2 rounded-full flex-shrink-0", PRIORITY_DOT[task.priority])} />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{task.title}</p>
                      <p className="text-xs font-mono text-gray-400 mt-0.5">{task.id}</p>
                    </div>
                    <span className={cn("badge text-[10px]", STATUS_STYLES[task.status] ?? "bg-gray-100 text-gray-600")}>
                      {task.status.replace(/([A-Z])/g, " $1").trim()}
                    </span>
                  </div>
                ))}
              </div>
            )}

            {/* Message tab */}
            {activeTab === "message" && (
              <div className="space-y-3">
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                  Send a direct message
                </p>
                <div className="bg-surface-secondary rounded-xl p-3 text-xs text-gray-500 leading-relaxed">
                  Messages are delivered as in-app notifications and optionally via email based on the recipient's preferences.
                </div>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder={`Message ${member.name.split(" ")[0]}...`}
                  rows={5}
                  className="input resize-none text-sm"
                />
                <button
                  disabled={!message.trim()}
                  className="btn-primary w-full gap-2"
                >
                  <Send className="w-4 h-4" /> Send message
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}