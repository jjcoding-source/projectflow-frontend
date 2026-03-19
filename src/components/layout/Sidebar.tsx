import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import {
  Layers, LayoutDashboard, CheckSquare, Calendar, BarChart2,
  Bug, Users, Settings, ChevronDown, Plus, LogOut, Bell,
  FolderKanban, Zap
} from "lucide-react"
import { cn } from "../../lib/utils"
import { useAuthStore } from "../../store/authStore"
import type { Project } from "../../types"

const MOCK_PROJECTS: Project[] = [
  { id: "1", name: "E-Commerce Revamp", key: "EC", color: "#378ADD", status: "Active", visibility: "Private", progress: 72, memberCount: 6, createdAt: "", managerId: "1", description: "" },
  { id: "2", name: "Mobile App v2", key: "MA", color: "#1D9E75", status: "Active", visibility: "Private", progress: 45, memberCount: 4, createdAt: "", managerId: "1", description: "" },
  { id: "3", name: "API Gateway", key: "AG", color: "#D85A30", status: "Active", visibility: "Private", progress: 88, memberCount: 3, createdAt: "", managerId: "1", description: "" },
  { id: "4", name: "Design System", key: "DS", color: "#7F77DD", status: "Active", visibility: "Private", progress: 31, memberCount: 2, createdAt: "", managerId: "1", description: "" },
]

const NAV_ITEMS = [
  { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { to: "/my-tasks", icon: CheckSquare, label: "My tasks" },
  { to: "/calendar", icon: Calendar, label: "Calendar" },
  { to: "/analytics", icon: BarChart2, label: "Analytics" },
  { to: "/bugs", icon: Bug, label: "Bug tracker" },
  { to: "/team", icon: Users, label: "Team" },
]

interface SidebarProps {
  collapsed: boolean
}

export default function Sidebar({ collapsed }: SidebarProps) {
  const [projectsExpanded, setProjectsExpanded] = useState(true)
  const user = useAuthStore((s) => s.user)
  const logout = useAuthStore((s) => s.logout)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <aside
      className={cn(
        "flex flex-col h-full bg-white border-r border-surface-border transition-all duration-200 overflow-hidden",
        collapsed ? "w-14" : "w-56"
      )}
    >
      {/* Brand */}
      <div className={cn(
        "flex items-center gap-2.5 h-14 px-4 border-b border-surface-border flex-shrink-0",
        collapsed && "justify-center px-0"
      )}>
        <div className="w-7 h-7 bg-brand-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <Layers className="w-3.5 h-3.5 text-white" />
        </div>
        {!collapsed && (
          <span className="font-semibold text-gray-900 text-base tracking-tight">
            Project<span className="text-brand-600">Flow</span>
          </span>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-3 space-y-0.5 px-2">
        {/* Main nav */}
        {!collapsed && <div className="section-label mt-1 mb-2">Menu</div>}

        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150 cursor-pointer",
                collapsed ? "justify-center px-0 w-10 mx-auto" : "",
                isActive
                  ? "bg-brand-50 text-brand-700 font-medium"
                  : "text-gray-600 hover:bg-surface-tertiary hover:text-gray-900"
              )
            }
            title={collapsed ? label : undefined}
          >
            <Icon className="w-4 h-4 flex-shrink-0" />
            {!collapsed && <span>{label}</span>}
          </NavLink>
        ))}

        {/* Projects section */}
        {!collapsed && (
          <>
            <div className="pt-3 pb-1">
              <button
                onClick={() => setProjectsExpanded(!projectsExpanded)}
                className="section-label flex items-center justify-between w-full hover:text-gray-600 transition-colors"
              >
                <span>Projects</span>
                <ChevronDown
                  className={cn(
                    "w-3.5 h-3.5 mr-3 transition-transform duration-200",
                    !projectsExpanded && "-rotate-90"
                  )}
                />
              </button>
            </div>

            {projectsExpanded && (
              <div className="space-y-0.5">
                {MOCK_PROJECTS.map((project) => (
                  <NavLink
                    key={project.id}
                    to={`/projects/${project.id}`}
                    className={({ isActive }) =>
                      cn(
                        "flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-sm transition-all duration-150 cursor-pointer group",
                        isActive
                          ? "bg-surface-tertiary text-gray-900 font-medium"
                          : "text-gray-600 hover:bg-surface-tertiary hover:text-gray-900"
                      )
                    }
                  >
                    <span
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ background: project.color }}
                    />
                    <span className="flex-1 truncate text-xs">{project.name}</span>
                    <span className="text-[10px] font-mono text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.key}
                    </span>
                  </NavLink>
                ))}

                <button className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg text-xs text-gray-400 hover:text-brand-600 hover:bg-brand-50 w-full transition-all duration-150">
                  <Plus className="w-3.5 h-3.5" />
                  New project
                </button>
              </div>
            )}
          </>
        )}

        {/* Collapsed projects dots */}
        {collapsed && (
          <div className="pt-3 space-y-1">
            {MOCK_PROJECTS.map((project) => (
              <NavLink
                key={project.id}
                to={`/projects/${project.id}`}
                title={project.name}
                className="flex justify-center py-1.5"
              >
                <span
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: project.color }}
                />
              </NavLink>
            ))}
          </div>
        )}
      </div>

      {/* Bottom section */}
      <div className="border-t border-surface-border p-2 space-y-0.5">
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            cn(
              "flex items-center gap-2.5 px-2.5 py-2 rounded-lg text-sm transition-all duration-150",
              collapsed ? "justify-center px-0 w-10 mx-auto" : "",
              isActive
                ? "bg-brand-50 text-brand-700"
                : "text-gray-600 hover:bg-surface-tertiary hover:text-gray-900"
            )
          }
          title={collapsed ? "Settings" : undefined}
        >
          <Settings className="w-4 h-4 flex-shrink-0" />
          {!collapsed && <span>Settings</span>}
        </NavLink>

        {/* User block */}
        {!collapsed ? (
          <div className="flex items-center gap-2.5 px-2.5 py-2 rounded-lg hover:bg-surface-tertiary cursor-pointer group transition-all duration-150">
            <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold flex-shrink-0">
              {user?.initials ?? "??"}
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-xs font-medium text-gray-900 truncate">{user?.name}</div>
              <div className="text-[10px] text-gray-400 truncate">{user?.role}</div>
            </div>
            <button
              onClick={handleLogout}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-gray-400 hover:text-red-500"
              title="Sign out"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <div
            title={user?.name}
            className="flex justify-center py-2 cursor-pointer"
          >
            <div className="w-7 h-7 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-semibold">
              {user?.initials ?? "??"}
            </div>
          </div>
        )}
      </div>
    </aside>
  )
}