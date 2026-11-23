import { useEffect, useState } from "react";
import { getMe, completeProfile } from "../utils/store";
import { User } from "../utils/types";
import { getErrorMessage } from "../utils/getErrorMessage";
import { usePageTitle } from "../utils/usePageTitle";
import { useToast } from "../utils/useToast";
import MainLayout from "../components/wrappers/MainLayout";
import Button from "../components/ui/Button";
import { Skeleton } from "../components/ui/Skeleton";

const ROLE_BADGE_CLASS: Record<string, string> = {
  admin: "bg-purple-100 text-purple-800 dark:bg-purple-900/40 dark:text-purple-300",
  manager: "bg-blue-100 text-blue-800 dark:bg-blue-900/40 dark:text-blue-300",
  staff: "bg-teal-100 text-teal-800 dark:bg-teal-900/40 dark:text-teal-300",
  viewer: "bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300",
};

const Settings = () => {
  usePageTitle("Settings");
  const { showError, showSuccess, toastNode } = useToast();
  const [user, setUser] = useState<User | null>(null);
  const [username, setUsername] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const me = await getMe();
        setUser(me);
        setUsername(me.username || "");
      } catch {
        showError("Failed to load your profile.");
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSave = async () => {
    if (!username.trim() || username.trim() === user?.username) return;
    setSaving(true);
    try {
      await completeProfile({ username: username.trim() });
      setUser((prev) => (prev ? { ...prev, username: username.trim() } : prev));
      showSuccess("Username updated.");
    } catch (error) {
      showError(getErrorMessage(error, "Failed to update your username."));
    } finally {
      setSaving(false);
    }
  };

  return (
    <MainLayout>
      <div className="col-span-1 lg:col-span-3">
        <div className="shadow-md rounded-lg p-6 bg-gray-50 dark:bg-gray-800 animate-card-in max-w-xl">
          <h2 className="text-xl font-medium uppercase tracking-wide text-gray-900 dark:text-gray-100 mb-6">
            My Profile
          </h2>

          {!user ? (
            <div className="space-y-4">
              <Skeleton className="w-16 h-16 rounded-full" />
              <Skeleton className="w-48 h-4" />
              <Skeleton className="w-32 h-4" />
            </div>
          ) : (
            <>
              <div className="flex items-center gap-4 mb-6">
                {user.picture_url ? (
                  <img
                    src={user.picture_url}
                    alt="Profile"
                    referrerPolicy="no-referrer"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 text-xl font-semibold flex items-center justify-center">
                    {(user.display_name || user.username || "?").charAt(0).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-base font-semibold text-gray-900 dark:text-gray-100">
                    {user.display_name || user.username}
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{user.email}</p>
                  {user.full_role_tag && (
                    <p className="text-xs text-gray-400 dark:text-gray-500 mt-0.5">{user.full_role_tag}</p>
                  )}
                </div>
              </div>

              {user.roles?.length > 0 && (
                <div className="mb-6">
                  <label className="block text-xs text-gray-500 dark:text-gray-400 mb-2">Roles</label>
                  <div className="flex flex-wrap gap-1.5">
                    {user.roles.map((role) => (
                      <span
                        key={role}
                        className={`px-2 py-1 rounded text-xs font-medium ${ROLE_BADGE_CLASS[role] || ROLE_BADGE_CLASS.viewer}`}
                      >
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-2">
                <label className="block text-xs text-gray-500 dark:text-gray-400 mb-1" htmlFor="settings-username">
                  Username
                </label>
                <div className="flex items-center gap-2">
                  <input
                    id="settings-username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="flex-1 rounded border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 dark:text-gray-100 px-3 py-2 text-sm focus:outline-none focus:border-brand-500 dark:focus:border-teal-500"
                  />
                  <Button
                    variant="primary"
                    disabled={!username.trim() || username.trim() === user.username}
                    loading={saving}
                    onClick={handleSave}
                  >
                    Save
                  </Button>
                </div>
                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1.5">
                  This is how your name appears to teammates when it's not pulled from Google.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
      {toastNode}
    </MainLayout>
  );
};

export default Settings;
