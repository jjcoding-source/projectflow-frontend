import { useState } from "react"
import {
  AreaChart, Area, BarChart, Bar, LineChart, Line,
  PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, Legend
} from "recharts"
import {
  TrendingUp, TrendingDown, Zap, CheckCircle2,
  Bug, Clock, Download, Calendar, Users, BarChart2
} from "lucide-react"
import { cn } from "../lib/utils"
import {
  SPRINT_VELOCITY, BURNDOWN_DATA, TASK_STATUS_DIST,
  BUG_TREND, TEAM_WORKLOAD, CYCLE_TIME
} from "../data/mockAnalytics"

// ─── Shared custom tooltip ───────────────────────────────────────────────────
function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-surface-border rounded-xl shadow-modal px-3 py-2.5 text-xs">
      <p className="font-semibold text-gray-700 mb-1.5">{label}</p>
      {payload.map((p: any) => (
        <div key={p.name} className="flex items-center gap-2 py-0.5">
          <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: p.color }} />
          <span className="text-gray-500">{p.name}:</span>
          <span className="font-semibold text-gray-800">{p.value}</span>
        </div>
      ))}
    </div>
  )
}

// ─── Stat card ────────────────────────────────────────────────────────────────
function StatCard({
  label, value, sub, trend, trendUp, icon: Icon, iconBg
}: {
  label: string
  value: string | number
  sub?: string
  trend?: string
  trendUp?: boolean
  icon: React.ElementType
  iconBg: string
}) {
  return (
    <div className="card p-5">
      <div className="flex items-start justify-between mb-3">
        <p className="text-sm text-gray-500">{label}</p>
        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", iconBg)}>
          <Icon className="w-4 h-4" />
        </div>
      </div>
      <p className="text-2xl font-semibold text-gray-900">{value}</p>
      {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      {trend && (
        <div className={cn(
          "flex items-center gap-1 mt-1.5 text-xs font-medium",
          trendUp ? "text-brand-600" : "text-red-500"
        )}>
          {trendUp
            ? <TrendingUp className="w-3 h-3" />
            : <TrendingDown className="w-3 h-3" />}
          {trend}
        </div>
      )}
    </div>
  )
}

// ─── Chart card wrapper ───────────────────────────────────────────────────────
function ChartCard({
  title, sub, children, className
}: {
  title: string
  sub?: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={cn("card p-5", className)}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {sub && <p className="text-xs text-gray-400 mt-0.5">{sub}</p>}
      </div>
      {children}
    </div>
  )
}

// ─── Custom Pie label ─────────────────────────────────────────────────────────
function PieLabel({ cx, cy, midAngle, outerRadius, name, value, percent }: any) {
  const RADIAN = Math.PI / 180
  const r = outerRadius + 28
  const x = cx + r * Math.cos(-midAngle * RADIAN)
  const y = cy + r * Math.sin(-midAngle * RADIAN)
  if (percent < 0.08) return null
  return (
    <text
      x={x} y={y}
      textAnchor={x > cx ? "start" : "end"}
      dominantBaseline="central"
      className="text-[10px] fill-gray-500"
      style={{ fontSize: 10 }}
    >
      {name} ({value})
    </text>
  )
}

// ─── Main page ────────────────────────────────────────────────────────────────
const SPRINT_OPTIONS = ["Sprint 14", "Sprint 13", "Sprint 12", "All sprints"]

export default function AnalyticsPage() {
  const [sprint, setSprint] = useState("Sprint 14")

  const totalVelocity = SPRINT_VELOCITY.at(-1)?.completed ?? 0
  const prevVelocity  = SPRINT_VELOCITY.at(-2)?.completed ?? 0
  const velocityDelta = totalVelocity - prevVelocity

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <div className="text-xs text-gray-400 mb-0.5 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#378ADD] inline-block" />
            E-Commerce Revamp
          </div>
          <h1 className="page-title">Analytics & reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Sprint performance, team workload, bug trends</p>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <div className="flex items-center gap-1.5 bg-surface-tertiary rounded-xl p-1">
            {SPRINT_OPTIONS.map((s) => (
              <button
                key={s}
                onClick={() => setSprint(s)}
                className={cn(
                  "px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                  sprint === s
                    ? "bg-white text-gray-900 shadow-card"
                    : "text-gray-500 hover:text-gray-700"
                )}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="btn-secondary btn-sm gap-1.5">
            <Download className="w-3.5 h-3.5" /> Export PDF
          </button>
        </div>
      </div>

      {/* ── KPI stats ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Sprint velocity"
          value={`${totalVelocity} pts`}
          trend={`${velocityDelta > 0 ? "+" : ""}${velocityDelta} vs last sprint`}
          trendUp={velocityDelta > 0}
          icon={Zap}
          iconBg="bg-amber-50 text-amber-600"
        />
        <StatCard
          label="Tasks completed"
          value={34}
          sub="of 38 planned"
          trend="89% completion rate"
          trendUp
          icon={CheckCircle2}
          iconBg="bg-brand-50 text-brand-600"
        />
        <StatCard
          label="Bugs resolved"
          value={11}
          sub="3 still open"
          trend="avg 2.4 days resolution"
          trendUp
          icon={Bug}
          iconBg="bg-red-50 text-red-500"
        />
        <StatCard
          label="Avg cycle time"
          value="2.4 days"
          sub="task start → done"
          trend="-0.6d vs last sprint"
          trendUp
          icon={Clock}
          iconBg="bg-blue-50 text-blue-600"
        />
      </div>

      {/* ── Row 1: Velocity + Burndown ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Sprint velocity */}
        <ChartCard title="Sprint velocity" sub="Planned vs completed story points per sprint">
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={SPRINT_VELOCITY} barCategoryGap="30%">
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" vertical={false} />
              <XAxis dataKey="sprint" tick={{ fontSize: 11, fill: "#adb5bd" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#adb5bd" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8f9fa" }} />
              <Bar dataKey="planned"   name="Planned"   fill="#e6f1fb" radius={[4, 4, 0, 0]} />
              <Bar dataKey="completed" name="Completed" fill="#0a9456" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
          {/* Legend */}
          <div className="flex items-center gap-4 mt-3">
            {[
              { color: "#e6f1fb", border: "#378ADD", label: "Planned" },
              { color: "#0a9456", border: "#0a9456", label: "Completed" },
            ].map(({ color, border, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-3 h-3 rounded-sm" style={{ background: color, border: `1.5px solid ${border}` }} />
                {label}
              </div>
            ))}
          </div>
        </ChartCard>

        {/* Burndown */}
        <ChartCard title="Sprint 14 burndown" sub="Remaining story points — ideal vs actual">
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={BURNDOWN_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" vertical={false} />
              <XAxis
                dataKey="day"
                tick={{ fontSize: 10, fill: "#adb5bd" }}
                axisLine={false} tickLine={false}
                tickFormatter={(v) => v.replace("Mar ", "")}
              />
              <YAxis tick={{ fontSize: 11, fill: "#adb5bd" }} axisLine={false} tickLine={false} width={28} />
              <Tooltip content={<CustomTooltip />} />
              <Line
                dataKey="ideal"
                name="Ideal"
                stroke="#ced4da"
                strokeWidth={1.5}
                strokeDasharray="5 4"
                dot={false}
                connectNulls
              />
              <Line
                dataKey="actual"
                name="Actual"
                stroke="#0a9456"
                strokeWidth={2}
                dot={{ r: 3, fill: "#0a9456", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
                connectNulls={false}
              />
            </LineChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3">
            {[
              { color: "#ced4da", dashed: true,  label: "Ideal trajectory" },
              { color: "#0a9456", dashed: false, label: "Actual progress" },
            ].map(({ color, dashed, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span
                  className="w-5 h-0.5 inline-block"
                  style={{
                    background: color,
                    borderTop: dashed ? `2px dashed ${color}` : undefined,
                    height: dashed ? 0 : undefined,
                  }}
                />
                {label}
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── Row 2: Task distribution + Bug trend ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-5">

        {/* Task status donut */}
        <ChartCard title="Task distribution" sub="Current sprint breakdown by status">
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie
                  data={TASK_STATUS_DIST}
                  cx="50%"
                  cy="50%"
                  innerRadius={58}
                  outerRadius={80}
                  paddingAngle={3}
                  dataKey="value"
                  labelLine={false}
                  label={<PieLabel />}
                >
                  {TASK_STATUS_DIST.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} strokeWidth={0} />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          {/* Legend list */}
          <div className="space-y-1.5 mt-1">
            {TASK_STATUS_DIST.map((item) => {
              const total = TASK_STATUS_DIST.reduce((s, i) => s + i.value, 0)
              const pct = Math.round((item.value / total) * 100)
              return (
                <div key={item.name} className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: item.color }} />
                  <span className="text-xs text-gray-600 flex-1">{item.name}</span>
                  <span className="text-xs font-medium text-gray-800">{item.value}</span>
                  <span className="text-[10px] text-gray-400 w-8 text-right">{pct}%</span>
                </div>
              )
            })}
          </div>
        </ChartCard>

        {/* Bug trend */}
        <ChartCard title="Bug trend" sub="Bugs reported vs resolved — last 6 weeks">
          <ResponsiveContainer width="100%" height={200}>
            <AreaChart data={BUG_TREND}>
              <defs>
                <linearGradient id="colorReported" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#E24B4A" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#E24B4A" stopOpacity={0}    />
                </linearGradient>
                <linearGradient id="colorResolved" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%"  stopColor="#10b96a" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#10b96a" stopOpacity={0}    />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: "#adb5bd" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: "#adb5bd" }} axisLine={false} tickLine={false} width={24} />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="reported"
                name="Reported"
                stroke="#E24B4A"
                strokeWidth={2}
                fill="url(#colorReported)"
                dot={{ r: 3, fill: "#E24B4A", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
              <Area
                type="monotone"
                dataKey="resolved"
                name="Resolved"
                stroke="#10b96a"
                strokeWidth={2}
                fill="url(#colorResolved)"
                dot={{ r: 3, fill: "#10b96a", strokeWidth: 0 }}
                activeDot={{ r: 5 }}
              />
            </AreaChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-3">
            {[
              { color: "#E24B4A", label: "Reported" },
              { color: "#10b96a", label: "Resolved" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── Row 3: Team workload + Cycle time ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Team workload */}
        <ChartCard title="Team workload" sub="Open tasks per member — current sprint">
          <div className="space-y-3 mt-1">
            {TEAM_WORKLOAD.map((member) => {
              const pct = Math.round((member.completed / member.tasks) * 100)
              const isOverloaded = member.tasks >= 10
              return (
                <div key={member.name} className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-semibold flex-shrink-0 text-white"
                      style={{ background: member.color }}
                    >
                      {member.avatar}
                    </div>
                    <span className="text-xs text-gray-700 flex-1">{member.name}</span>
                    {isOverloaded && (
                      <span className="badge-red text-[9px] px-1.5 py-0.5">Overloaded</span>
                    )}
                    <span className="text-xs font-medium text-gray-800">
                      {member.completed}/{member.tasks}
                    </span>
                    <span className="text-[10px] text-gray-400 w-8 text-right">{pct}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {/* Background bar */}
                    <div className="flex-1 h-2 bg-surface-tertiary rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${(member.tasks / 12) * 100}%`,
                          background: isOverloaded ? "#E24B4A" : member.color,
                          opacity: 0.25,
                        }}
                      />
                    </div>
                    {/* Completion overlay */}
                    <div className="flex-1 h-2 bg-surface-tertiary rounded-full overflow-hidden -ml-[calc(100%+8px)] relative">
                      <div
                        className="absolute inset-y-0 left-0 rounded-full transition-all duration-500"
                        style={{
                          width: `${(member.completed / 12) * 100}%`,
                          background: isOverloaded ? "#E24B4A" : member.color,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </ChartCard>

        {/* Cycle time by category */}
        <ChartCard title="Avg cycle time by category" sub="Days from task start to done">
          <ResponsiveContainer width="100%" height={210}>
            <BarChart
              data={CYCLE_TIME}
              layout="vertical"
              barCategoryGap="25%"
              margin={{ left: 0, right: 24, top: 4, bottom: 4 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f3f5" horizontal={false} />
              <XAxis
                type="number"
                tick={{ fontSize: 11, fill: "#adb5bd" }}
                axisLine={false} tickLine={false}
                domain={[0, 5]}
                tickFormatter={(v) => `${v}d`}
              />
              <YAxis
                type="category"
                dataKey="label"
                tick={{ fontSize: 11, fill: "#6c757d" }}
                axisLine={false} tickLine={false}
                width={60}
              />
              <Tooltip
                content={<CustomTooltip />}
                formatter={(v: number) => [`${v} days`, "Avg cycle time"]}
                cursor={{ fill: "#f8f9fa" }}
              />
              <Bar dataKey="days" name="Avg days" radius={[0, 4, 4, 0]}>
                {CYCLE_TIME.map((entry, index) => (
                  <Cell
                    key={index}
                    fill={entry.days > 3 ? "#E24B4A" : entry.days > 2 ? "#EF9F27" : "#10b96a"}
                    fillOpacity={0.85}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
          <div className="flex items-center gap-4 mt-2">
            {[
              { color: "#10b96a", label: "Under 2 days" },
              { color: "#EF9F27", label: "2–3 days" },
              { color: "#E24B4A", label: "Over 3 days" },
            ].map(({ color, label }) => (
              <div key={label} className="flex items-center gap-1.5 text-xs text-gray-500">
                <span className="w-2.5 h-2.5 rounded-sm" style={{ background: color }} />
                {label}
              </div>
            ))}
          </div>
        </ChartCard>
      </div>

      {/* ── Row 4: Sprint comparison table ── */}
      <ChartCard title="Sprint history" sub="Last 6 sprints at a glance">
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-surface-border">
                {["Sprint", "Planned pts", "Completed pts", "Velocity", "Bugs reported", "Bugs fixed", "Completion"].map((h) => (
                  <th key={h} className="text-left py-2.5 pr-6 text-[10px] font-semibold text-gray-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-surface-border">
              {[
                { sprint: "Sprint 14", planned: 45, completed: 34, bugs: 7, fixed: 4 },
                { sprint: "Sprint 13", planned: 42, completed: 40, bugs: 5, fixed: 5 },
                { sprint: "Sprint 12", planned: 40, completed: 38, bugs: 6, fixed: 6 },
                { sprint: "Sprint 11", planned: 38, completed: 30, bugs: 8, fixed: 5 },
                { sprint: "Sprint 10", planned: 35, completed: 33, bugs: 4, fixed: 4 },
                { sprint: "Sprint 9",  planned: 32, completed: 28, bugs: 3, fixed: 2 },
              ].map((row, i) => {
                const pct = Math.round((row.completed / row.planned) * 100)
                return (
                  <tr key={i} className={cn("hover:bg-surface-secondary transition-colors", i === 0 && "bg-brand-50/40")}>
                    <td className="py-3 pr-6 font-medium text-gray-900">
                      {row.sprint}
                      {i === 0 && <span className="ml-2 badge-blue text-[9px] px-1.5 py-0.5">Active</span>}
                    </td>
                    <td className="py-3 pr-6 text-gray-600">{row.planned}</td>
                    <td className="py-3 pr-6 text-gray-600">{row.completed}</td>
                    <td className="py-3 pr-6">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-surface-tertiary rounded-full overflow-hidden">
                          <div
                            className="h-full rounded-full"
                            style={{
                              width: `${pct}%`,
                              background: pct >= 90 ? "#10b96a" : pct >= 75 ? "#EF9F27" : "#E24B4A"
                            }}
                          />
                        </div>
                        <span className={cn(
                          "font-medium",
                          pct >= 90 ? "text-brand-600" : pct >= 75 ? "text-amber-600" : "text-red-500"
                        )}>
                          {row.completed} pts
                        </span>
                      </div>
                    </td>
                    <td className="py-3 pr-6 text-gray-600">{row.bugs}</td>
                    <td className="py-3 pr-6 text-gray-600">{row.fixed}</td>
                    <td className="py-3 pr-6">
                      <span className={cn(
                        "badge text-[10px]",
                        pct >= 90 ? "badge-green" : pct >= 75 ? "badge-amber" : "badge-red"
                      )}>
                        {pct}%
                      </span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </ChartCard>

    </div>
  )
}