import { useState } from "react"
import {
  User, Lock, Bell, Palette, Building2,
  Plug, ScrollText, Github, Slack, Webhook,
  Save, Eye, EyeOff, Check, AlertTriangle,
  Upload, Trash2, Shield,
  Monitor, Moon, Sun, Mail,
} from "lucide-react"
import { cn } from "../lib/utils"
import { useAuthStore } from "../store/authStore"
import { ROLE_LABELS, ROLE_BADGE } from "../data/mockTeam"

// ─── Types ────────────────────────────────────────────────────────────────────
type SettingsSection =
  | "profile" | "security" | "notifications" | "appearance"
  | "workspace" | "members-roles" | "integrations" | "audit-log"
  | "github" | "slack" | "webhooks"

// ─── Toggle ───────────────────────────────────────────────────────────────────
function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={cn(
        "relative w-9 h-5 rounded-full transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-1 flex-shrink-0",
        checked ? "bg-brand-600" : "bg-gray-200"
      )}
    >
      <span
        className={cn(
          "absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200",
          checked && "translate-x-4"
        )}
      />
    </button>
  )
}

// ─── Nav item ─────────────────────────────────────────────────────────────────
function NavItem({
  icon: Icon, label, active, onClick,
}: {
  id: SettingsSection
  icon: React.ElementType
  label: string
  active: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-2.5 w-full px-3 py-2 rounded-lg text-sm transition-all duration-150 text-left",
        active
          ? "bg-brand-50 text-brand-700 font-medium"
          : "text-gray-600 hover:bg-surface-tertiary hover:text-gray-900"
      )}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      {label}
    </button>
  )
}

// ─── Section card ─────────────────────────────────────────────────────────────
function SectionCard({
  title, description, children,
}: {
  title: string
  description?: string
  children: React.ReactNode
}) {
  return (
    <div className="card overflow-hidden">
      <div className="px-5 py-4 border-b border-surface-border">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <div className="px-5 py-4">{children}</div>
    </div>
  )
}

// ─── Toggle row ───────────────────────────────────────────────────────────────
function ToggleRow({
  label, description, checked, onChange,
}: {
  label: string
  description?: string
  checked: boolean
  onChange: (v: boolean) => void
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-3 border-b border-surface-border last:border-none last:pb-0 first:pt-0">
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-500 mt-0.5">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  )
}

// ─── Field row ────────────────────────────────────────────────────────────────
function FieldRow({
  label, hint, children,
}: {
  label: string
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="grid grid-cols-[160px_1fr] gap-4 items-start py-3 border-b border-surface-border last:border-none last:pb-0 first:pt-0">
      <div>
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {hint && <p className="text-xs text-gray-400 mt-0.5">{hint}</p>}
      </div>
      <div>{children}</div>
    </div>
  )
}

// ─── Save bar ─────────────────────────────────────────────────────────────────
function SaveBar({
  onSave, onDiscard, saving, saved,
}: {
  onSave: () => void
  onDiscard: () => void
  saving: boolean
  saved: boolean
}) {
  return (
    <div className="flex items-center justify-between gap-4 pt-4 border-t border-surface-border mt-2">
      {saved && (
        <div className="flex items-center gap-1.5 text-xs text-brand-600 animate-fade-in">
          <Check className="w-3.5 h-3.5" /> Changes saved
        </div>
      )}
      <div className="flex items-center gap-2 ml-auto">
        <button onClick={onDiscard} className="btn-secondary btn-sm">
          Discard
        </button>
        <button onClick={onSave} disabled={saving} className="btn-primary btn-sm gap-1.5">
          {saving ? (
            <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          Save changes
        </button>
      </div>
    </div>
  )
}

// ─── Profile section ──────────────────────────────────────────────────────────
function ProfileSection() {
  const user = useAuthStore((s) => s.user)
  const [name, setName]         = useState(user?.name ?? "")
  const [jobTitle, setJobTitle] = useState(user?.jobTitle ?? "")
  const [email]                 = useState(user?.email ?? "")
  const [timezone, setTimezone] = useState("Asia/Kolkata")
  const [saving, setSaving]     = useState(false)
  const [saved, setSaved]       = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 900))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-5">
      <SectionCard
        title="Personal information"
        description="Your name and profile details visible to teammates"
      >
        <div>
          {/* Avatar */}
          <div className="flex items-center gap-4 mb-5">
            <div className="relative">
              <div className="w-16 h-16 rounded-2xl bg-brand-100 text-brand-700 flex items-center justify-center text-xl font-semibold">
                {user?.initials}
              </div>
              <button className="absolute -bottom-1 -right-1 w-6 h-6 bg-white border border-surface-border rounded-lg flex items-center justify-center shadow-card hover:bg-surface-secondary transition-colors">
                <Upload className="w-3 h-3 text-gray-500" />
              </button>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">Profile photo</p>
              <p className="text-xs text-gray-500 mt-0.5">JPG, PNG or GIF · Max 2MB</p>
              <button className="text-xs text-brand-600 hover:text-brand-700 mt-1 font-medium">
                Upload new photo
              </button>
            </div>
          </div>

          <FieldRow label="Full name">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input"
              placeholder="Your full name"
            />
          </FieldRow>
          <FieldRow label="Job title" hint="Shown on your profile card">
            <input
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              className="input"
              placeholder="e.g. Senior Developer"
            />
          </FieldRow>
          <FieldRow label="Email" hint="Used for notifications and login">
            <div className="flex items-center gap-2">
              <input
                value={email}
                disabled
                className="input bg-surface-tertiary text-gray-500 flex-1"
              />
              <span className="badge-green text-[10px] flex-shrink-0">Verified</span>
            </div>
          </FieldRow>
          <FieldRow label="Role" hint="Your role in the organisation">
            <div className="flex items-center gap-2">
              <span className={cn("badge text-xs", user?.role ? ROLE_BADGE[user.role] : "badge-gray")}>
                {user?.role ? ROLE_LABELS[user.role] : "Unknown"}
              </span>
              <span className="text-xs text-gray-400">(set by your Org Admin)</span>
            </div>
          </FieldRow>
          <FieldRow label="Timezone">
            <select
              value={timezone}
              onChange={(e) => setTimezone(e.target.value)}
              className="input"
            >
              <option value="Asia/Kolkata">Asia/Kolkata (IST +05:30)</option>
              <option value="UTC">UTC +00:00</option>
              <option value="America/New_York">America/New_York (EST -05:00)</option>
              <option value="Europe/London">Europe/London (GMT +00:00)</option>
              <option value="Asia/Singapore">Asia/Singapore (SGT +08:00)</option>
            </select>
          </FieldRow>
        </div>
        <SaveBar onSave={handleSave} onDiscard={() => {}} saving={saving} saved={saved} />
      </SectionCard>
    </div>
  )
}

// ─── Security section ─────────────────────────────────────────────────────────
function SecuritySection() {
  const [current,    setCurrent]  = useState("")
  const [newPass,    setNewPass]  = useState("")
  const [confirm,    setConfirm]  = useState("")
  const [showCurr,   setShowCurr] = useState(false)
  const [showNew,    setShowNew]  = useState(false)
  const [saving,     setSaving]   = useState(false)
  const [saved,      setSaved]    = useState(false)
  const [mfaEnabled, setMfa]      = useState(false)

  const passMatch  = newPass === confirm
  const passStrong = newPass.length >= 8

  const handleSave = async () => {
    if (!passMatch || !passStrong) return
    setSaving(true)
    await new Promise((r) => setTimeout(r, 900))
    setSaving(false)
    setSaved(true)
    setCurrent("")
    setNewPass("")
    setConfirm("")
    setTimeout(() => setSaved(false), 3000)
  }

  const strength = [
    newPass.length >= 8,
    /[A-Z]/.test(newPass),
    /[0-9]/.test(newPass),
    /[^A-Za-z0-9]/.test(newPass),
  ].filter(Boolean).length

  return (
    <div className="space-y-5">
      <SectionCard
        title="Change password"
        description="Use a strong password with at least 8 characters"
      >
        <FieldRow label="Current password">
          <div className="relative">
            <input
              type={showCurr ? "text" : "password"}
              value={current}
              onChange={(e) => setCurrent(e.target.value)}
              placeholder="Your current password"
              className="input pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurr(!showCurr)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurr ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </FieldRow>

        <FieldRow label="New password">
          <div className="space-y-2">
            <div className="relative">
              <input
                type={showNew ? "text" : "password"}
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
                placeholder="New password (min 8 chars)"
                className={cn("input pr-10", newPass && !passStrong && "input-error")}
              />
              <button
                type="button"
                onClick={() => setShowNew(!showNew)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNew ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
            {newPass && (
              <div className="flex gap-1">
                {[1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className={cn(
                      "h-1 flex-1 rounded-full transition-all",
                      i <= strength
                        ? strength <= 1 ? "bg-red-400"
                          : strength <= 2 ? "bg-amber-400"
                          : strength <= 3 ? "bg-yellow-400"
                          : "bg-brand-500"
                        : "bg-surface-border"
                    )}
                  />
                ))}
              </div>
            )}
          </div>
        </FieldRow>

        <FieldRow label="Confirm password">
          <div className="space-y-1">
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Re-enter new password"
              className={cn("input", confirm && !passMatch && "input-error")}
            />
            {confirm && !passMatch && (
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" /> Passwords do not match
              </p>
            )}
          </div>
        </FieldRow>

        <SaveBar
          onSave={handleSave}
          onDiscard={() => { setCurrent(""); setNewPass(""); setConfirm("") }}
          saving={saving}
          saved={saved}
        />
      </SectionCard>

      <SectionCard
        title="Two-factor authentication"
        description="Add an extra layer of security to your account"
      >
        <ToggleRow
          label="Enable 2FA"
          description="Require a verification code when signing in from a new device"
          checked={mfaEnabled}
          onChange={setMfa}
        />
        {mfaEnabled && (
          <div className="mt-3 p-3 bg-brand-50 border border-brand-200 rounded-xl text-xs text-brand-700 animate-fade-in">
            2FA is enabled. You will be prompted for a code on new sign-ins.
          </div>
        )}
      </SectionCard>

      <SectionCard
        title="Active sessions"
        description="Devices currently signed into your account"
      >
        {[
          { device: "Chrome on Windows 11", location: "Kochi, IN",  time: "Now · Current session", current: true  },
          { device: "Safari on iPhone 14",  location: "Kochi, IN",  time: "2 hours ago",            current: false },
          { device: "Firefox on MacBook",   location: "Mumbai, IN", time: "Yesterday",              current: false },
        ].map((session) => (
          <div
            key={session.device}
            className="flex items-center justify-between py-3 border-b border-surface-border last:border-none last:pb-0 first:pt-0"
          >
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-surface-secondary flex items-center justify-center">
                <Monitor className="w-4 h-4 text-gray-400" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-gray-900">{session.device}</p>
                  {session.current && (
                    <span className="badge-green text-[10px]">Current</span>
                  )}
                </div>
                <p className="text-xs text-gray-400">
                  {session.location} · {session.time}
                </p>
              </div>
            </div>
            {!session.current && (
              <button className="text-xs text-red-500 hover:text-red-700 font-medium transition-colors">
                Revoke
              </button>
            )}
          </div>
        ))}
      </SectionCard>
    </div>
  )
}

// ─── Notifications section ────────────────────────────────────────────────────
function NotificationsSection() {
  const [prefs, setPrefs] = useState({
    taskAssigned:     true,
    taskDue:          true,
    taskOverdue:      true,
    mentioned:        true,
    commentOnMyTask:  true,
    bugCritical:      true,
    bugAssigned:      true,
    bugFixed:         false,
    sprintStart:      true,
    sprintEnd:        true,
    memberInvited:    false,
    dailyDigest:      false,
    weeklyReport:     true,
  })
  const [saving, setSaving] = useState(false)
  const [saved,  setSaved]  = useState(false)

  const toggle = (key: keyof typeof prefs) =>
    setPrefs((p) => ({ ...p, [key]: !p[key] }))

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const groups: {
    title: string
    rows: { key: keyof typeof prefs; label: string; desc: string }[]
  }[] = [
    {
      title: "Tasks",
      rows: [
        { key: "taskAssigned",    label: "Task assigned to me",            desc: "Email + in-app"        },
        { key: "taskDue",         label: "Task due in 24 hours",           desc: "In-app only"           },
        { key: "taskOverdue",     label: "Task is overdue",                desc: "Email + in-app"        },
        { key: "mentioned",       label: "Mentioned in a comment",         desc: "Email + in-app"        },
        { key: "commentOnMyTask", label: "New comment on my task",         desc: "In-app only"           },
      ],
    },
    {
      title: "Bugs",
      rows: [
        { key: "bugCritical",     label: "Critical bug reported",          desc: "Email + in-app"        },
        { key: "bugAssigned",     label: "Bug assigned to me",             desc: "Email + in-app"        },
        { key: "bugFixed",        label: "Bug I reported is marked fixed", desc: "In-app only"           },
      ],
    },
    {
      title: "Sprints and team",
      rows: [
        { key: "sprintStart",     label: "Sprint starting tomorrow",       desc: "Email"                 },
        { key: "sprintEnd",       label: "Sprint ending in 2 days",        desc: "Email + in-app"        },
        { key: "memberInvited",   label: "New member joined org",          desc: "In-app only"           },
      ],
    },
    {
      title: "Digests",
      rows: [
        { key: "dailyDigest",     label: "Daily activity digest",          desc: "Email · 8am every day" },
        { key: "weeklyReport",    label: "Weekly sprint report",           desc: "Email · Every Monday"  },
      ],
    },
  ]

  return (
    <div className="space-y-5">
      {groups.map(({ title, rows }) => (
        <SectionCard key={title} title={title}>
          {rows.map(({ key, label, desc }) => (
            <ToggleRow
              key={key}
              label={label}
              description={desc}
              checked={prefs[key]}
              onChange={() => toggle(key)}
            />
          ))}
        </SectionCard>
      ))}
      <SaveBar onSave={handleSave} onDiscard={() => {}} saving={saving} saved={saved} />
    </div>
  )
}

// ─── Appearance section ───────────────────────────────────────────────────────
function AppearanceSection() {
  const [theme,    setTheme]    = useState<"light" | "dark" | "system">("light")
  const [density,  setDensity]  = useState<"comfortable" | "compact">("comfortable")
  const [language, setLanguage] = useState("en")
  const [saving,   setSaving]   = useState(false)
  const [saved,    setSaved]    = useState(false)

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 700))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-5">
      <SectionCard title="Theme" description="Choose how ProjectFlow looks for you">
        <div className="grid grid-cols-3 gap-3">
          {(
            [
              { id: "light",  icon: Sun,     label: "Light"  },
              { id: "dark",   icon: Moon,    label: "Dark"   },
              { id: "system", icon: Monitor, label: "System" },
            ] as { id: "light" | "dark" | "system"; icon: React.ElementType; label: string }[]
          ).map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              onClick={() => setTheme(id)}
              className={cn(
                "flex flex-col items-center gap-2.5 p-4 rounded-xl border-2 transition-all",
                theme === id
                  ? "border-brand-500 bg-brand-50"
                  : "border-surface-border hover:border-surface-border-strong"
              )}
            >
              <div className={cn(
                "w-10 h-10 rounded-xl flex items-center justify-center",
                theme === id ? "bg-brand-100 text-brand-700" : "bg-surface-tertiary text-gray-400"
              )}>
                <Icon className="w-5 h-5" />
              </div>
              <span className={cn(
                "text-xs font-medium",
                theme === id ? "text-brand-700" : "text-gray-600"
              )}>
                {label}
              </span>
              {theme === id && (
                <span className="w-4 h-4 rounded-full bg-brand-500 flex items-center justify-center">
                  <Check className="w-2.5 h-2.5 text-white" />
                </span>
              )}
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Density" description="Control how much information is displayed at once">
        <div className="grid grid-cols-2 gap-3">
          {(
            [
              { id: "comfortable", label: "Comfortable", desc: "More spacing, easier to read" },
              { id: "compact",     label: "Compact",     desc: "More content, less spacing"   },
            ] as { id: "comfortable" | "compact"; label: string; desc: string }[]
          ).map(({ id, label, desc }) => (
            <button
              key={id}
              onClick={() => setDensity(id)}
              className={cn(
                "text-left p-4 rounded-xl border-2 transition-all",
                density === id
                  ? "border-brand-500 bg-brand-50"
                  : "border-surface-border hover:border-surface-border-strong"
              )}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={cn(
                  "text-sm font-medium",
                  density === id ? "text-brand-700" : "text-gray-800"
                )}>
                  {label}
                </span>
                {density === id && <Check className="w-3.5 h-3.5 text-brand-600" />}
              </div>
              <p className="text-xs text-gray-500">{desc}</p>
            </button>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Language and region">
        <FieldRow label="Language">
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="input"
          >
            <option value="en">English (US)</option>
            <option value="en-gb">English (UK)</option>
            <option value="hi">Hindi</option>
            <option value="de">Deutsch</option>
            <option value="fr">Francais</option>
          </select>
        </FieldRow>
      </SectionCard>

      <SaveBar onSave={handleSave} onDiscard={() => {}} saving={saving} saved={saved} />
    </div>
  )
}

// ─── Workspace section ────────────────────────────────────────────────────────
function WorkspaceSection() {
  const [orgName,       setOrgName]       = useState("Acme Corporation")
  const [slug,          setSlug]          = useState("acme-corp")
  const [saving,        setSaving]        = useState(false)
  const [saved,         setSaved]         = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState("")

  const handleSave = async () => {
    setSaving(true)
    await new Promise((r) => setTimeout(r, 800))
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  return (
    <div className="space-y-5">
      <SectionCard title="Organisation details">
        <div className="flex items-center gap-4 mb-5">
          <div className="w-14 h-14 rounded-2xl bg-brand-600 flex items-center justify-center text-white text-xl font-bold">
            A
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">Organisation logo</p>
            <p className="text-xs text-gray-500 mt-0.5">PNG or SVG · Recommended 128x128px</p>
            <button className="text-xs text-brand-600 hover:text-brand-700 mt-1 font-medium">
              Upload logo
            </button>
          </div>
        </div>

        <FieldRow label="Organisation name">
          <input
            value={orgName}
            onChange={(e) => setOrgName(e.target.value)}
            className="input"
          />
        </FieldRow>
        <FieldRow label="URL slug" hint="Used in your workspace URL">
          <div className="flex items-center">
            <span className="flex items-center h-9 px-3 bg-surface-tertiary border border-r-0 border-surface-border rounded-l-lg text-xs text-gray-500 whitespace-nowrap">
              app.projectflow.io/
            </span>
            <input
              value={slug}
              onChange={(e) =>
                setSlug(e.target.value.toLowerCase().replace(/\s+/g, "-"))
              }
              className="input rounded-l-none flex-1"
            />
          </div>
        </FieldRow>
        <FieldRow label="Default visibility">
          <select className="input">
            <option>Private</option>
            <option>Internal</option>
            <option>Public</option>
          </select>
        </FieldRow>

        <SaveBar onSave={handleSave} onDiscard={() => {}} saving={saving} saved={saved} />
      </SectionCard>

      {/* Danger zone */}
      <div className="card border-red-200 overflow-hidden">
        <div className="px-5 py-4 border-b border-red-100 bg-red-50">
          <h3 className="text-sm font-semibold text-red-900">Danger zone</h3>
          <p className="text-xs text-red-600 mt-0.5">
            These actions are irreversible. Please proceed with caution.
          </p>
        </div>
        <div className="px-5 py-4 space-y-4">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-gray-900">Export all data</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Download a complete backup of all your organisation data
              </p>
            </div>
            <button className="btn-secondary btn-sm flex-shrink-0">Export ZIP</button>
          </div>

          <div className="h-px bg-surface-border" />

          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-sm font-medium text-red-900">Delete organisation</p>
              <p className="text-xs text-gray-500 mt-0.5">
                Permanently delete all projects, tasks, and members. Cannot be undone.
              </p>
            </div>
            <button className="btn-danger btn-sm flex-shrink-0">Delete org</button>
          </div>

          <div className="space-y-2">
            <p className="text-xs text-gray-500">
              Type{" "}
              <code className="bg-surface-tertiary px-1 py-0.5 rounded text-red-600 font-mono">
                {slug}
              </code>{" "}
              to confirm deletion
            </p>
            <div className="flex items-center gap-2">
              <input
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
                placeholder="Type the slug to confirm..."
                className="input flex-1 text-sm"
              />
              <button
                disabled={deleteConfirm !== slug}
                className="btn-danger btn-sm flex-shrink-0 disabled:opacity-30"
              >
                <Trash2 className="w-3.5 h-3.5" /> Confirm
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Audit log section ────────────────────────────────────────────────────────
function AuditLogSection() {
  const logs = [
    { actor: "Sarah Patel",    action: "Invited",          target: "arjun@acmecorp.com",        time: "Mar 18, 14:32", type: "invite"  },
    { actor: "Sarah Patel",    action: "Changed role",     target: "John Developer",             time: "Mar 17, 10:15", type: "role"    },
    { actor: "Rajan Kumar",    action: "Created project",  target: "API Gateway",                time: "Mar 15, 09:00", type: "project" },
    { actor: "John Developer", action: "Deleted task",     target: "EC-055 Old UI draft",        time: "Mar 14, 16:45", type: "delete"  },
    { actor: "Sarah Patel",    action: "Archived",         target: "Design System v1",           time: "Mar 12, 11:30", type: "archive" },
    { actor: "Priya QA",       action: "Exported",         target: "Bug report CSV",             time: "Mar 11, 15:20", type: "export"  },
    { actor: "Sarah Patel",    action: "Removed member",   target: "Old Contractor",             time: "Mar 10, 09:45", type: "remove"  },
  ]

  const typeStyle: Record<string, string> = {
    invite:  "bg-blue-100 text-blue-700",
    role:    "bg-purple-100 text-purple-700",
    project: "bg-brand-100 text-brand-700",
    delete:  "bg-red-100 text-red-700",
    archive: "bg-amber-100 text-amber-700",
    export:  "bg-gray-100 text-gray-600",
    remove:  "bg-red-100 text-red-700",
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-500">Showing last 30 days of activity</p>
        <button className="btn-secondary btn-sm gap-1.5">
          <Save className="w-3.5 h-3.5" /> Export log
        </button>
      </div>
      <div className="card overflow-hidden">
        <div className="grid grid-cols-[1fr_1.4fr_90px_130px] gap-3 px-5 py-3 bg-surface-secondary border-b border-surface-border">
          {["Actor", "Action", "Type", "Time"].map((h) => (
            <div
              key={h}
              className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider"
            >
              {h}
            </div>
          ))}
        </div>
        <div className="divide-y divide-surface-border">
          {logs.map((log, i) => (
            <div
              key={i}
              className="grid grid-cols-[1fr_1.4fr_90px_130px] gap-3 px-5 py-3 hover:bg-surface-secondary transition-colors items-center"
            >
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-lg bg-brand-100 text-brand-700 text-[9px] font-semibold flex items-center justify-center flex-shrink-0">
                  {log.actor
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <span className="text-sm text-gray-800 truncate">{log.actor}</span>
              </div>
              <div className="min-w-0">
                <span className="text-sm font-medium text-gray-900">{log.action} </span>
                <span className="text-sm text-gray-500 truncate">{log.target}</span>
              </div>
              <span className={cn("badge text-[10px] w-fit", typeStyle[log.type])}>
                {log.type}
              </span>
              <span className="text-xs text-gray-400">{log.time}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ─── Integrations section ─────────────────────────────────────────────────────
function IntegrationsSection() {
  const [githubConnected, setGithub] = useState(true)
  const [slackConnected,  setSlack]  = useState(false)
  const [tokenVisible,    setTokenVisible] = useState(false)

  const cards = [
    {
      name: "GitHub",
      icon: Github,
      desc: "Link pull requests and commits to tasks. Auto-move tasks when PRs are merged.",
      connected: githubConnected,
      toggle: () => setGithub(!githubConnected),
      detail: githubConnected ? "Connected as @johndev · 4 repos linked" : undefined,
      color: "bg-gray-900 text-white",
    },
    {
      name: "Slack",
      icon: Slack,
      desc: "Send task and bug notifications to Slack channels. @mention sync.",
      connected: slackConnected,
      toggle: () => setSlack(!slackConnected),
      detail: slackConnected ? "Connected to #projectflow-alerts" : undefined,
      color: "bg-purple-700 text-white",
    },
    {
      name: "Webhooks",
      icon: Webhook,
      desc: "Send HTTP POST requests to any URL when events occur in ProjectFlow.",
      connected: false,
      toggle: () => {},
      detail: undefined,
      color: "bg-blue-600 text-white",
    },
  ]

  return (
    <div className="space-y-4">
      {cards.map(({ name, icon: Icon, desc, connected, toggle, detail, color }) => (
        <div key={name} className="card p-5">
          <div className="flex items-start gap-4">
            <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0", color)}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-gray-900">{name}</h3>
                    {connected && (
                      <span className="badge-green text-[10px]">Connected</span>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 mt-0.5 leading-relaxed">{desc}</p>
                  {detail && (
                    <p className="text-xs text-brand-600 mt-1 font-medium">{detail}</p>
                  )}
                </div>
                <button
                  onClick={toggle}
                  className={cn(
                    "btn-sm flex-shrink-0",
                    connected ? "btn-secondary" : "btn-primary"
                  )}
                >
                  {connected ? "Disconnect" : "Connect"}
                </button>
              </div>
              {connected && (
                <div className="mt-3 pt-3 border-t border-surface-border">
                  <button className="text-xs text-gray-500 hover:text-gray-700 font-medium">
                    Configure settings
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      ))}

     <SectionCard
        title="REST API access"
        description="Use the ProjectFlow API to integrate with your own tools"
      >
        <FieldRow label="API token" hint="Treat this like a password — never share it">
          <div className="flex items-center gap-2">
            <input
              type={tokenVisible ? "text" : "password"}
              value="pf_live_xxxxxxxxxxxxxxxxxxxxxxxxxxx"
              readOnly
              className="input font-mono text-xs flex-1"
            />
            <button
              onClick={() => setTokenVisible(!tokenVisible)}
              className="btn-secondary btn-sm flex-shrink-0"
            >
              {tokenVisible
                ? <EyeOff className="w-3.5 h-3.5" />
                : <Eye className="w-3.5 h-3.5" />
              }
            </button>
            <button className="btn-secondary btn-sm flex-shrink-0">
              Copy
            </button>
            <button className="btn-secondary btn-sm flex-shrink-0 text-red-500">
              Regenerate
            </button>
          </div>
        </FieldRow>
        <div className="mt-3">
          <button
            onClick={() => window.open("#", "_blank")}
            className="text-xs text-brand-600 hover:text-brand-700 font-medium"
          >
            View API documentation
          </button>
        </div>
      </SectionCard>
    </div>
  )
}
// ─── Nav config ───────────────────────────────────────────────────────────────
const NAV_GROUPS = [
  {
    label: "Account",
    items: [
      { id: "profile"       as SettingsSection, icon: User,        label: "Profile"        },
      { id: "security"      as SettingsSection, icon: Lock,        label: "Security"       },
      { id: "notifications" as SettingsSection, icon: Bell,        label: "Notifications"  },
      { id: "appearance"    as SettingsSection, icon: Palette,     label: "Appearance"     },
    ],
  },
  {
    label: "Workspace",
    items: [
      { id: "workspace"     as SettingsSection, icon: Building2,   label: "General"        },
      { id: "members-roles" as SettingsSection, icon: Shield,      label: "Members & roles" },
      { id: "integrations"  as SettingsSection, icon: Plug,        label: "Integrations"   },
      { id: "audit-log"     as SettingsSection, icon: ScrollText,  label: "Audit log"      },
    ],
  },
]

const SECTION_TITLES: Record<SettingsSection, string> = {
  "profile":        "Profile settings",
  "security":       "Security",
  "notifications":  "Notifications",
  "appearance":     "Appearance",
  "workspace":      "Workspace settings",
  "members-roles":  "Members and roles",
  "integrations":   "Integrations",
  "audit-log":      "Audit log",
  "github":         "GitHub",
  "slack":          "Slack",
  "webhooks":       "Webhooks",
}

// ─── Main page ────────────────────────────────────────────────────────────────
export default function SettingsPage() {
  const [active, setActive] = useState<SettingsSection>("profile")

  const renderSection = () => {
    switch (active) {
      case "profile":       return <ProfileSection />
      case "security":      return <SecuritySection />
      case "notifications": return <NotificationsSection />
      case "appearance":    return <AppearanceSection />
      case "workspace":     return <WorkspaceSection />
      case "audit-log":     return <AuditLogSection />
      case "integrations":  return <IntegrationsSection />
      default:
        return (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400">
            <p className="text-sm font-medium">Coming soon</p>
            <p className="text-xs mt-1">This section is under construction</p>
          </div>
        )
    }
  }

  return (
    <div className="max-w-5xl mx-auto animate-fade-in">
      <div className="mb-6">
        <h1 className="page-title">Settings</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Manage your account and workspace preferences
        </p>
      </div>

      <div className="flex gap-6 items-start">
        {/* Left nav */}
        <nav className="w-44 flex-shrink-0 space-y-5 sticky top-6">
          {NAV_GROUPS.map(({ label, items }) => (
            <div key={label}>
              <p className="section-label mb-2">{label}</p>
              <div className="space-y-0.5">
                {items.map(({ id, icon, label: itemLabel }) => (
                  <NavItem
                    key={id}
                    id={id}
                    icon={icon}
                    label={itemLabel}
                    active={active === id}
                    onClick={() => setActive(id)}
                  />
                ))}
              </div>
            </div>
          ))}
        </nav>

        {/* Content area */}
        <div className="flex-1 min-w-0">
          <div className="mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              {SECTION_TITLES[active]}
            </h2>
          </div>
          <div className="animate-fade-in" key={active}>
            {renderSection()}
          </div>
        </div>
      </div>
    </div>
  )
}