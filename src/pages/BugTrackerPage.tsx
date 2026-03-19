import { useState, useMemo } from "react"
import {
  AlertTriangle, Plus, Search, Filter, Download,
  ChevronUp, ChevronDown, ChevronsUpDown, Bug,
  CheckCircle2, Clock, XCircle, RefreshCw
} from "lucide-react"
import { cn } from "../lib/utils"
import { MOCK_BUGS } from "../data/mockBugs"
import BugDetailPanel from "../components/bugs/BugDetailPanel"
import type { Bug as BugType, BugStatus, BugSeverity } from "../types"

const SEVERITY_CONFIG: Record<BugSeverity, { badge: string; dot: string; ring: string }> = {
  Critical: { badge: "bg-red-100 text-red-800 border border-red-200",       dot: "bg-red-600",    ring: "ring-red-200"    },
  High:     { badge: "bg-amber-100 text-amber-800 border border-amber-200", dot: "bg-amber-500",  ring: "ring-amber-200"  },
  Medium:   { badge: "bg-yellow-100 text-yellow-800 border border-yellow-200", dot: "bg-yellow-500", ring: "ring-yellow-200" },
  Low:      { badge: "bg-green-100 text-green-800 border border-green-200", dot: "bg-green-500",  ring: "ring-green-200"  },
}

const STATUS_CONFIG: Record<BugStatus, { badge: string; label: string; icon: React.ElementType }> = {
  New:        { badge: "bg-gray-100 text-gray-700 border border-gray-200",       label: "New",         icon: Bug          },
  Assigned:   { badge: "bg-blue-100 text-blue-800 border border-blue-200",       label: "Assigned",    icon: Clock        },
  InProgress: { badge: "bg-amber-100 text-amber-800 border border-amber-200",    label: "In progress", icon: RefreshCw    },
  Fixed:      { badge: "bg-purple-100 text-purple-800 border border-purple-200", label: "Fixed",       icon: CheckCircle2 },
  Verified:   { badge: "bg-green-100 text-green-800 border border-green-200",    label: "Verified",    icon: CheckCircle2 },
  Closed:     { badge: "bg-gray-100 text-gray-500 border border-gray-200",       label: "Closed",      icon: XCircle      },
}

const STATUS_FILTERS: { id: BugStatus | "All"; label: string }[] = [
  { id: "All",        label: "All" },
  { id: "New",        label: "New" },
  { id: "Assigned",   label: "Assigned" },
  { id: "InProgress", label: "In progress" },
  { id: "Fixed",      label: "Fixed" },
  { id: "Verified",   label: "Verified" },
  { id: "Closed",     label: "Closed" },
]

type SortField = "severity" | "status" | "createdAt" | "title"
type SortDir = "asc" | "desc"

const SEVERITY_ORDER: Record<BugSeverity, number> = { Critical: 0, High: 1, Medium: 2, Low: 3 }
const STATUS_ORDER: Record<BugStatus, number> = { New: 0, Assigned: 1, InProgress: 2, Fixed: 3, Verified: 4, Closed: 5 }

function StatCard({ label, value, color, icon: Icon }: {
  label: string; value: number; color: string; icon: React.ElementType
}) {
  return (
    <div className="card p-4 flex items-center gap-3">
      <div className={cn("w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0", color)}>
        <Icon className="w-4 h-4" />
      </div>
      <div>
        <div className="text-xl font-semibold text-gray-900">{value}</div>
        <div className="text-xs text-gray-500">{label}</div>
      </div>
    </div>
  )
}

export default function BugTrackerPage() {
  const [selectedBug, setSelectedBug] = useState<BugType | null>(null)
  const [statusFilter, setStatusFilter] = useState<BugStatus | "All">("All")
  const [severityFilter, setSeverityFilter] = useState<BugSeverity | "All">("All")
  const [search, setSearch] = useState("")
  const [sortField, setSortField] = useState<SortField>("severity")
  const [sortDir, setSortDir] = useState<SortDir>("asc")

  const handleSort = (field: SortField) => {
    if (sortField === field) setSortDir(sortDir === "asc" ? "desc" : "asc")
    else { setSortField(field); setSortDir("asc") }
  }

  const filtered = useMemo(() => {
    return MOCK_BUGS
      .filter((b) => {
        if (statusFilter !== "All" && b.status !== statusFilter) return false
        if (severityFilter !== "All" && b.severity !== severityFilter) return false
        if (search && !b.title.toLowerCase().includes(search.toLowerCase()) &&
            !b.bugId.toLowerCase().includes(search.toLowerCase())) return false
        return true
      })
      .sort((a, b) => {
        let cmp = 0
        if (sortField === "severity") cmp = SEVERITY_ORDER[a.severity] - SEVERITY_ORDER[b.severity]
        else if (sortField === "status") cmp = STATUS_ORDER[a.status] - STATUS_ORDER[b.status]
        else if (sortField === "createdAt") cmp = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        else if (sortField === "title") cmp = a.title.localeCompare(b.title)
        return sortDir === "desc" ? -cmp : cmp
      })
  }, [statusFilter, severityFilter, search, sortField, sortDir])

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ChevronsUpDown className="w-3 h-3 text-gray-300" />
    return sortDir === "asc"
      ? <ChevronUp className="w-3 h-3 text-brand-600" />
      : <ChevronDown className="w-3 h-3 text-brand-600" />
  }

  const stats = {
    critical: MOCK_BUGS.filter((b) => b.severity === "Critical" && b.status !== "Closed").length,
    high: MOCK_BUGS.filter((b) => b.severity === "High" && b.status !== "Closed").length,
    open: MOCK_BUGS.filter((b) => !["Verified", "Closed"].includes(b.status)).length,
    fixed: MOCK_BUGS.filter((b) => b.status === "Verified" || b.status === "Closed").length,
  }

  const timeAgo = (iso: string) => {
    const days = Math.floor((Date.now() - new Date(iso).getTime()) / 86400000)
    if (days === 0) return "Today"
    if (days === 1) return "Yesterday"
    return `${days}d ago`
  }

  return (
    <div className="max-w-6xl mx-auto space-y-5 animate-fade-in">

      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-xs text-gray-400 mb-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#378ADD] inline-block" />
            E-Commerce Revamp
          </div>
          <h1 className="page-title">Bug tracker</h1>
          <p className="text-sm text-gray-500 mt-0.5">{MOCK_BUGS.length} total bugs · {stats.open} open</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <button className="btn-secondary btn-sm gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export CSV
          </button>
          <button className="btn-danger btn-sm gap-1.5">
            <Plus className="w-3.5 h-3.5" /> Report bug
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <StatCard label="Critical open"   value={stats.critical} color="bg-red-50 text-red-600"    icon={AlertTriangle}  />
        <StatCard label="High priority"   value={stats.high}     color="bg-amber-50 text-amber-600" icon={AlertTriangle}  />
        <StatCard label="Total open"      value={stats.open}     color="bg-blue-50 text-blue-600"   icon={Bug}            />
        <StatCard label="Resolved"        value={stats.fixed}    color="bg-green-50 text-green-600" icon={CheckCircle2}   />
      </div>

      {/* Filters */}
      <div className="card p-3 space-y-3">
        {/* Search */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 flex-1 max-w-sm bg-surface-secondary border border-surface-border rounded-lg px-3 py-1.5">
            <Search className="w-3.5 h-3.5 text-gray-400 flex-shrink-0" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title or ID..."
              className="flex-1 text-sm bg-transparent outline-none text-gray-700 placeholder-gray-400"
            />
          </div>
          {/* Severity filter pills */}
          <div className="flex items-center gap-1.5 ml-auto">
            <Filter className="w-3.5 h-3.5 text-gray-400" />
            {(["All", "Critical", "High", "Medium", "Low"] as const).map((sev) => (
              <button
                key={sev}
                onClick={() => setSeverityFilter(sev === "All" ? "All" : sev as BugSeverity)}
                className={cn(
                  "px-2.5 py-1 rounded-full text-xs font-medium transition-all",
                  (sev === "All" ? severityFilter === "All" : severityFilter === sev)
                    ? sev === "All" ? "bg-gray-800 text-white"
                    : sev === "Critical" ? "bg-red-600 text-white"
                    : sev === "High" ? "bg-amber-500 text-white"
                    : sev === "Medium" ? "bg-yellow-500 text-white"
                    : "bg-green-500 text-white"
                    : "text-gray-500 hover:text-gray-700 hover:bg-surface-tertiary"
                )}
              >
                {sev}
              </button>
            ))}
          </div>
        </div>

        {/* Status tabs */}
        <div className="flex items-center gap-1 border-t border-surface-border pt-2.5">
          {STATUS_FILTERS.map(({ id, label }) => {
            const count = id === "All"
              ? MOCK_BUGS.length
              : MOCK_BUGS.filter((b) => b.status === id).length
            return (
              <button
                key={id}
                onClick={() => setStatusFilter(id)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  statusFilter === id
                    ? "bg-surface-tertiary text-gray-900"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {label}
                <span className={cn(
                  "px-1.5 py-0.5 rounded-md text-[10px]",
                  statusFilter === id ? "bg-white text-gray-700" : "bg-surface-tertiary text-gray-400"
                )}>
                  {count}
                </span>
              </button>
            )
          })}
          <div className="ml-auto text-xs text-gray-400">
            {filtered.length} result{filtered.length !== 1 && "s"}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {/* Table header */}
        <div className="grid grid-cols-[16px_2fr_100px_110px_130px_100px_70px] gap-3 px-4 py-3 bg-surface-secondary border-b border-surface-border">
          {[
            { label: "", field: null },
            { label: "Bug",        field: "title"     as SortField },
            { label: "Severity",   field: "severity"  as SortField },
            { label: "Status",     field: "status"    as SortField },
            { label: "Assigned to",field: null },
            { label: "Reported",   field: "createdAt" as SortField },
            { label: "ID",         field: null },
          ].map(({ label, field }, i) => (
            <div
              key={i}
              onClick={() => field && handleSort(field)}
              className={cn(
                "text-[10px] font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1",
                field && "cursor-pointer hover:text-gray-600 select-none"
              )}
            >
              {label}
              {field && <SortIcon field={field} />}
            </div>
          ))}
        </div>

        {/* Rows */}
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-gray-400">
            <Bug className="w-10 h-10 mb-3 opacity-30" />
            <p className="text-sm font-medium">No bugs found</p>
            <p className="text-xs mt-1">Try adjusting your filters</p>
          </div>
        ) : (
          <div className="divide-y divide-surface-border">
            {filtered.map((bug) => {
              const sev = SEVERITY_CONFIG[bug.severity]
              const sta = STATUS_CONFIG[bug.status]
              const StatusIcon = sta.icon

              return (
                <div
                  key={bug.id}
                  onClick={() => setSelectedBug(bug)}
                  className={cn(
                    "grid grid-cols-[16px_2fr_100px_110px_130px_100px_70px] gap-3 px-4 py-3.5",
                    "hover:bg-surface-secondary cursor-pointer transition-colors items-center",
                    selectedBug?.id === bug.id && "bg-brand-50/50"
                  )}
                >
                  {/* Severity dot */}
                  <div className="flex justify-center">
                    <span className={cn("w-2.5 h-2.5 rounded-full flex-shrink-0", sev.dot)} />
                  </div>

                  {/* Title */}
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium text-gray-900 truncate">{bug.title}</p>
                      {(bug.severity === "Critical") && (
                        <AlertTriangle className="w-3.5 h-3.5 text-red-500 flex-shrink-0" />
                      )}
                    </div>
                    {bug.environment && (
                      <p className="text-xs text-gray-400 mt-0.5 truncate">{bug.environment}</p>
                    )}
                  </div>

                  {/* Severity badge */}
                  <div>
                    <span className={cn("badge text-[10px]", sev.badge)}>{bug.severity}</span>
                  </div>

                  {/* Status badge */}
                  <div>
                    <span className={cn("badge text-[10px] flex items-center gap-1 w-fit", sta.badge)}>
                      <StatusIcon className="w-2.5 h-2.5" />
                      {sta.label}
                    </span>
                  </div>

                  {/* Assignee */}
                  <div>
                    {bug.assignee ? (
                      <div className="flex items-center gap-1.5">
                        <div className="w-6 h-6 rounded-full bg-brand-100 text-brand-700 text-[9px] font-semibold flex items-center justify-center flex-shrink-0">
                          {bug.assignee.initials}
                        </div>
                        <span className="text-xs text-gray-700 truncate">{bug.assignee.name}</span>
                      </div>
                    ) : (
                      <span className="text-xs text-red-400 font-medium">Unassigned</span>
                    )}
                  </div>

                  {/* Date */}
                  <div className="text-xs text-gray-400">{timeAgo(bug.createdAt)}</div>

                  {/* ID */}
                  <div className="text-xs font-mono text-gray-400">{bug.bugId}</div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Detail panel */}
      <BugDetailPanel bug={selectedBug} onClose={() => setSelectedBug(null)} />
    </div>
  )
}