import { useState } from "react"
import {
  X, AlertTriangle, Monitor, Link2,
  Paperclip, Send, ChevronRight, RotateCcw,
  CheckCircle2, User, Clock
} from "lucide-react"
import { cn } from "../../lib/utils"
import type { Bug } from "../../types"

const SEVERITY_CONFIG = {
  Critical: { badge: "bg-red-100 text-red-800 border border-red-200",     dot: "bg-red-600"    },
  High:     { badge: "bg-amber-100 text-amber-800 border border-amber-200", dot: "bg-amber-500"  },
  Medium:   { badge: "bg-yellow-100 text-yellow-800 border border-yellow-200", dot: "bg-yellow-500" },
  Low:      { badge: "bg-green-100 text-green-800 border border-green-200",  dot: "bg-green-500"  },
}

const STATUS_CONFIG = {
  New:        { badge: "bg-gray-100 text-gray-700 border border-gray-200",        label: "New",         icon: "○" },
  Assigned:   { badge: "bg-blue-100 text-blue-800 border border-blue-200",        label: "Assigned",    icon: "→" },
  InProgress: { badge: "bg-amber-100 text-amber-800 border border-amber-200",     label: "In progress", icon: "◑" },
  Fixed:      { badge: "bg-purple-100 text-purple-800 border border-purple-200",  label: "Fixed",       icon: "✓" },
  Verified:   { badge: "bg-green-100 text-green-800 border border-green-200",     label: "Verified",    icon: "✓✓" },
  Closed:     { badge: "bg-gray-100 text-gray-500 border border-gray-200",        label: "Closed",      icon: "×" },
}

const MOCK_BUG_COMMENTS = [
  { id: "1", author: { name: "Priya QA", initials: "PQ", color: "bg-green-100 text-green-700" }, text: "Reproduced on Stripe test mode. Happens consistently when using card 4000000000000002 and retrying.", time: "Mar 15, 10:30" },
  { id: "2", author: { name: "Rajan DL", initials: "RK", color: "bg-amber-100 text-amber-700" }, text: "Assigning to John — this is in the payment service. Looks like the idempotency key isn't being passed correctly on retry.", time: "Mar 15, 11:00" },
  { id: "3", author: { name: "John Dev", initials: "JD", color: "bg-brand-100 text-brand-700" }, text: "Found the issue — the retry handler creates a new PaymentIntent instead of reusing the existing one. Fix in progress.", time: "Mar 16, 09:15" },
]

interface BugDetailPanelProps {
  bug: Bug | null
  onClose: () => void
}

export default function BugDetailPanel({ bug, onClose }: BugDetailPanelProps) {
  const [comment, setComment] = useState("")
  const [activeTab, setActiveTab] = useState<"details" | "steps" | "activity">("details")

  if (!bug) return null

  const severity = SEVERITY_CONFIG[bug.severity]
  const status = STATUS_CONFIG[bug.status]

  const timeAgo = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime()
    const days = Math.floor(diff / 86400000)
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    return `${days} days ago`
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/20 z-30 lg:hidden" onClick={onClose} />
      <div className="fixed right-0 top-0 h-full w-full max-w-[500px] bg-white border-l border-surface-border shadow-modal z-40 flex flex-col animate-slide-in-right">

        {/* Header */}
        <div className="flex items-center gap-3 px-5 py-3.5 border-b border-surface-border flex-shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono text-gray-400">{bug.bugId}</span>
            <span className={cn("badge text-[10px]", severity.badge)}>{bug.severity}</span>
            <span className={cn("badge text-[10px]", status.badge)}>{status.label}</span>
          </div>
          <button onClick={onClose} className="ml-auto btn-ghost p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          <div className="px-5 py-4 space-y-5">

            {/* Title */}
            <div className="flex items-start gap-2">
              <AlertTriangle className={cn("w-4 h-4 mt-0.5 flex-shrink-0",
                bug.severity === "Critical" || bug.severity === "High" ? "text-red-500" : "text-amber-500"
              )} />
              <h2 className="text-base font-semibold text-gray-900 leading-snug">{bug.title}</h2>
            </div>

            {/* Meta grid */}
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              {[
                {
                  label: "Assigned to",
                  value: bug.assignee ? (
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 text-[9px] font-semibold flex items-center justify-center">
                        {bug.assignee.initials}
                      </div>
                      <span className="text-xs text-gray-700">{bug.assignee.name}</span>
                    </div>
                  ) : (
                    <span className="text-xs text-red-500 font-medium">Unassigned</span>
                  )
                },
                {
                  label: "Reported by",
                  value: (
                    <div className="flex items-center gap-1.5">
                      <div className="w-5 h-5 rounded-full bg-green-100 text-green-700 text-[9px] font-semibold flex items-center justify-center">
                        {bug.reporter.initials}
                      </div>
                      <span className="text-xs text-gray-700">{bug.reporter.name}</span>
                    </div>
                  )
                },
                {
                  label: "Reported",
                  value: <span className="text-xs text-gray-700">{timeAgo(bug.createdAt)}</span>
                },
                {
                  label: "Last updated",
                  value: <span className="text-xs text-gray-700">{timeAgo(bug.updatedAt)}</span>
                },
                bug.relatedTaskId ? {
                  label: "Related task",
                  value: (
                    <div className="flex items-center gap-1 text-xs text-brand-600 cursor-pointer hover:text-brand-700">
                      <Link2 className="w-3 h-3" />
                      {bug.relatedTaskId}
                    </div>
                  )
                } : null,
                bug.environment ? {
                  label: "Environment",
                  value: (
                    <div className="flex items-center gap-1 text-xs text-gray-700">
                      <Monitor className="w-3 h-3 text-gray-400" />
                      {bug.environment}
                    </div>
                  )
                } : null,
              ].filter(Boolean).map((item) => item && (
                <div key={item.label} className="space-y-1">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">{item.label}</div>
                  <div>{item.value}</div>
                </div>
              ))}
            </div>

            {/* Attachments */}
            {bug.attachments.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium flex items-center gap-1">
                  <Paperclip className="w-3 h-3" /> Attachments ({bug.attachments.length})
                </div>
                <div className="flex flex-wrap gap-2">
                  {bug.attachments.map((file) => (
                    <div key={file} className="flex items-center gap-1.5 px-2.5 py-1.5 bg-surface-secondary border border-surface-border rounded-lg text-xs text-gray-600 cursor-pointer hover:border-surface-border-strong transition-colors">
                      <Paperclip className="w-3 h-3 text-gray-400" />
                      {file}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tabs */}
            <div className="border-t border-surface-border pt-4">
              <div className="flex gap-1 mb-4">
                {(["details", "steps", "activity"] as const).map((tab) => (
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

              {/* Details tab */}
              {activeTab === "details" && (
                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Description</div>
                    <p className="text-sm text-gray-600 leading-relaxed bg-surface-secondary rounded-lg p-3">{bug.description}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3 text-green-500" /> Expected
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed bg-green-50 border border-green-100 rounded-lg p-2.5">{bug.expectedBehavior}</p>
                    </div>
                    <div className="space-y-1.5">
                      <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium flex items-center gap-1">
                        <AlertTriangle className="w-3 h-3 text-red-500" /> Actual
                      </div>
                      <p className="text-xs text-gray-600 leading-relaxed bg-red-50 border border-red-100 rounded-lg p-2.5">{bug.actualBehavior}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Steps tab */}
              {activeTab === "steps" && (
                <div className="space-y-1.5">
                  <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Steps to reproduce</div>
                  <div className="bg-surface-secondary border border-surface-border rounded-lg p-3">
                    {bug.stepsToReproduce.split("\n").map((step, i) => (
                      <div key={i} className="flex items-start gap-2.5 py-1.5 border-b border-surface-border last:border-0">
                        <span className="w-5 h-5 rounded-full bg-surface-border text-gray-500 text-[10px] font-mono flex items-center justify-center flex-shrink-0 mt-0.5">
                          {i + 1}
                        </span>
                        <span className="text-xs text-gray-700 leading-relaxed">
                          {step.replace(/^\d+\.\s*/, "")}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Activity tab */}
              {activeTab === "activity" && (
                <div className="space-y-3">
                  {MOCK_BUG_COMMENTS.map((c) => (
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

            {/* Action buttons based on status */}
            <div className="border-t border-surface-border pt-4 space-y-2">
              <div className="text-[10px] text-gray-400 uppercase tracking-wider font-medium mb-2">Actions</div>
              <div className="flex flex-wrap gap-2">
                {bug.status === "New" && (
                  <button className="btn-primary btn-sm gap-1.5">
                    <User className="w-3.5 h-3.5" /> Assign to developer
                  </button>
                )}
                {bug.status === "Assigned" && (
                  <button className="btn-primary btn-sm gap-1.5">
                    <ChevronRight className="w-3.5 h-3.5" /> Start working
                  </button>
                )}
                {bug.status === "InProgress" && (
                  <button className="btn-primary btn-sm gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Mark as fixed
                  </button>
                )}
                {bug.status === "Fixed" && (
                  <>
                    <button className="btn-primary btn-sm gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Verify fix
                    </button>
                    <button className="btn-secondary btn-sm gap-1.5">
                      <RotateCcw className="w-3.5 h-3.5" /> Reject — reopen
                    </button>
                  </>
                )}
                {bug.status === "Verified" && (
                  <button className="btn-primary btn-sm gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Close bug
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Comment input */}
        <div className="border-t border-surface-border px-5 py-3 flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 text-[10px] font-semibold flex items-center justify-center flex-shrink-0">
              JD
            </div>
            <div className="flex-1 flex items-center gap-2 bg-surface-secondary border border-surface-border rounded-xl px-3 py-2">
              <input
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Add a comment..."
                className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
              />
              <button disabled={!comment.trim()} className="text-brand-600 disabled:text-gray-300 transition-colors">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}