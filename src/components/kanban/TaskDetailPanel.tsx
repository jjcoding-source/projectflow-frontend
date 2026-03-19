import { useState } from "react"
import {
  X, Clock, Paperclip, MessageSquare, CheckSquare,
  Calendar, User, Tag, Flag, ChevronRight, Send,
  ExternalLink, Edit2, Check, AlertTriangle
} from "lucide-react"
import { cn } from "../../lib/utils"
import type { Task } from "../../types"

const PRIORITY_CONFIG = {
  Critical: { class: "badge-red",   label: "Critical" },
  High:     { class: "badge-amber", label: "High"     },
  Medium:   { class: "badge-blue",  label: "Medium"   },
  Low:      { class: "badge-gray",  label: "Low"      },
}

const STATUS_CONFIG = {
  Backlog:    { class: "badge-gray",   label: "Backlog"     },
  Todo:       { class: "badge-blue",   label: "To do"       },
  InProgress: { class: "badge-amber",  label: "In progress" },
  InReview:   { class: "badge-purple", label: "In review"   },
  Done:       { class: "badge-green",  label: "Done"        },
  Blocked:    { class: "badge-red",    label: "Blocked"     },
  Cancelled:  { class: "badge-gray",   label: "Cancelled"   },
}

const MOCK_COMMENTS = [
  { id: "c1", author: { name: "Rajan DL", initials: "RK", color: "bg-amber-100 text-amber-700" }, text: "PR looks solid — just needs the token rotation test cases before we merge.", time: "2 hours ago" },
  { id: "c2", author: { name: "John Dev", initials: "JD", color: "bg-brand-100 text-brand-700" }, text: "Added rotation logic. Will add tests today and re-request review.", time: "1 hour ago" },
]

interface TaskDetailPanelProps {
  task: Task | null
  onClose: () => void
}

export default function TaskDetailPanel({ task, onClose }: TaskDetailPanelProps) {
  const [comment, setComment] = useState("")
  const [subtasks, setSubtasks] = useState(task?.subtasks ?? [])
  const [activeTab, setActiveTab] = useState<"details" | "activity">("details")

  if (!task) return null

  const completedCount = subtasks.filter((s) => s.isCompleted).length

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((s) => s.id === id ? { ...s, isCompleted: !s.isCompleted } : s)
    )
  }

  const progressPct = subtasks.length > 0
    ? Math.round((completedCount / subtasks.length) * 100)
    : 0

  return (
    <>
      {/* Backdrop on mobile */}
      <div
        className="fixed inset-0 bg-black/20 z-30 lg:hidden"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed right-0 top-0 h-full w-full max-w-[480px] bg-white border-l border-surface-border shadow-modal z-40 flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-surface-border flex-shrink-0">
          <span className="text-xs font-mono text-gray-400">{task.taskId}</span>
          <span className={cn("badge text-[10px]", STATUS_CONFIG[task.status].class)}>
            {STATUS_CONFIG[task.status].label}
          </span>
          <div className="ml-auto flex items-center gap-1">
            <button className="btn-ghost p-1.5 rounded-lg text-xs flex items-center gap-1">
              <ExternalLink className="w-3.5 h-3.5" />
              <span className="hidden sm:block text-xs">Open full</span>
            </button>
            <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-5">

            {/* Title */}
            <h2 className="text-base font-semibold text-gray-900 leading-snug">
              {task.title}
            </h2>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                {
                  icon: Flag, label: "Priority",
                  value: <span className={cn("badge text-[10px]", PRIORITY_CONFIG[task.priority].class)}>{task.priority}</span>
                },
                {
                  icon: User, label: "Assignee",
                  value: task.assignee ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[9px] font-semibold flex items-center justify-center">{task.assignee.initials}</div>
                      <span className="text-xs text-gray-700">{task.assignee.name}</span>
                    </div>
                  ) : <span className="text-xs text-gray-400">Unassigned</span>
                },
                {
                  icon: Calendar, label: "Due date",
                  value: task.dueDate ? (
                    <span className={cn("text-xs", new Date(task.dueDate) < new Date() && task.status !== "Done" ? "text-red-600 font-medium" : "text-gray-700")}>
                      {new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}
                    </span>
                  ) : <span className="text-xs text-gray-400">No due date</span>
                },
                {
                  icon: Tag, label: "Story points",
                  value: <span className="text-xs font-mono text-gray-700">{task.storyPoints ?? "—"} pts</span>
                },
                {
                  icon: User, label: "Reporter",
                  value: (
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-red-100 text-red-700 text-[9px] font-semibold flex items-center justify-center">{task.reporter.initials}</div>
                      <span className="text-xs text-gray-700">{task.reporter.name}</span>
                    </div>
                  )
                },
                {
                  icon: Clock, label: "Time logged",
                  value: (
                    <div className="flex items-center gap-1">
                      <span className="text-xs text-gray-700">{task.loggedHours ?? 0}h</span>
                      {task.estimatedHours && <span className="text-xs text-gray-400">/ {task.estimatedHours}h est.</span>}
                    </div>
                  )
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label} className="space-y-1">
                  <div className="flex items-center gap-1 text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                    <Icon className="w-3 h-3" />
                    {label}
                  </div>
                  <div>{value}</div>
                </div>
              ))}
            </div>

            {/* Time progress bar */}
            {task.estimatedHours && task.loggedHours !== undefined && (
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-gray-400">
                  <span>Time progress</span>
                  <span>{Math.round(((task.loggedHours ?? 0) / task.estimatedHours) * 100)}%</span>
                </div>
                <div className="h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
                  <div
                    className={cn(
                      "h-full rounded-full transition-all",
                      (task.loggedHours ?? 0) > task.estimatedHours ? "bg-red-500" : "bg-brand-500"
                    )}
                    style={{ width: `${Math.min(((task.loggedHours ?? 0) / task.estimatedHours) * 100, 100)}%` }}
                  />
                </div>
              </div>
            )}

            {/* Tags */}
            {task.tags.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Tags</div>
                <div className="flex flex-wrap gap-1.5">
                  {task.tags.map((tag) => (
                    <span key={tag} className="text-xs px-2 py-0.5 bg-surface-tertiary text-gray-600 rounded-md">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {task.description && (
              <div className="space-y-1.5">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Description</div>
                <p className="text-sm text-gray-600 leading-relaxed bg-surface-secondary rounded-lg p-3">
                  {task.description}
                </p>
              </div>
            )}

            {/* Subtasks */}
            {subtasks.length > 0 && (
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 uppercase tracking-wider font-medium">
                    <CheckSquare className="w-3 h-3" />
                    Subtasks ({completedCount}/{subtasks.length})
                  </div>
                  <span className="text-[10px] text-gray-400">{progressPct}%</span>
                </div>
                <div className="h-1 bg-surface-tertiary rounded-full overflow-hidden">
                  <div
                    className="h-full bg-brand-500 rounded-full transition-all"
                    style={{ width: `${progressPct}%` }}
                  />
                </div>
                <div className="space-y-1">
                  {subtasks.map((sub) => (
                    <button
                      key={sub.id}
                      onClick={() => toggleSubtask(sub.id)}
                      className="flex items-center gap-2.5 w-full text-left py-1.5 px-2 rounded-lg hover:bg-surface-secondary transition-colors group"
                    >
                      <div className={cn(
                        "w-4 h-4 rounded border-2 flex-shrink-0 flex items-center justify-center transition-all",
                        sub.isCompleted
                          ? "bg-brand-500 border-brand-500"
                          : "border-surface-border-strong group-hover:border-brand-400"
                      )}>
                        {sub.isCompleted && <Check className="w-2.5 h-2.5 text-white" />}
                      </div>
                      <span className={cn(
                        "text-sm flex-1",
                        sub.isCompleted ? "line-through text-gray-400" : "text-gray-700"
                      )}>
                        {sub.title}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="border-t border-surface-border pt-4">
              <div className="flex gap-1 mb-4">
                {(["details", "activity"] as const).map((tab) => (
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

              {activeTab === "activity" && (
                <div className="space-y-3">
                  {MOCK_COMMENTS.map((c) => (
                    <div key={c.id} className="flex gap-2.5">
                      <div className={cn("w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-semibold flex-shrink-0", c.author.color)}>
                        {c.author.initials}
                      </div>
                      <div className="flex-1">
                        <div className="bg-surface-secondary rounded-xl rounded-tl-none p-3">
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-xs font-semibold text-gray-900">{c.author.name}</span>
                            <span className="text-[10px] text-gray-400">{c.time}</span>
                          </div>
                          <p className="text-xs text-gray-600 leading-relaxed">{c.text}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="border-t border-surface-border px-5 py-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
              JD
            </div>
            <div className="flex-1 flex items-center gap-2 bg-surface-secondary border border-surface-border rounded-xl px-3 py-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment... @mention teammates"
                className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
              <button
                disabled={!comment.trim()}
                className="text-brand-600 disabled:text-gray-300 transition-colors"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}