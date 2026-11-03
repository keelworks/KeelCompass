import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { completeProfile } from "../utils/store";
import { persistSession } from "./Auth";
import Snackbar from "../components/Snackbar";
import ShipMark from "../assets/ship-mark.png";

const CompleteProfile = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [notice, setNotice] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  const showError = (message: string) => {
    setNotice({ message, variant: "error" });
    setTimeout(() => setNotice(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      showError("Please choose a username.");
      return;
    }

    setSubmitting(true);
    try {
      const token = await completeProfile({ username: username.trim() });
      persistSession(token);
      navigate("/dashboard");
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Couldn't save your profile. Please try again.";
      showError(message);
      setSubmitting(false);
    }
  };

  return (
    <div className="auth-gradient-bg min-h-screen overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 md:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="text-center" style={{ zIndex: 10 }}>
            <div className="mb-6 flex items-center justify-center gap-2">
              <img src={ShipMark} alt="" className="h-12 w-auto" />
              <span className="text-4xl font-bold text-white">KeelCompass</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight" style={{ color: "hsl(189, 60%, 95%)" }}>
              Almost there, <br />
              <span style={{ color: "hsl(189, 70%, 75%)" }}>one last step</span>
            </h1>
            <p className="mx-auto max-w-md opacity-80 lg:mx-0" style={{ color: "hsl(189, 40%, 90%)" }}>
              Choose a username so your teammates know who's asking (or answering).
            </p>
          </div>

          <div className="relative">
            <div className="auth-shape-1 absolute rounded-full shadow-lg"></div>
            <div className="auth-shape-2 absolute shadow-lg"></div>

            <div className="auth-glass relative rounded-2xl shadow-xl">
              <div className="px-6 py-10 md:px-10">
                <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
                  Finish setting up your account
                </h2>
                <form onSubmit={handleSubmit}>
                  <div className="relative mb-5">
                    <input
                      id="username"
                      type="text"
                      value={username}
                      autoFocus
                      onChange={(e) => setUsername(e.target.value)}
                      required
                      className="peer w-full border-b-2 border-gray-300 bg-transparent px-1 pt-5 pb-2 text-gray-900 focus:border-teal-600 focus:outline-none"
                    />
                    <label
                      htmlFor="username"
                      className={`pointer-events-none absolute left-1 transition-all duration-150 peer-focus:top-0 peer-focus:text-xs peer-focus:text-teal-600 ${
                        username.length > 0 ? "top-0 text-xs text-teal-600" : "top-5 text-base text-gray-400"
                      }`}
                    >
                      Choose a username
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={submitting}
                    className="mb-4 mt-2 w-full rounded-lg bg-teal-600 py-3 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {submitting ? "Saving..." : "Continue"}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>

      {notice && (
        <Snackbar
          message={notice.message}
          variant={notice.variant}
          onClose={() => setNotice(null)}
        />
      )}
    </div>
  );
};

export default CompleteProfile;
