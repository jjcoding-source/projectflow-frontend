import { ArrowRight, TrendingUp, TrendingDown, Clock, CheckCircle2, Bug, Zap, AlertTriangle } from "lucide-react"
import { Link } from "react-router-dom"
import { useAuthStore } from "../store/authStore"
import { cn } from "../lib/utils"
import type { Task, Project } from "../types"

const MOCK_TASKS: Task[] = [
  { id: "1", taskId: "EC-079", title: "Implement JWT refresh token logic", status: "InProgress", priority: "Critical", tags: ["backend", "auth"], subtasks: [], attachmentCount: 2, commentCount: 4, createdAt: "", updatedAt: "", projectId: "1", dueDate: "2025-03-17", reporter: { id: "2", name: "Sarah PM", email: "", initials: "SP", role: "ProjectManager" } },
  { id: "2", taskId: "EC-081", title: "Fix Kanban drag-drop on mobile Safari", status: "Todo", priority: "High", tags: ["frontend", "bug"], subtasks: [], attachmentCount: 1, commentCount: 2, createdAt: "", updatedAt: "", projectId: "1", dueDate: "2025-03-19", reporter: { id: "3", name: "Priya QA", email: "", initials: "PQ", role: "Tester" } },
  { id: "3", taskId: "MA-042", title: "Push notification setup for iOS", status: "InReview", priority: "High", tags: ["mobile"], subtasks: [], attachmentCount: 0, commentCount: 1, createdAt: "", updatedAt: "", projectId: "2", dueDate: "2025-03-22", reporter: { id: "2", name: "Sarah PM", email: "", initials: "SP", role: "ProjectManager" } },
  { id: "4", taskId: "AG-019", title: "Rate limiting middleware for /api/auth", status: "Todo", priority: "Medium", tags: ["backend"], subtasks: [], attachmentCount: 0, commentCount: 0, createdAt: "", updatedAt: "", projectId: "3", dueDate: "2025-03-24", reporter: { id: "2", name: "Sarah PM", email: "", initials: "SP", role: "ProjectManager" } },
  { id: "5", taskId: "EC-065", title: "Write unit tests for CartService", status: "Done", priority: "Medium", tags: ["testing"], subtasks: [], attachmentCount: 0, commentCount: 3, createdAt: "", updatedAt: "", projectId: "1", reporter: { id: "2", name: "Sarah PM", email: "", initials: "SP", role: "ProjectManager" } },
]

const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "E-Commerce Revamp", key: "EC", color: "#378ADD", status: "Active", visibility: "Private", progress: 72, memberCount: 6, createdAt: "", managerId: "1", description: "" },
  { id: "2", name: "Mobile App v2", key: "MA", color: "#1D9E75", status: "Active", visibility: "Private", progress: 45, memberCount: 4, createdAt: "", managerId: "1", description: "" },
  { id: "3", name: "API Gateway", key: "AG", color: "#D85A30", status: "Active", visibility: "Private", progress: 88, memberCount: 3, createdAt: "", managerId: "1", description: "" },
  { id: "4", name: "Design System", key: "DS", color: "#7F77DD", status: "Active", visibility: "Private", progress: 31, memberCount: 2, createdAt: "", managerId: "1", description: "" },
]

const PRIORITY_CONFIG = {
  Critical: { class: "badge-red", dot: "bg-red-500" },
  High: { class: "badge-amber", dot: "bg-amber-500" },
  Medium: { class: "badge-blue", dot: "bg-blue-500" },
  Low: { class: "badge-gray", dot: "bg-gray-400" },
}

const STATUS_CONFIG = {
  Backlog: { label: "Backlog", class: "badge-gray" },
  Todo: { label: "To do", class: "badge-blue" },
  InProgress: { label: "In progress", class: "badge-amber" },
  InReview: { label: "In review", class: "badge-purple" },
  Done: { label: "Done", class: "badge-green" },
  Blocked: { label: "Blocked", class: "badge-red" },
  Cancelled: { label: "Cancelled", class: "badge-gray" },
}

function StatCard({
  label,
  value,
  trend,
  trendLabel,
  icon: Icon,
  iconClass,
}: {
  label: string
  value: string | number
  trend?: "up" | "down" | "neutral"
  trendLabel?: string
  icon: React.ElementType
  iconClass: string
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", iconClass)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {trendLabel && (
        <div className={cn("flex items-center gap-1 mt-1.5 text-xs", trend === "up" ? "text-brand-600" : trend === "down" ? "text-red-500" : "text-gray-400")}>
          {trend === "up" ? <TrendingUp className="w-3 h-3" /> : trend === "down" ? <TrendingDown className="w-3 h-3" /> : null}
          {trendLabel}
        </div>
      )}
    </div>
  )
}

function getGreeting() {
  const h = new Date().getHours()
  if (h < 12) return "Good morning"
  if (h < 17) return "Good afternoon"
  return "Good evening"
}

export default function DashboardPage() {
  const user = useAuthStore((s) => s.user)
  const openTasks = MOCK_TASKS.filter((t) => t.status !== "Done" && t.status !== "Cancelled")
  const doneTasks = MOCK_TASKS.filter((t) => t.status === "Done")
  const overdueTasks = openTasks.filter((t) => t.dueDate && new Date(t.dueDate) < new Date())

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          {getGreeting()}, {user?.name?.split(" ")[0]} 👋
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          You have{" "}
          <span className="font-medium text-gray-900">{openTasks.length} open tasks</span>
          {overdueTasks.length > 0 && (
            <> · <span className="text-red-600 font-medium">{overdueTasks.length} overdue</span></>
          )}
          {" "}· Sprint 14 ends in 3 days
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="My open tasks" value={openTasks.length} trend="neutral" trendLabel={`${overdueTasks.length} overdue`} icon={Clock} iconClass="bg-blue-50 text-blue-600" />
        <StatCard label="Completed this week" value={doneTasks.length} trend="up" trendLabel="+2 vs last week" icon={CheckCircle2} iconClass="bg-brand-50 text-brand-600" />
        <StatCard label="Bugs assigned" value={3} trend="down" trendLabel="2 critical" icon={Bug} iconClass="bg-red-50 text-red-600" />
        <StatCard label="Sprint velocity" value="68%" trend="up" trendLabel="Sprint 14" icon={Zap} iconClass="bg-amber-50 text-amber-600" />
      </div>

      {/* Main content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* My tasks */}
        <div className="lg:col-span-2 card">
          <div className="flex items-center justify-between p-5 border-b border-surface-border">
            <h2 className="font-semibold text-gray-900">My tasks</h2>
            <Link to="/my-tasks" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-surface-border">
            {MOCK_TASKS.map((task) => (
              <div
                key={task.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-surface-secondary transition-colors cursor-pointer group"
              >
                {/* Status indicator */}
                <div className={cn(
                  "w-4 h-4 rounded border-2 flex-shrink-0 transition-colors",
                  task.status === "Done"
                    ? "bg-brand-500 border-brand-500"
                    : task.status === "InProgress"
                    ? "border-amber-400"
                    : task.status === "Blocked"
                    ? "border-red-400"
                    : "border-surface-border-strong group-hover:border-brand-400"
                )}>
                  {task.status === "Done" && (
                    <svg className="w-full h-full text-white p-0.5" fill="none" viewBox="0 0 12 12">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "text-sm font-medium truncate",
                      task.status === "Done" ? "line-through text-gray-400" : "text-gray-900"
                    )}>
                      {task.title}
                    </span>
                    {task.status === "Blocked" && (
                      <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-xs font-mono text-gray-400">{task.taskId}</span>
                    {task.dueDate && (
                      <span className={cn(
                        "text-xs",
                        new Date(task.dueDate) < new Date() && task.status !== "Done"
                          ? "text-red-500 font-medium"
                          : "text-gray-400"
                      )}>
                        {new Date(task.dueDate) < new Date() && task.status !== "Done" ? "Overdue · " : "Due "}
                        {new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={cn("badge text-[10px]", STATUS_CONFIG[task.status].class)}>
                    {STATUS_CONFIG[task.status].label}
                  </span>
                  <span className={cn("badge text-[10px]", PRIORITY_CONFIG[task.priority].class)}>
                    {task.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Project progress */}
        <div className="card">
          <div className="flex items-center justify-between p-5 border-b border-surface-border">
            <h2 className="font-semibold text-gray-900">Projects</h2>
            <Link to="/projects" className="text-xs text-brand-600 hover:text-brand-700 flex items-center gap-1 font-medium">
              All <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="divide-y divide-surface-border">
            {MOCK_PROJECTS.map((project) => (
              <Link
                key={project.id}
                to={`/projects/${project.id}`}
                className="flex flex-col gap-2 px-5 py-4 hover:bg-surface-secondary transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: project.color }} />
                  <span className="text-sm font-medium text-gray-900 flex-1 truncate">{project.name}</span>
                  <span className="text-xs text-gray-500">{project.progress}%</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${project.progress}%`, background: project.color }}
                    />
                  </div>
                </div>
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span>{project.memberCount} members</span>
                  <span className={cn("badge text-[10px]", project.status === "Active" ? "badge-green" : "badge-gray")}>
                    {project.status}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}