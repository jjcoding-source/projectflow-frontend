export const SPRINT_VELOCITY = [
  { sprint: "S9",  planned: 32, completed: 28 },
  { sprint: "S10", planned: 35, completed: 33 },
  { sprint: "S11", planned: 38, completed: 30 },
  { sprint: "S12", planned: 40, completed: 38 },
  { sprint: "S13", planned: 42, completed: 40 },
  { sprint: "S14", planned: 45, completed: 34 },
]

export const BURNDOWN_DATA = [
  { day: "Mar 11", ideal: 45, actual: 45 },
  { day: "Mar 12", ideal: 40, actual: 42 },
  { day: "Mar 13", ideal: 35, actual: 38 },
  { day: "Mar 14", ideal: 30, actual: 33 },
  { day: "Mar 15", ideal: 25, actual: 29 },
  { day: "Mar 16", ideal: 20, actual: 24 },
  { day: "Mar 17", ideal: 15, actual: 20 },
  { day: "Mar 18", ideal: 10, actual: 15 },
  { day: "Mar 19", ideal: 5,  actual: null },
  { day: "Mar 20", ideal: 0,  actual: null },
]

export const TASK_STATUS_DIST = [
  { name: "Done",        value: 9,  color: "#10b96a" },
  { name: "In progress", value: 5,  color: "#EF9F27" },
  { name: "In review",   value: 3,  color: "#7F77DD" },
  { name: "To do",       value: 4,  color: "#378ADD" },
  { name: "Backlog",     value: 6,  color: "#adb5bd" },
]

export const BUG_TREND = [
  { week: "W1", reported: 4, resolved: 2 },
  { week: "W2", reported: 6, resolved: 5 },
  { week: "W3", reported: 3, resolved: 6 },
  { week: "W4", reported: 5, resolved: 4 },
  { week: "W5", reported: 7, resolved: 5 },
  { week: "W6", reported: 4, resolved: 7 },
]

export const TEAM_WORKLOAD = [
  { name: "John Dev",  tasks: 11, completed: 8,  avatar: "JD", color: "#378ADD" },
  { name: "Priya QA",  tasks: 7,  completed: 6,  avatar: "PQ", color: "#1D9E75" },
  { name: "Rajan DL",  tasks: 5,  completed: 5,  avatar: "RK", color: "#EF9F27" },
  { name: "Ananya UI", tasks: 6,  completed: 4,  avatar: "AU", color: "#7F77DD" },
  { name: "Sarah PM",  tasks: 3,  completed: 3,  avatar: "SP", color: "#D85A30" },
]

export const CYCLE_TIME = [
  { label: "Frontend", days: 2.1 },
  { label: "Backend",  days: 3.4 },
  { label: "Testing",  days: 1.8 },
  { label: "Design",   days: 2.6 },
  { label: "DevOps",   days: 1.2 },
]