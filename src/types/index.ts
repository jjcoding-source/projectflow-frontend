export type Role =
  | "OrgAdmin"
  | "ProjectManager"
  | "ScrumMaster"
  | "DevLead"
  | "TestLead"
  | "Developer"
  | "Tester"
  | "Designer"
  | "BusinessAnalyst"
  | "ProductOwner"
  | "DevOps"
  | "Guest";

export type Priority = "Critical" | "High" | "Medium" | "Low";

export type TaskStatus =
  | "Backlog"
  | "Todo"
  | "InProgress"
  | "InReview"
  | "Done"
  | "Blocked"
  | "Cancelled";

export type BugStatus =
  | "New"
  | "Assigned"
  | "InProgress"
  | "Fixed"
  | "Verified"
  | "Closed";

export type BugSeverity = "Critical" | "High" | "Medium" | "Low";

export type SprintStatus = "Created" | "Planning" | "Active" | "Completed";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  initials: string;
  role: Role;
  jobTitle?: string;
  isOnline?: boolean;
}

export interface Organisation {
  id: string;
  name: string;
  slug: string;
  logo?: string;
  createdAt: string;
}

export interface Project {
  id: string;
  name: string;
  key: string;
  description?: string;
  color: string;
  status: "Active" | "OnHold" | "Completed" | "Archived";
  visibility: "Private" | "Internal" | "Public";
  progress: number;
  memberCount: number;
  createdAt: string;
  managerId: string;
}

export interface Sprint {
  id: string;
  name: string;
  projectId: string;
  status: SprintStatus;
  startDate: string;
  endDate: string;
  goal?: string;
  velocity?: number;
}

export interface Task {
  id: string;
  taskId: string;
  title: string;
  description?: string;
  status: TaskStatus;
  priority: Priority;
  assignee?: User;
  reporter: User;
  projectId: string;
  sprintId?: string;
  dueDate?: string;
  estimatedHours?: number;
  loggedHours?: number;
  storyPoints?: number;
  tags: string[];
  subtasks: Subtask[];
  attachmentCount: number;
  commentCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface Subtask {
  id: string;
  title: string;
  isCompleted: boolean;
  assignee?: User;
}

export interface Bug {
  id: string;
  bugId: string;
  title: string;
  description: string;
  severity: BugSeverity;
  status: BugStatus;
  stepsToReproduce: string;
  expectedBehavior: string;
  actualBehavior: string;
  environment?: string;
  assignee?: User;
  reporter: User;
  projectId: string;
  relatedTaskId?: string;
  attachments: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  updatedAt?: string;
  isEdited: boolean;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "task" | "bug" | "sprint" | "mention" | "invite";
  isRead: boolean;
  link?: string;
  createdAt: string;
}