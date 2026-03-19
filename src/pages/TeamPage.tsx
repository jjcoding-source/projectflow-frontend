import { useState, useMemo } from "react"
import {
  Search, UserPlus, Mail, MoreHorizontal,
  Users, CheckCircle2, Bug, TrendingUp,
  Shield, UserMinus, Send, ChevronDown, X
} from "lucide-react"
import { cn } from "../lib/utils"
import { MOCK_TEAM, ROLE_LABELS, ROLE_BADGE, type TeamMember } from "../data/mockTeam"
import MemberProfilePanel from "../components/team/MemberProfilePanel"
import type { Role } from "../types"

// Invite modal 
function InviteModal({ onClose }: { onClose: () => void }) {
  const [email, setEmail] = useState("")
  const [role, setRole] = useState<Role>("Developer")
  const [sent, setSent] = useState(false)

  const handleSend = () => {
    if (!email.trim()) return
    setSent(true)
    setTimeout(onClose, 1800)
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-modal w-full max-w-md animate-slide-up">
        <div className="flex items-center justify-between px-6 py-4 border-b border-surface-border">
          <h2 className="text-base font-semibold text-gray-900">Invite a teammate</h2>
          <button onClick={onClose} className="btn-ghost p-1.5 rounded-lg">
            <X className="w-4 h-4" />
          </button>
        </div>

        {sent ? (
          <div className="px-6 py-10 flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-brand-100 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6 text-brand-600" />
            </div>
            <p className="font-semibold text-gray-900">Invite sent!</p>
            <p className="text-sm text-gray-500">
              An invitation email has been sent to <strong>{email}</strong>
            </p>
          </div>
        ) : (
          <div className="px-6 py-5 space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Email address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="colleague@company.com"
                className="input"
                autoFocus
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Assign role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value as Role)}
                className="input"
              >
                {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([r, label]) => (
                  <option key={r} value={r}>{label}</option>
                ))}
              </select>
              <p className="text-xs text-gray-400 mt-1.5">
                They'll join with this role. You can change it later.
              </p>
            </div>

            {/* Role info box */}
            <div className="bg-surface-secondary rounded-xl p-3 text-xs text-gray-600 leading-relaxed">
              <span className={cn("badge text-[10px] mr-2", ROLE_BADGE[role])}>
                {ROLE_LABELS[role]}
              </span>
              {role === "Developer" && "Can create and update tasks, log time, link GitHub PRs."}
              {role === "Tester" && "Can report bugs, verify fixes, write test cases."}
              {role === "ProjectManager" && "Full project control — sprints, analytics, reports."}
              {role === "Designer" && "Can manage design tasks, attach assets, request reviews."}
              {role === "ScrumMaster" && "Manages sprint ceremonies, removes blockers, velocity."}
              {role === "DevLead" && "Leads dev team, assigns tasks, reviews PRs."}
              {role === "TestLead" && "Manages QA team, signs off release readiness."}
              {role === "BusinessAnalyst" && "Writes user stories, defines acceptance criteria."}
              {role === "Guest" && "Read-only access to selected projects."}
            </div>

            <div className="flex gap-3 pt-1">
              <button onClick={onClose} className="btn-secondary flex-1">Cancel</button>
              <button
                onClick={handleSend}
                disabled={!email.trim()}
                className="btn-primary flex-1 gap-2"
              >
                <Send className="w-4 h-4" /> Send invite
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Member card 
function MemberCard({
  member,
  onClick,
  selected,
}: {
  member: TeamMember
  onClick: () => void
  selected: boolean
}) {
  const [menuOpen, setMenuOpen] = useState(false)
  const completionRate = member.tasksCompleted + member.tasksOpen > 0
    ? Math.round((member.tasksCompleted / (member.tasksCompleted + member.tasksOpen)) * 100)
    : 0

  return (
    <div
      onClick={onClick}
      className={cn(
        "card cursor-pointer transition-all duration-200 group relative overflow-hidden",
        selected
          ? "border-brand-300 ring-1 ring-brand-200 shadow-card-hover"
          : "hover:shadow-card-hover hover:border-surface-border-strong"
      )}
    >
      {/* Selected accent bar */}
      {selected && (
        <div className="absolute top-0 left-0 right-0 h-0.5 bg-brand-500 rounded-t-xl" />
      )}

      <div className="p-4 space-y-3.5">
        {/* Top row — avatar + status + menu */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="relative flex-shrink-0">
              <div className={cn(
                "w-11 h-11 rounded-xl flex items-center justify-center text-sm font-semibold",
                member.avatarColor
              )}>
                {member.initials}
              </div>
              <span className={cn(
                "absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-white",
                member.isOnline ? "bg-brand-500" : "bg-gray-300"
              )} />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-900">{member.name}</p>
              <p className="text-xs text-gray-500">{member.jobTitle}</p>
            </div>
          </div>

          {/* Kebab menu */}
          <div className="relative" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="btn-ghost p-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
            {menuOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
                <div className="absolute right-0 top-full mt-1 w-40 bg-white rounded-xl border border-surface-border shadow-modal py-1.5 z-20 animate-slide-up">
                  <button className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-surface-secondary">
                    <Shield className="w-3.5 h-3.5 text-gray-400" /> Change role
                  </button>
                  <button className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-gray-700 hover:bg-surface-secondary">
                    <Mail className="w-3.5 h-3.5 text-gray-400" /> Send message
                  </button>
                  <div className="h-px bg-surface-border my-1" />
                  <button className="flex items-center gap-2 w-full px-3 py-1.5 text-xs text-red-600 hover:bg-red-50">
                    <UserMinus className="w-3.5 h-3.5" /> Remove
                  </button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Role badge */}
        <div className="flex items-center justify-between">
          <span className={cn("badge text-[10px]", ROLE_BADGE[member.role])}>
            {ROLE_LABELS[member.role]}
          </span>
          {member.status === "invited" ? (
            <span className="badge bg-amber-100 text-amber-700 border border-amber-200 text-[10px]">
              Pending invite
            </span>
          ) : (
            <span className={cn(
              "text-[10px] font-medium",
              member.isOnline ? "text-brand-600" : "text-gray-400"
            )}>
              {member.isOnline ? "● Online" : "Offline"}
            </span>
          )}
        </div>

        {/* Stats row */}
        {member.status !== "invited" && (
          <div className="grid grid-cols-3 gap-2 pt-1 border-t border-surface-border">
            {[
              { icon: CheckCircle2, value: member.tasksCompleted, label: "Done",     color: "text-brand-600"  },
              { icon: Bug,          value: member.bugsReported,   label: "Bugs",     color: "text-red-500"    },
              { icon: TrendingUp,   value: `${member.onTimeRate}%`, label: "On time", color: member.onTimeRate >= 90 ? "text-brand-600" : "text-amber-600" },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="text-center">
                <div className={cn("text-sm font-semibold", color)}>{value}</div>
                <div className="text-[10px] text-gray-400">{label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Completion bar */}
        {member.status !== "invited" && (
          <div className="space-y-1">
            <div className="flex items-center justify-between text-[10px] text-gray-400">
              <span>Completion</span>
              <span className="font-medium text-gray-600">{completionRate}%</span>
            </div>
            <div className="h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  completionRate >= 90 ? "bg-brand-500"
                  : completionRate >= 75 ? "bg-amber-500"
                  : "bg-red-400"
                )}
                style={{ width: `${completionRate}%` }}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Main page 
const ROLE_FILTERS = [
  { id: "all",     label: "All roles" },
  { id: "Dev",     label: "Developers"   },
  { id: "QA",      label: "QA / Testers" },
  { id: "Design",  label: "Design"       },
  { id: "Lead",    label: "Leads"        },
  { id: "PM",      label: "Management"   },
]

type ViewMode = "grid" | "list"

export default function TeamPage() {
  const [search, setSearch]           = useState("")
  const [roleFilter, setRoleFilter]   = useState("all")
  const [viewMode, setViewMode]       = useState<ViewMode>("grid")
  const [selectedMember, setSelected] = useState<TeamMember | null>(null)
  const [showInvite, setShowInvite]   = useState(false)

  const filtered = useMemo(() => {
    return MOCK_TEAM.filter((m) => {
      const matchSearch =
        !search ||
        m.name.toLowerCase().includes(search.toLowerCase()) ||
        m.email.toLowerCase().includes(search.toLowerCase()) ||
        m.jobTitle?.toLowerCase().includes(search.toLowerCase())

      const matchRole =
        roleFilter === "all" ||
        (roleFilter === "Dev"    && m.role === "Developer")    ||
        (roleFilter === "QA"     && (m.role === "Tester" || m.role === "TestLead")) ||
        (roleFilter === "Design" && m.role === "Designer")     ||
        (roleFilter === "Lead"   && (m.role === "DevLead" || m.role === "TestLead" || m.role === "ScrumMaster")) ||
        (roleFilter === "PM"     && (m.role === "ProjectManager" || m.role === "ProductOwner" || m.role === "OrgAdmin"))

      return matchSearch && matchRole
    })
  }, [search, roleFilter])

  const onlineCount = MOCK_TEAM.filter((m) => m.isOnline).length
  const totalTasks  = MOCK_TEAM.reduce((s, m) => s + m.tasksOpen, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="page-title">Team members</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {MOCK_TEAM.length} members ·{" "}
            <span className="text-brand-600 font-medium">{onlineCount} online now</span>
            {" "}· {totalTasks} open tasks across all
          </p>
        </div>
        <button
          onClick={() => setShowInvite(true)}
          className="btn-primary gap-2"
        >
          <UserPlus className="w-4 h-4" /> Invite member
        </button>
      </div>

      {/* Org stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "Total members",   value: MOCK_TEAM.filter((m) => m.status === "active").length,  icon: Users,        color: "bg-blue-50 text-blue-600"   },
          { label: "Online now",      value: onlineCount,                                             icon: CheckCircle2, color: "bg-brand-50 text-brand-600" },
          { label: "Pending invites", value: MOCK_TEAM.filter((m) => m.status === "invited").length,  icon: Mail,         color: "bg-amber-50 text-amber-600" },
          { label: "Open tasks",      value: totalTasks,                                              icon: TrendingUp,   color: "bg-red-50 text-red-500"     },
        ].map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="card p-4 flex items-center gap-3">
            <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0", color)}>
              <Icon className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xl font-semibold text-gray-900">{value}</p>
              <p className="text-xs text-gray-500">{label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters bar */}
      <div className="card p-3 flex items-center gap-3 flex-wrap">
        {/* Search */}
        <div className="flex items-center gap-2 bg-surface-secondary border border-surface-border rounded-lg px-3 py-1.5 min-w-[220px] flex-1 max-w-xs">
          <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by name, email, role..."
            className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
          />
          {search && (
            <button onClick={() => setSearch("")} className="text-gray-400 hover:text-gray-600">
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Role filter pills */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {ROLE_FILTERS.map(({ id, label }) => (
            <button
              key={id}
              onClick={() => setRoleFilter(id)}
              className={cn(
                "px-3 py-1.5 rounded-full text-xs font-medium transition-all",
                roleFilter === id
                  ? "bg-gray-900 text-white"
                  : "text-gray-500 hover:text-gray-700 hover:bg-surface-tertiary"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        {/* View toggle */}
        <div className="ml-auto flex items-center gap-1 bg-surface-tertiary rounded-lg p-0.5">
          {(["grid", "list"] as ViewMode[]).map((v) => (
            <button
              key={v}
              onClick={() => setViewMode(v)}
              className={cn(
                "px-2.5 py-1.5 rounded-md text-xs font-medium capitalize transition-all",
                viewMode === v
                  ? "bg-white text-gray-900 shadow-card"
                  : "text-gray-500 hover:text-gray-700"
              )}
            >
              {v}
            </button>
          ))}
        </div>
      </div>

      {/* Results count */}
      {search && (
        <p className="text-xs text-gray-400 -mt-2">
          {filtered.length} result{filtered.length !== 1 && "s"} for "{search}"
        </p>
      )}

      {/* Members — grid view */}
      {viewMode === "grid" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filtered.map((member) => (
            <MemberCard
              key={member.id}
              member={member}
              selected={selectedMember?.id === member.id}
              onClick={() => setSelected(
                selectedMember?.id === member.id ? null : member
              )}
            />
          ))}

          {/* Invite card */}
          <div
            onClick={() => setShowInvite(true)}
            className="card border-dashed border-2 cursor-pointer hover:border-brand-300 hover:bg-brand-50/30 transition-all duration-200 flex flex-col items-center justify-center gap-3 p-6 min-h-[200px]"
          >
            <div className="w-12 h-12 rounded-full border-2 border-dashed border-surface-border-strong flex items-center justify-center">
              <UserPlus className="w-5 h-5 text-gray-400" />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium text-gray-600">Invite teammate</p>
              <p className="text-xs text-gray-400 mt-0.5">Add a new member</p>
            </div>
          </div>
        </div>
      )}

      {/* Members — list view */}
      {viewMode === "list" && (
        <div className="card overflow-hidden">
          <div className="grid grid-cols-[2fr_1.2fr_80px_80px_80px_80px_40px] gap-3 px-5 py-3 bg-surface-secondary border-b border-surface-border">
            {["Member", "Role", "Tasks done", "Open", "Bugs", "On time", ""].map((h) => (
              <div key={h} className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider">
                {h}
              </div>
            ))}
          </div>
          <div className="divide-y divide-surface-border">
            {filtered.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelected(selectedMember?.id === member.id ? null : member)}
                className={cn(
                  "grid grid-cols-[2fr_1.2fr_80px_80px_80px_80px_40px] gap-3 px-5 py-3.5 items-center cursor-pointer transition-colors",
                  selectedMember?.id === member.id
                    ? "bg-brand-50/50"
                    : "hover:bg-surface-secondary"
                )}
              >
                {/* Member */}
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative flex-shrink-0">
                    <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center text-xs font-semibold", member.avatarColor)}>
                      {member.initials}
                    </div>
                    <span className={cn(
                      "absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white",
                      member.isOnline ? "bg-brand-500" : "bg-gray-300"
                    )} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{member.name}</p>
                    <p className="text-xs text-gray-400 truncate">{member.email}</p>
                  </div>
                </div>
                {/* Role */}
                <span className={cn("badge text-[10px] w-fit", ROLE_BADGE[member.role])}>
                  {ROLE_LABELS[member.role]}
                </span>
                {/* Stats */}
                <span className="text-sm font-medium text-brand-600">{member.tasksCompleted}</span>
                <span className="text-sm text-amber-600">{member.tasksOpen}</span>
                <span className="text-sm text-red-500">{member.bugsReported}</span>
                <span className={cn(
                  "text-sm font-medium",
                  member.onTimeRate >= 90 ? "text-brand-600" : "text-amber-500"
                )}>
                  {member.status === "invited" ? "—" : `${member.onTimeRate}%`}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-300 -rotate-90" />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-gray-400">
          <Users className="w-12 h-12 mb-3 opacity-30" />
          <p className="text-sm font-medium">No members found</p>
          <p className="text-xs mt-1">Try adjusting your search or filters</p>
        </div>
      )}

      {/* Side panel */}
      <MemberProfilePanel
        member={selectedMember}
        onClose={() => setSelected(null)}
      />

      {/* Invite modal */}
      {showInvite && <InviteModal onClose={() => setShowInvite(false)} />}
    </div>
  )
}