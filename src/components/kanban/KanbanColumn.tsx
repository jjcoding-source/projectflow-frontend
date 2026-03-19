import { useDroppable } from "@dnd-kit/core"
import { SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable"
import { Plus } from "lucide-react"
import { cn } from "../../lib/utils"
import KanbanCard from "./KanbanCard"
import type { Task, TaskStatus } from "../../types"

interface ColumnConfig {
  id: TaskStatus
  title: string
  color: string
  dotColor: string
}

interface KanbanColumnProps {
  column: ColumnConfig
  tasks: Task[]
  onCardClick: (task: Task) => void
  isOver?: boolean
}

export default function KanbanColumn({ column, tasks, onCardClick, isOver }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: column.id })

  return (
    <div className="flex flex-col w-[260px] flex-shrink-0">
      {/* Column header */}
      <div className="flex items-center gap-2 mb-3 px-1">
        <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: column.dotColor }} />
        <span className="text-sm font-semibold text-gray-700">{column.title}</span>
        <span className="ml-auto text-xs font-medium text-gray-400 bg-surface-tertiary px-1.5 py-0.5 rounded-md min-w-[20px] text-center">
          {tasks.length}
        </span>
      </div>

      {/* Drop zone */}
      <SortableContext items={tasks.map((t) => t.id)} strategy={verticalListSortingStrategy}>
        <div
          ref={setNodeRef}
          className={cn(
            "flex flex-col gap-2.5 flex-1 min-h-[120px] p-2 rounded-xl transition-all duration-150",
            isOver
              ? "bg-brand-50 border-2 border-dashed border-brand-300"
              : "bg-surface-tertiary/60 border-2 border-transparent"
          )}
        >
          {tasks.map((task) => (
            <KanbanCard
              key={task.id}
              task={task}
              onClick={() => onCardClick(task)}
            />
          ))}

          {tasks.length === 0 && (
            <div className="flex-1 flex items-center justify-center py-8">
              <p className="text-xs text-gray-400 text-center">
                {isOver ? "Drop here" : "No tasks"}
              </p>
            </div>
          )}
        </div>
      </SortableContext>

      {/* Add task button */}
      <button className="flex items-center gap-1.5 px-2 py-2 mt-2 rounded-lg text-xs text-gray-400 hover:text-brand-600 hover:bg-brand-50 w-full transition-all duration-150">
        <Plus className="w-3.5 h-3.5" />
        Add task
      </button>
    </div>
  )
}