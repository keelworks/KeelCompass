import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AdminUser, KcRole, RoleMapping } from "../utils/types";
import { createRoleMapping, deleteRoleMapping, getAdminUsers, getMe, getRoleMappings } from "../utils/store";
import MainLayout from "../components/wrappers/MainLayout";

const ROLE_OPTIONS: KcRole[] = ["admin", "manager", "staff", "viewer"];

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

const Admin = () => {
  const navigate = useNavigate();
  const [mappings, setMappings] = useState<RoleMapping[]>([]);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [newTag, setNewTag] = useState("");
  const [newRole, setNewRole] = useState<KcRole>("viewer");
  const [error, setError] = useState("");

  const loadMappings = async () => setMappings(await getRoleMappings());
  const loadUsers = async () => setUsers(await getAdminUsers());

  useEffect(() => {
    // client-side convenience only - the actual enforcement is the backend's requireRole('admin')
    getMe()
      .then((me) => {
        if (!me.roles?.includes("admin")) navigate("/dashboard", { replace: true });
      })
      .catch(() => navigate("/dashboard", { replace: true }));
    loadMappings();
    loadUsers();
  }, []);

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
    } catch (err: any) {
      setError(err?.response?.data?.message || "Couldn't save that mapping.");
    }
  };

  const handleDeleteMapping = async (id: number) => {
    await deleteRoleMapping(id);
    await loadMappings();
    await loadUsers();
  };

  return (
    <MainLayout>
      <div className="col-span-1 lg:col-span-3 space-y-6">
        {/* Role Mappings */}
        <div className="shadow-md rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
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
                className="rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:border-teal-600"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
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
                      <td className="py-2 pr-4 text-gray-900 dark:text-gray-100 font-mono">{mapping.tag}</td>
                      <td className="py-2 pr-4">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${roleBadgeClass(mapping.role)}`}>
                          {mapping.role}
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
        </div>

        {/* Users */}
        <div className="shadow-md rounded-lg p-6 bg-gray-50 dark:bg-gray-800">
          <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100 mb-4">
            Users
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead>
                <tr className="text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
                  <th className="py-2 pr-4">Email</th>
                  <th className="py-2 pr-4">Username</th>
                  <th className="py-2 pr-4">Google tag</th>
                  <th className="py-2">Roles</th>
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
                    <td className="py-2">
                      <div className="flex flex-wrap gap-1">
                        {user.roles.map((role) => (
                          <span key={role} className={`px-2 py-1 rounded text-xs font-medium ${roleBadgeClass(role)}`}>
                            {role}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
