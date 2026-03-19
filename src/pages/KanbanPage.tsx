import { useState, useCallback } from "react"
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners,
  type DragStartEvent,
  type DragEndEvent,
  type DragOverEvent,
} from "@dnd-kit/core"
import { arrayMove } from "@dnd-kit/sortable"
import {
  Filter, SlidersHorizontal, Users, ChevronDown,
  Zap, Calendar, BarChart2, LayoutList
} from "lucide-react"
import { cn } from "../lib/utils"
import { MOCK_SPRINT_TASKS } from "../data/mockTasks"
import KanbanColumn from "../components/kanban/KanbanColumn"
import KanbanCard from "../components/kanban/KanbanCard"
import TaskDetailPanel from "../components/kanban/TaskDetailPanel"
import type { Task, TaskStatus } from "../types"

const COLUMNS: { id: TaskStatus; title: string; dotColor: string; color: string }[] = [
  { id: "Backlog",    title: "Backlog",      dotColor: "#888780", color: "#f1f3f5" },
  { id: "Todo",       title: "To do",        dotColor: "#378ADD", color: "#e6f1fb" },
  { id: "InProgress", title: "In progress",  dotColor: "#EF9F27", color: "#faeeda" },
  { id: "InReview",   title: "In review",    dotColor: "#7F77DD", color: "#eeedfe" },
  { id: "Done",       title: "Done",         dotColor: "#1D9E75", color: "#e1f5ee" },
]

const VIEW_TABS = [
  { icon: LayoutList,  label: "Kanban",   active: true  },
  { icon: BarChart2,   label: "List",     active: false },
  { icon: Calendar,    label: "Calendar", active: false },
  { icon: Zap,         label: "Gantt",    active: false },
]

export default function KanbanPage() {
  const [tasks, setTasks] = useState<Task[]>(MOCK_SPRINT_TASKS)
  const [activeTask, setActiveTask] = useState<Task | null>(null)
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [overColumnId, setOverColumnId] = useState<TaskStatus | null>(null)
  const [activeFilter, setActiveFilter] = useState<"all" | "mine" | "high" | "bugs">("all")

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  )

  const getTasksByColumn = useCallback(
    (columnId: TaskStatus) => tasks.filter((t) => t.status === columnId),
    [tasks]
  )

  const handleDragStart = ({ active }: DragStartEvent) => {
    const task = tasks.find((t) => t.id === active.id)
    if (task) setActiveTask(task)
  }

  const handleDragOver = ({ over }: DragOverEvent) => {
    if (!over) { setOverColumnId(null); return }
    const overId = over.id as string
    const isColumn = COLUMNS.some((c) => c.id === overId)
    if (isColumn) {
      setOverColumnId(overId as TaskStatus)
    } else {
      const overTask = tasks.find((t) => t.id === overId)
      if (overTask) setOverColumnId(overTask.status)
    }
  }

  const handleDragEnd = ({ active, over }: DragEndEvent) => {
    setActiveTask(null)
    setOverColumnId(null)
    if (!over) return

    const activeId = active.id as string
    const overId = over.id as string

    const activeTaskItem = tasks.find((t) => t.id === activeId)
    if (!activeTaskItem) return

    const isOverColumn = COLUMNS.some((c) => c.id === overId)

    if (isOverColumn) {
      
      if (activeTaskItem.status !== overId) {
        setTasks((prev) =>
          prev.map((t) => t.id === activeId ? { ...t, status: overId as TaskStatus } : t)
        )
      }
    } else {
      
      const overTask = tasks.find((t) => t.id === overId)
      if (!overTask) return

      if (activeTaskItem.status === overTask.status) {
       
        setTasks((prev) => {
          const colTasks = prev.filter((t) => t.status === activeTaskItem.status)
          const otherTasks = prev.filter((t) => t.status !== activeTaskItem.status)
          const oldIndex = colTasks.findIndex((t) => t.id === activeId)
          const newIndex = colTasks.findIndex((t) => t.id === overId)
          const reordered = arrayMove(colTasks, oldIndex, newIndex)
          return [...otherTasks, ...reordered]
        })
      } else {

        setTasks((prev) =>
          prev.map((t) => t.id === activeId ? { ...t, status: overTask.status } : t)
        )
      }
    }
  }

  const filteredTasks = (columnId: TaskStatus) => {
    const colTasks = getTasksByColumn(columnId)
    switch (activeFilter) {
      case "mine":  return colTasks.filter((t) => t.assignee?.id === "1")
      case "high":  return colTasks.filter((t) => t.priority === "Critical" || t.priority === "High")
      case "bugs":  return colTasks.filter((t) => t.tags.includes("bug"))
      default:      return colTasks
    }
  }

  const totalTasks = tasks.length
  const doneTasks = tasks.filter((t) => t.status === "Done").length
  const sprintProgress = Math.round((doneTasks / totalTasks) * 100)

  return (
    <div className="flex flex-col h-full -m-6 overflow-hidden">

      {/* Page header */}
      <div className="bg-white border-b border-surface-border px-6 py-4 flex-shrink-0">
        <div className="flex items-start justify-between gap-4 mb-4">
          <div>
            <div className="text-xs text-gray-400 mb-0.5 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-[#378ADD] inline-block" />
              E-Commerce Revamp
            </div>
            <h1 className="page-title">Sprint 14 — Kanban board</h1>
          </div>
          <div className="flex items-center gap-2 flex-shrink-0">
            {/* View switcher */}
            <div className="flex items-center bg-surface-tertiary rounded-lg p-0.5 gap-0.5">
              {VIEW_TABS.map(({ icon: Icon, label, active }) => (
                <button
                  key={label}
                  className={cn(
                    "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs font-medium transition-all",
                    active
                      ? "bg-white text-gray-900 shadow-card"
                      : "text-gray-500 hover:text-gray-700"
                  )}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span className="hidden sm:block">{label}</span>
                </button>
              ))}
            </div>
            <button className="btn-primary btn-sm gap-1.5">
              + Add task
            </button>
          </div>
        </div>

        {/* Sprint info bar */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-2.5 flex-1 min-w-[200px]">
            <div className="text-xs text-gray-500">
              <span className="font-medium text-gray-900">{doneTasks}</span>/{totalTasks} tasks done
            </div>
            <div className="flex-1 max-w-[160px] h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full transition-all duration-500"
                style={{ width: `${sprintProgress}%` }}
              />
            </div>
            <span className="text-xs font-medium text-gray-900">{sprintProgress}%</span>
          </div>

          <div className="flex items-center gap-1 text-xs text-gray-500">
            <Calendar className="w-3.5 h-3.5" />
            Mar 11 – Mar 24
            <span className="ml-1 badge-red px-1.5 py-0.5 text-[10px]">3 days left</span>
          </div>

          {/* Avatars */}
          <div className="flex items-center">
            {["JD", "PQ", "RK", "AU"].map((initials, i) => (
              <div
                key={initials}
                className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-[9px] font-semibold flex items-center justify-center border-2 border-white"
                style={{ marginLeft: i > 0 ? "-6px" : 0, zIndex: 4 - i }}
                title={initials}
              >
                {initials}
              </div>
            ))}
            <span className="ml-2 text-xs text-gray-400">4 members</span>
          </div>
        </div>
      </div>

      {/* Filters toolbar */}
      <div className="bg-white border-b border-surface-border px-6 py-2.5 flex items-center gap-2 flex-shrink-0">
        <Filter className="w-3.5 h-3.5 text-gray-400" />
        <div className="flex items-center gap-1.5">
          {([
            { id: "all",  label: `All (${tasks.length})` },
            { id: "mine", label: "My tasks" },
            { id: "high", label: "High priority" },
            { id: "bugs", label: "Bugs" },
          ] as const).map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setActiveFilter(id)}
              className={cn(
                "px-3 py-1 rounded-full text-xs font-medium transition-all",
                activeFilter === id
                  ? "bg-brand-600 text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-surface-tertiary"
              )}
            >
              {label}
            </button>
          ))}
        </div>
        <div className="ml-auto flex items-center gap-2">
          <button className="btn-ghost btn-sm gap-1.5 text-xs">
            <SlidersHorizontal className="w-3.5 h-3.5" />
            Group by
            <ChevronDown className="w-3 h-3" />
          </button>
          <button className="btn-ghost btn-sm gap-1.5 text-xs">
            <Users className="w-3.5 h-3.5" />
            Assignee
          </button>
        </div>
      </div>

      {/* Board */}
      <div className="flex-1 overflow-x-auto overflow-y-hidden">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragOver={handleDragOver}
          onDragEnd={handleDragEnd}
        >
          <div className="flex gap-4 h-full px-6 py-5 min-w-max">
            {COLUMNS.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={filteredTasks(column.id)}
                onCardClick={(task) => setSelectedTask(task)}
                isOver={overColumnId === column.id}
              />
            ))}
          </div>

          {/* Drag overlay */}
          <DragOverlay dropAnimation={{ duration: 150, easing: "cubic-bezier(0.18, 0.67, 0.6, 1.22)" }}>
            {activeTask && (
              <div className="rotate-2 scale-105">
                <KanbanCard
                  task={activeTask}
                  onClick={() => {}}
                  isDragging
                />
              </div>
            )}
          </DragOverlay>
        </DndContext>
      </div>

      {/* Task detail panel */}
      <TaskDetailPanel
        task={selectedTask}
        onClose={() => setSelectedTask(null)}
      />
    </div>
  )
}