import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft } from "react-icons/fi";
import { useModalA11y } from "../utils/useModalA11y";
import { getErrorMessage } from "../utils/getErrorMessage";
import {
  AdminInsights,
  AdminUser,
  AuditLogEntry,
  DeletedQuestion,
  FeedbackEntry,
  KcRole,
  Report,
  RoleMapping,
} from "../utils/types";
import {
  createRoleMapping,
  deleteFeedback,
  deleteRoleMapping,
  dismissReport,
  getAdminInsights,
  getAdminUsers,
  getAllFeedback,
  getAuditLog,
  getDeletedQuestions,
  getMe,
  getReports,
  getRoleMappings,
  grantAdmin,
  restoreQuestion,
  revokeAdmin,
  setFeedbackRead,
  setUserTag,
} from "../utils/store";
import MainLayout from "../components/wrappers/MainLayout";
import { formatDateTime, capitalizeWords } from "../utils/format";

const ROLE_OPTIONS: KcRole[] = ["admin", "manager", "staff", "viewer"];

const capitalizeRole = (role: string) => role.charAt(0).toUpperCase() + role.slice(1);

const roleBadgeClass = (role: string) => {
  switch (role) {
    case "admin":
      return "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300";
    case "manager":
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300";
    case "staff":
      return "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300";
    default:
      return "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300";
  }
};

type AdminSection = "mappings" | "users" | "feedback" | "insights" | "reports" | "deleted" | "audit";

const Admin = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<AdminSection | null>(null);

  const [mappings, setMappings] = useState<RoleMapping[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [feedback, setFeedback] = useState<FeedbackEntry[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);
  const [newTag, setNewTag] = useState("");
  const [newRole, setNewRole] = useState<KcRole>("viewer");
  const [error, setError] = useState("");
  const [userActionError, setUserActionError] = useState("");
  const [tagInputs, setTagInputs] = useState<Record<number, string>>({});
  const [tagActionError, setTagActionError] = useState("");

  const [insights, setInsights] = useState<AdminInsights | null>(null);
  const [deletedQuestions, setDeletedQuestions] = useState<DeletedQuestion[]>([]);
  const [reports, setReports] = useState<Report[]>([]);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>([]);
  const [selectedFeedback, setSelectedFeedback] = useState<FeedbackEntry | null>(null);
  const feedbackModalRef = useRef<HTMLDivElement>(null);
  useModalA11y(!!selectedFeedback, () => setSelectedFeedback(null), feedbackModalRef);
  const [confirmingFeedbackDelete, setConfirmingFeedbackDelete] = useState(false);
  const [selectedReportKeys, setSelectedReportKeys] = useState<Set<string>>(new Set());
  const [selectedDeletedIds, setSelectedDeletedIds] = useState<Set<number>>(new Set());
  const [bulkActionError, setBulkActionError] = useState("");

  const loadMappings = async () => setMappings(await getRoleMappings());
  const loadUsers = async () => setUsers(await getAdminUsers());
  const loadFeedback = async () => setFeedback(await getAllFeedback());
  const loadInsights = async () => setInsights(await getAdminInsights());
  const loadDeletedQuestions = async () => setDeletedQuestions(await getDeletedQuestions());
  const loadReports = async () => setReports(await getReports());
  const loadAuditLog = async () => setAuditLog(await getAuditLog());

  useEffect(() => {
    // client-side convenience only - the actual enforcement is the backend's requireRole('admin')
    getMe()
      .then((me) => {
        if (!me.roles?.includes("admin")) navigate("/dashboard", { replace: true });
        setCurrentUserId(me.id);
      })
      .catch(() => navigate("/dashboard", { replace: true }));
    loadMappings();
    loadUsers();
    loadFeedback();
    loadInsights();
    loadDeletedQuestions();
    loadReports();
    loadAuditLog();
  }, []);

  const handleSetUserTag = async (userId: number) => {
    setTagActionError("");
    try {
      await setUserTag(userId, tagInputs[userId]?.trim() || null);
      await loadUsers();
    } catch (err) {
      setTagActionError(getErrorMessage(err, "Couldn't update that user's group tag."));
    }
  };

  const handleRestoreQuestion = async (id: number) => {
    await restoreQuestion(id);
    await loadDeletedQuestions();
  };

  const handleDismissReport = async (report: Report) => {
    await dismissReport(report.type, report.id);
    await loadReports();
  };

  const toggleReportSelected = (report: Report) => {
    const key = `${report.type}-${report.id}`;
    setSelectedReportKeys((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const toggleAllReportsSelected = () => {
    setSelectedReportKeys((prev) =>
      prev.size === reports.length ? new Set() : new Set(reports.map((r) => `${r.type}-${r.id}`))
    );
  };

  const handleBulkDismissReports = async () => {
    setBulkActionError("");
    try {
      const toDismiss = reports.filter((r) => selectedReportKeys.has(`${r.type}-${r.id}`));
      await Promise.all(toDismiss.map((r) => dismissReport(r.type, r.id)));
      setSelectedReportKeys(new Set());
      await loadReports();
    } catch {
      setBulkActionError("Couldn't dismiss all selected reports.");
    }
  };

  const toggleDeletedSelected = (id: number) => {
    setSelectedDeletedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleAllDeletedSelected = () => {
    setSelectedDeletedIds((prev) =>
      prev.size === deletedQuestions.length ? new Set() : new Set(deletedQuestions.map((q) => q.id))
    );
  };

  const handleBulkRestore = async () => {
    setBulkActionError("");
    try {
      await Promise.all([...selectedDeletedIds].map((id) => restoreQuestion(id)));
      setSelectedDeletedIds(new Set());
      await loadDeletedQuestions();
    } catch {
      setBulkActionError("Couldn't restore all selected posts.");
    }
  };

  const handleToggleAdmin = async (user: AdminUser) => {
    setUserActionError("");
    try {
      if (user.isManualAdmin) {
        await revokeAdmin(user.id);
      } else {
        await grantAdmin(user.id);
      }
      await loadUsers();
    } catch (err) {
      setUserActionError(getErrorMessage(err, "Couldn't update admin access."));
    }
  };

  const handleAddMapping = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!newTag.trim()) {
      setError("Enter a tag (e.g. \"Dir IT\").");
      return;
    }
    try {
      await createRoleMapping({ tag: newTag.trim(), role: newRole });
      setNewTag("");
      setNewRole("viewer");
      await loadMappings();
      await loadUsers();
    } catch (err) {
      setError(getErrorMessage(err, "Couldn't save that mapping."));
    }
  };

  const handleDeleteMapping = async (id: number) => {
    await deleteRoleMapping(id);
    await loadMappings();
    await loadUsers();
  };

  const openFeedback = (f: FeedbackEntry) => {
    setSelectedFeedback(f);
    setConfirmingFeedbackDelete(false);
  };

  const handleToggleFeedbackRead = async (f: FeedbackEntry, read: boolean) => {
    const updated = await setFeedbackRead(f.id, read);
    setFeedback((prev) => prev.map((x) => (x.id === f.id ? { ...x, read: updated.read } : x)));
    setSelectedFeedback((prev) => (prev && prev.id === f.id ? { ...prev, read: updated.read } : prev));
  };

  const handleDeleteFeedback = async (id: number) => {
    if (!confirmingFeedbackDelete) {
      setConfirmingFeedbackDelete(true);
      return;
    }
    await deleteFeedback(id);
    setFeedback((prev) => prev.filter((x) => x.id !== id));
    setSelectedFeedback(null);
    setConfirmingFeedbackDelete(false);
  };

  const unreadFeedbackCount = feedback.filter((f) => !f.read).length;

  const SECTIONS: { id: AdminSection; label: string; description: string; count?: number }[] = [
    { id: "mappings", label: "Role Mappings", description: "Map Google name tags to KeelCompass roles", count: mappings.length },
    { id: "users", label: "Users", description: "Group overrides, roles, admin access" },
    { id: "feedback", label: "Feedback", description: "Submissions from the in-app feedback form", count: unreadFeedbackCount || undefined },
    { id: "insights", label: "Insights", description: "Usage volume, response times, top tags" },
    { id: "reports", label: "Reports", description: "Reported posts and comments", count: reports.length || undefined },
    { id: "deleted", label: "Deleted Posts", description: "Soft-deleted posts, with restore", count: deletedQuestions.length || undefined },
    { id: "audit", label: "Audit Log", description: "Recent admin actions" },
  ];

  return (
    <MainLayout>
      <div className="col-span-1 lg:col-span-3">
        {activeSection === null ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {SECTIONS.map((s) => (
              <button
                key={s.id}
                type="button"
                onClick={() => setActiveSection(s.id)}
                className="text-left shadow-md rounded-lg p-6 bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-150 hover:-translate-y-[1px] hover:shadow-lg animate-card-in"
              >
                <div className="flex items-center justify-between mb-1">
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{s.label}</h2>
                  {!!s.count && (
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-teal-100 text-teal-700 dark:bg-teal-900/40 dark:text-teal-300">
                      {s.count}
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{s.description}</p>
              </button>
            ))}
          </div>
        ) : (
          <div className="shadow-md rounded-lg p-6 bg-gray-50 dark:bg-gray-800 animate-card-in">
            <button
              type="button"
              onClick={() => setActiveSection(null)}
              className="flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-150 mb-4"
            >
              <FiArrowLeft size={16} /> Back to Admin
            </button>

            {activeSection === "mappings" && (
              <>
                <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100 mb-4">
                  Role Mappings
                </h2>
                <p className="text-sm text-gray-600 dark:text-gray-300 mb-4">
                  Maps the tag in someone's Google name (e.g. <span className="font-mono">"Ahmed (SD |OPT)"</span> → <span className="font-mono">SD</span>)
                  to a KeelCompass role. Anyone whose tag isn't listed here defaults to Viewer.
                </p>

                <form onSubmit={handleAddMapping} className="flex flex-wrap items-end gap-3 mb-4">
                  <div className="flex-1 min-w-[160px]">
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Tag</label>
                    <input
                      type="text"
                      value={newTag}
                      onChange={(e) => setNewTag(e.target.value)}
                      placeholder="Dir IT"
                      className="w-full rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:border-teal-600"
                    />
                  </div>
                  <div>
                    <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1">Role</label>
                    <select
                      value={newRole}
                      onChange={(e) => setNewRole(e.target.value as KcRole)}
                      className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-gray-100 pl-3 pr-9 py-2 text-sm min-w-[140px] focus:outline-none focus:border-teal-600"
                    >
                      {ROLE_OPTIONS.map((role) => (
                        <option key={role} value={role}>
                          {capitalizeRole(role)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="rounded-md bg-teal-600 text-white px-4 py-2 text-sm font-medium hover:bg-teal-700 transition"
                  >
                    Add mapping
                  </button>
                </form>
                {error && <p className="text-sm text-red-600 dark:text-red-400 mb-4">{error}</p>}

                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th className="py-2 pr-4">Tag</th>
                        <th className="py-2 pr-4">Role</th>
                        <th className="py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {mappings.length === 0 ? (
                        <tr>
                          <td colSpan={3} className="py-4 text-gray-500 dark:text-gray-400">
                            No mappings yet.
                          </td>
                        </tr>
                      ) : (
                        mappings.map((mapping) => (
                          <tr key={mapping.id} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-2 pr-4 text-gray-900 dark:text-gray-100 font-mono uppercase tracking-wide">{capitalizeWords(mapping.tag)}</td>
                            <td className="py-2 pr-4">
                              <span className={`px-2 py-1 rounded text-xs font-medium ${roleBadgeClass(mapping.role)}`}>
                                {capitalizeRole(mapping.role)}
                              </span>
                            </td>
                            <td className="py-2 text-right">
                              <button
                                onClick={() => handleDeleteMapping(mapping.id)}
                                className="text-red-500 hover:text-red-600 text-xs"
                              >
                                Remove
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeSection === "users" && (
              <>
                <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100 mb-4">
                  Users
                </h2>
                {userActionError && (
                  <p className="text-sm text-red-600 dark:text-red-400 mb-4">{userActionError}</p>
                )}
                {tagActionError && (
                  <p className="text-sm text-red-600 dark:text-red-400 mb-4">{tagActionError}</p>
                )}
                <div className="overflow-x-auto">
                  <table className="w-full text-sm text-left">
                    <thead>
                      <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                        <th className="py-2 pr-4">Email</th>
                        <th className="py-2 pr-4">Username</th>
                        <th className="py-2 pr-4">Google tag</th>
                        <th className="py-2 pr-4">Group override</th>
                        <th className="py-2 pr-4">Roles</th>
                        <th className="py-2 pr-4">Rep.</th>
                        <th className="py-2"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user) => (
                        <tr key={user.id} className="border-b border-gray-100 dark:border-gray-700">
                          <td className="py-2 pr-4 text-gray-900 dark:text-gray-100">{user.email}</td>
                          <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">{user.username || "—"}</td>
                          <td className="py-2 pr-4 font-mono text-gray-700 dark:text-gray-300">
                            {user.raw_role_tag || "—"}
                          </td>
                          <td className="py-2 pr-4">
                            <div className="flex items-center gap-1">
                              <input
                                type="text"
                                value={tagInputs[user.id] ?? user.manual_role_tag ?? ""}
                                onChange={(e) =>
                                  setTagInputs((prev) => ({ ...prev, [user.id]: e.target.value }))
                                }
                                placeholder="(none)"
                                className="w-24 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-gray-100 px-2 py-1 text-xs focus:outline-none focus:border-teal-600"
                              />
                              <button
                                onClick={() => handleSetUserTag(user.id)}
                                className="text-xs text-teal-600 hover:text-teal-700"
                              >
                                Set
                              </button>
                            </div>
                          </td>
                          <td className="py-2 pr-4">
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map((role) => (
                                <span key={role} className={`px-2 py-1 rounded text-xs font-medium ${roleBadgeClass(role)}`}>
                                  {capitalizeRole(role)}
                                </span>
                              ))}
                            </div>
                          </td>
                          <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">{user.reputation_points}</td>
                          <td className="py-2 text-right">
                            {user.id === currentUserId ? (
                              <span className="text-xs text-gray-400">You</span>
                            ) : (
                              <button
                                onClick={() => handleToggleAdmin(user)}
                                className={`text-xs font-medium ${
                                  user.isManualAdmin
                                    ? "text-red-500 hover:text-red-600"
                                    : "text-teal-600 hover:text-teal-700"
                                }`}
                              >
                                {user.isManualAdmin ? "Revoke admin" : "Make admin"}
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}

            {activeSection === "feedback" && (
              <>
                <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100 mb-4">
                  Feedback
                </h2>
                {feedback.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No feedback submitted yet.</p>
                ) : (
                  <div className="space-y-3">
                    {feedback.map((f) => (
                      <button
                        key={f.id}
                        type="button"
                        onClick={() => openFeedback(f)}
                        className={`w-full text-left rounded-md border p-4 transition-all duration-150 hover:shadow-sm hover:-translate-y-[1px] ${
                          f.read
                            ? "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900"
                            : "border-teal-300 dark:border-teal-700 bg-teal-50/60 dark:bg-teal-900/10"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-1 gap-3">
                          <span className="text-sm font-medium text-gray-900 dark:text-gray-100 flex items-center gap-2 min-w-0">
                            {!f.read && (
                              <span className="w-2 h-2 rounded-full bg-teal-500 shrink-0" aria-label="Unread" />
                            )}
                            <span className="truncate">
                              {f.user.displayName || f.user.username} &lt;{f.user.email}&gt;
                            </span>
                          </span>
                          <span className="text-xs text-gray-400 shrink-0">{formatDateTime(f.createdAt)}</span>
                        </div>
                        <p className="text-sm text-gray-700 dark:text-gray-300 truncate">{f.message}</p>
                      </button>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === "insights" && insights && (
              <>
                <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100 mb-4">
                  Insights
                </h2>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-4">
                  <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{insights.totalQuestions}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Total posts</p>
                  </div>
                  <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{insights.unansweredCount}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Unanswered backlog</p>
                  </div>
                  <div className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4">
                    <p className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                      {insights.avgResponseTimeHours !== null ? `${insights.avgResponseTimeHours}h` : "—"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Avg. time to first response</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">Top categories</p>
                    {insights.topCategories.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No data yet.</p>
                    ) : (
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {insights.topCategories.map((c) => (
                          <li key={c.name} className="flex justify-between">
                            <span>{c.name}</span>
                            <span className="text-gray-400">{c.count}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                  <div>
                    <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">Top tags</p>
                    {insights.topTags.length === 0 ? (
                      <p className="text-sm text-gray-500 dark:text-gray-400">No data yet.</p>
                    ) : (
                      <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                        {insights.topTags.map((t) => (
                          <li key={t.tag} className="flex justify-between">
                            <span className="uppercase tracking-wide">{capitalizeWords(t.tag)}</span>
                            <span className="text-gray-400">{t.count}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-xs uppercase text-gray-500 dark:text-gray-400 mb-2">
                    Stale unanswered posts (3+ days, no replies)
                  </p>
                  {insights.staleQuestions.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">Nothing's been waiting that long. </p>
                  ) : (
                    <div className="space-y-2">
                      {insights.staleQuestions.map((q) => (
                        <button
                          key={q.id}
                          type="button"
                          onClick={() => navigate(`/questions/${q.id}`)}
                          className="w-full text-left rounded-md border border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-900/10 p-3 flex items-center justify-between gap-4 hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-colors duration-150"
                        >
                          <span className="text-sm text-gray-900 dark:text-gray-100 truncate">{q.title}</span>
                          <span className="text-xs font-medium text-amber-700 dark:text-amber-400 shrink-0">
                            {q.ageDays}d old
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            )}

            {activeSection === "reports" && (
              <>
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                  <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100">
                    Reports
                  </h2>
                  {reports.length > 0 && (
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedReportKeys.size === reports.length}
                          onChange={toggleAllReportsSelected}
                          className="w-3.5 h-3.5 accent-teal-600"
                        />
                        Select all
                      </label>
                      {selectedReportKeys.size > 0 && (
                        <button
                          type="button"
                          onClick={handleBulkDismissReports}
                          className="text-xs font-medium px-3 py-1.5 rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-all duration-150 active:scale-95"
                        >
                          Dismiss {selectedReportKeys.size} selected
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {bulkActionError && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{bulkActionError}</p>}
                {reports.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No open reports.</p>
                ) : (
                  <div className="space-y-3">
                    {reports.map((r) => {
                      const key = `${r.type}-${r.id}`;
                      return (
                        <div
                          key={key}
                          className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-4 flex items-center gap-3"
                        >
                          <input
                            type="checkbox"
                            checked={selectedReportKeys.has(key)}
                            onChange={() => toggleReportSelected(r)}
                            className="w-4 h-4 accent-teal-600 shrink-0"
                          />
                          <div className="flex-1 min-w-0">
                            <span className="text-xs uppercase text-gray-400">{r.type}</span>
                            <p className="text-sm text-gray-900 dark:text-gray-100">{r.preview}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Reported by {r.reportedBy.username || r.reportedBy.email} on {formatDateTime(r.createdAt)}
                            </p>
                          </div>
                          <button
                            onClick={() => handleDismissReport(r)}
                            className="text-xs text-teal-600 hover:text-teal-700 shrink-0"
                          >
                            Dismiss
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </>
            )}

            {activeSection === "deleted" && (
              <>
                <div className="flex items-center justify-between mb-4 gap-3 flex-wrap">
                  <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100">
                    Deleted Posts
                  </h2>
                  {deletedQuestions.length > 0 && (
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 text-xs text-gray-500 dark:text-gray-400 cursor-pointer select-none">
                        <input
                          type="checkbox"
                          checked={selectedDeletedIds.size === deletedQuestions.length}
                          onChange={toggleAllDeletedSelected}
                          className="w-3.5 h-3.5 accent-teal-600"
                        />
                        Select all
                      </label>
                      {selectedDeletedIds.size > 0 && (
                        <button
                          type="button"
                          onClick={handleBulkRestore}
                          className="text-xs font-medium px-3 py-1.5 rounded-md bg-teal-600 text-white hover:bg-teal-700 transition-all duration-150 active:scale-95"
                        >
                          Restore {selectedDeletedIds.size} selected
                        </button>
                      )}
                    </div>
                  )}
                </div>
                {bulkActionError && <p className="text-sm text-red-600 dark:text-red-400 mb-3">{bulkActionError}</p>}
                {deletedQuestions.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">Nothing's been deleted.</p>
                ) : (
                  <div className="space-y-2">
                    {deletedQuestions.map((q) => (
                      <div
                        key={q.id}
                        className="rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 p-3 flex items-center gap-3"
                      >
                        <input
                          type="checkbox"
                          checked={selectedDeletedIds.has(q.id)}
                          onChange={() => toggleDeletedSelected(q.id)}
                          className="w-4 h-4 accent-teal-600 shrink-0"
                        />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900 dark:text-gray-100">{q.title}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            By {q.user.username || q.user.email} - deleted {formatDateTime(q.deletedAt)}
                          </p>
                        </div>
                        <button
                          onClick={() => handleRestoreQuestion(q.id)}
                          className="text-xs text-teal-600 hover:text-teal-700 shrink-0"
                        >
                          Restore
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {activeSection === "audit" && (
              <>
                <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100 mb-4">
                  Audit Log
                </h2>
                {auditLog.length === 0 ? (
                  <p className="text-sm text-gray-500 dark:text-gray-400">No admin actions recorded yet.</p>
                ) : (
                  <div className="overflow-x-auto max-h-[70vh] overflow-y-auto">
                    <table className="w-full text-sm text-left">
                      <thead>
                        <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                          <th className="py-2 pr-4">When</th>
                          <th className="py-2 pr-4">Admin</th>
                          <th className="py-2 pr-4">Action</th>
                          <th className="py-2">Details</th>
                        </tr>
                      </thead>
                      <tbody>
                        {auditLog.map((entry) => (
                          <tr key={entry.id} className="border-b border-gray-100 dark:border-gray-700">
                            <td className="py-2 pr-4 text-gray-500 dark:text-gray-400 whitespace-nowrap">
                              {formatDateTime(entry.createdAt)}
                            </td>
                            <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">
                              {entry.admin.displayName || entry.admin.username || entry.admin.email}
                            </td>
                            <td className="py-2 pr-4 text-gray-900 dark:text-gray-100 font-mono">{entry.action}</td>
                            <td className="py-2 text-gray-500 dark:text-gray-400 truncate max-w-xs">
                              {entry.details ? JSON.stringify(entry.details) : "—"}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      {/* Feedback detail popup */}
      {selectedFeedback && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div
            className="fixed inset-0 bg-black bg-opacity-30 animate-backdrop-in"
            onClick={() => setSelectedFeedback(null)}
          />
          <div
            ref={feedbackModalRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="feedback-detail-title"
            tabIndex={-1}
            className="relative z-50 w-[min(520px,92vw)] max-h-[80vh] overflow-y-auto bg-white dark:bg-gray-900 rounded-lg shadow-xl p-6 animate-modal-in focus:outline-none"
          >
            <div className="flex items-start justify-between gap-4 mb-3">
              <div className="min-w-0">
                <p id="feedback-detail-title" className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {selectedFeedback.user.displayName || selectedFeedback.user.username} &lt;{selectedFeedback.user.email}&gt;
                </p>
                <p className="text-xs text-gray-400">{formatDateTime(selectedFeedback.createdAt)}</p>
              </div>
              <button
                onClick={() => setSelectedFeedback(null)}
                aria-label="Close"
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors duration-150 shrink-0"
              >
                ✕
              </button>
            </div>
            <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap mb-5">
              {selectedFeedback.message}
            </p>
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer select-none">
                <input
                  type="checkbox"
                  checked={selectedFeedback.read}
                  onChange={(e) => handleToggleFeedbackRead(selectedFeedback, e.target.checked)}
                  className="w-4 h-4 accent-teal-600"
                />
                Read
              </label>
              <button
                onClick={() => handleDeleteFeedback(selectedFeedback.id)}
                onBlur={() => setConfirmingFeedbackDelete(false)}
                className={`text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-150 active:scale-95 ${
                  confirmingFeedbackDelete
                    ? "bg-red-600 text-white hover:bg-red-700"
                    : "text-red-500 hover:text-red-600"
                }`}
              >
                {confirmingFeedbackDelete ? "Click again to confirm" : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </MainLayout>
  );
};

export default Admin;
