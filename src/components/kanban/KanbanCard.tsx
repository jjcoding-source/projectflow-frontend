import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { MessageSquare, Paperclip, Clock, AlertTriangle, CheckSquare } from "lucide-react"
import { cn } from "../../lib/utils"
import type { Task } from "../../types"

const PRIORITY_STYLES: Record<string, { dot: string; badge: string; border: string }> = {
  Critical: { dot: "bg-red-500",    badge: "badge-red",    border: "border-l-red-500"    },
  High:     { dot: "bg-amber-500",  badge: "badge-amber",  border: "border-l-amber-500"  },
  Medium:   { dot: "bg-blue-500",   badge: "badge-blue",   border: "border-l-transparent" },
  Low:      { dot: "bg-gray-400",   badge: "badge-gray",   border: "border-l-transparent" },
}

const TAG_COLORS: Record<string, string> = {
  backend:     "bg-purple-50 text-purple-700",
  frontend:    "bg-blue-50 text-blue-700",
  auth:        "bg-red-50 text-red-700",
  security:    "bg-red-50 text-red-700",
  testing:     "bg-green-50 text-green-700",
  database:    "bg-amber-50 text-amber-700",
  mobile:      "bg-teal-50 text-teal-700",
  performance: "bg-orange-50 text-orange-700",
  design:      "bg-pink-50 text-pink-700",
  ui:          "bg-pink-50 text-pink-700",
  bug:         "bg-red-50 text-red-700",
}

interface KanbanCardProps {
  task: Task
  onClick: () => void
  isDragging?: boolean
}

export default function KanbanCard({ task, onClick, isDragging }: KanbanCardProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: task.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  const priority = PRIORITY_STYLES[task.priority]
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== "Done"
  const completedSubtasks = task.subtasks.filter((s) => s.isCompleted).length

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      onClick={onClick}
      className={cn(
        "card group cursor-grab active:cursor-grabbing select-none",
        "border-l-4 transition-all duration-150",
        "hover:shadow-card-hover hover:-translate-y-0.5",
        priority.border,
        (isSortableDragging || isDragging) && "opacity-50 shadow-modal scale-[1.02] rotate-1",
      )}
    >
      <div className="p-3 space-y-2.5">
        {/* Header row */}
        <div className="flex items-start justify-between gap-2">
          <p className={cn(
            "text-sm font-medium leading-snug flex-1",
            task.status === "Done" ? "line-through text-gray-400" : "text-gray-900"
          )}>
            {task.title}
          </p>
          {task.status === "Blocked" && (
            <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0 mt-0.5" />
          )}
        </div>

        {/* Tags */}
        {task.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {task.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className={cn(
                  "text-[10px] px-1.5 py-0.5 rounded font-medium",
                  TAG_COLORS[tag] ?? "bg-gray-100 text-gray-600"
                )}
              >
                {tag}
              </span>
            ))}
            {task.tags.length > 3 && (
              <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-gray-100 text-gray-500">
                +{task.tags.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Subtasks progress */}
        {task.subtasks.length > 0 && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <div className="flex items-center gap-1">
                <CheckSquare className="w-3 h-3" />
                <span>{completedSubtasks}/{task.subtasks.length}</span>
              </div>
              <span>{Math.round((completedSubtasks / task.subtasks.length) * 100)}%</span>
            </div>
            <div className="h-1 bg-surface-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all"
                style={{ width: `${(completedSubtasks / task.subtasks.length) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex items-center justify-between pt-1">
          <div className="flex items-center gap-2">
            {/* Story points */}
            {task.storyPoints && (
              <span className="text-[10px] font-medium bg-surface-tertiary text-gray-500 px-1.5 py-0.5 rounded font-mono">
                {task.storyPoints}pt
              </span>
            )}
            {/* Due date */}
            {task.dueDate && (
              <span className={cn(
                "text-[10px] flex items-center gap-0.5",
                isOverdue ? "text-red-500 font-medium" : "text-gray-400"
              )}>
                <Clock className="w-2.5 h-2.5" />
                {isOverdue ? "Overdue" : new Date(task.dueDate).toLocaleDateString("en-GB", { day: "numeric", month: "short" })}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* Meta counts */}
            <div className="flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
              {task.commentCount > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                  <MessageSquare className="w-2.5 h-2.5" />
                  {task.commentCount}
                </span>
              )}
              {task.attachmentCount > 0 && (
                <span className="flex items-center gap-0.5 text-[10px] text-gray-400">
                  <Paperclip className="w-2.5 h-2.5" />
                  {task.attachmentCount}
                </span>
              )}
            </div>

            {/* Assignee avatar */}
            {task.assignee ? (
              <div
                className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-[9px] font-semibold flex-shrink-0"
                title={task.assignee.name}
              >
                {task.assignee.initials}
              </div>
            ) : (
              <div
                className="w-6 h-6 rounded-full border-2 border-dashed border-surface-border flex items-center justify-center flex-shrink-0"
                title="Unassigned"
              />
            )}
          </div>
        </div>

        {/* Task ID */}
        <div className="text-[10px] font-mono text-gray-300 group-hover:text-gray-400 transition-colors">
          #{task.taskId}
        </div>
      </div>
    </div>
  )
}