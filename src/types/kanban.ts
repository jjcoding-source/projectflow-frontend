import type { Task, TaskStatus, Priority } from "./index"

export interface KanbanColumn {
  id: TaskStatus
  title: string
  color: string
  dotColor: string
  tasks: Task[]
}

export interface DragItem {
  taskId: string
  sourceColumnId: TaskStatus
}