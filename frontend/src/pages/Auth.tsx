import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { register, login, verifyEmail, resendCode } from "../utils/store";
import Snackbar from "../components/Snackbar";
import ShipMark from "../assets/ship-mark.png";

const ALLOWED_SIGNUP_DOMAIN = "keelworks.org";
const RESEND_COOLDOWN_SECONDS = 60;

const PENDING_EMAIL_KEY = "kc_pending_email";
const PENDING_EXPIRES_AT_KEY = "kc_pending_expires_at";
const PENDING_RESEND_AT_KEY = "kc_pending_resend_at";

interface FloatingFieldProps {
  id: string;
  type: string;
  name: string;
  label: string;
  value: string;
  autoComplete?: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FloatingField = ({ id, type, name, label, value, autoComplete, onChange }: FloatingFieldProps) => {
  const floated = value.length > 0;

  const handleAutofill = (e: React.AnimationEvent<HTMLInputElement>) => {
    if (e.animationName === "onAutoFillStart") {
      onChange({ target: { value: e.currentTarget.value } } as React.ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div className="relative mb-5">
      <input
        id={id}
        type={type}
        name={name}
        value={value}
        autoComplete={autoComplete}
        onChange={onChange}
        onAnimationStart={handleAutofill}
        required
        className="peer w-full border-b-2 border-gray-300 bg-transparent px-1 pt-5 pb-2 text-gray-900 focus:border-teal-600 focus:outline-none"
      />
      <label
        htmlFor={id}
        className={`pointer-events-none absolute left-1 transition-all duration-150 peer-focus:top-0 peer-focus:text-xs peer-focus:text-teal-600 ${
          floated ? "top-0 text-xs text-teal-600" : "top-5 text-base text-gray-400"
        }`}
      >
        {label}
      </label>
    </div>
  );
};

const formatCountdown = (ms: number) => {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${minutes}:${seconds.toString().padStart(2, "0")}`;
};

const persistSession = (token: string) => {
  localStorage.setItem("token", token);
  localStorage.setItem("lastActive", new Date().getTime().toString());
  try {
    const decoded = jwtDecode<{ id: number; username: string }>(token);
    if (decoded && typeof decoded.id !== "undefined") {
      localStorage.setItem("userId", decoded.id.toString());
    } else {
      localStorage.removeItem("userId");
    }
    localStorage.setItem("username", decoded.username);
  } catch (e) {
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
  }
};

const Auth = () => {
  const navigate = useNavigate();

  const [tab, setTab] = useState("login");
  const [view, setView] = useState<"form" | "verify">(() =>
    localStorage.getItem(PENDING_EMAIL_KEY) ? "verify" : "form"
  );
  const [formData, setFormData] = useState({ username: "", email: "", password: "", identifier: "" });
  const [notice, setNotice] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  const [pendingEmail, setPendingEmail] = useState(() => localStorage.getItem(PENDING_EMAIL_KEY) || "");
  const [expiresAt, setExpiresAt] = useState<number | null>(() => {
    const stored = localStorage.getItem(PENDING_EXPIRES_AT_KEY);
    return stored ? Number(stored) : null;
  });
  const [resendAvailableAt, setResendAvailableAt] = useState<number | null>(() => {
    const stored = localStorage.getItem(PENDING_RESEND_AT_KEY);
    return stored ? Number(stored) : null;
  });
  const [code, setCode] = useState("");
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    if (view !== "verify") return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [view]);

  const showNotice = (message: string, variant: "success" | "error" = "error") => {
    setNotice({ message, variant });
    if (variant === "error") {
      setTimeout(() => setNotice(null), 4000);
    }
  };

  const persistVerifyState = (email: string, expiresAtMs: number, resendAtMs: number) => {
    localStorage.setItem(PENDING_EMAIL_KEY, email);
    localStorage.setItem(PENDING_EXPIRES_AT_KEY, expiresAtMs.toString());
    localStorage.setItem(PENDING_RESEND_AT_KEY, resendAtMs.toString());
  };

  const clearVerifyState = () => {
    localStorage.removeItem(PENDING_EMAIL_KEY);
    localStorage.removeItem(PENDING_EXPIRES_AT_KEY);
    localStorage.removeItem(PENDING_RESEND_AT_KEY);
  };

  const remainingCodeMs = expiresAt ? Math.max(0, expiresAt - now) : 0;
  const remainingResendMs = resendAvailableAt ? Math.max(0, resendAvailableAt - now) : 0;
  const codeExpired = expiresAt !== null && remainingCodeMs <= 0;
  const canResend = remainingResendMs <= 0;

  const validateForm = () => {
    if (tab === "signup") {
      if (!formData.username) return "Username is required";
      if (!formData.email.includes("@")) return "Invalid email format";
      if (!formData.email.toLowerCase().endsWith(`@${ALLOWED_SIGNUP_DOMAIN}`)) {
        return `Only KeelWorks employees can sign up for KeelCompass. Please use your @${ALLOWED_SIGNUP_DOMAIN} email address.`;
      }
      if (formData.password.length < 8 || !/[A-Z]/.test(formData.password) || !/[0-9]/.test(formData.password)) {
        return "Password must be 8+ chars, 1 number, 1 uppercase";
      }
    } else {
      if (!formData.identifier) return "Email or username is required";
      if (!formData.password) return "Password is required";
    }
    return "";
  };

  const handleTabChange = () => {
    setTab(tab === "login" ? "signup" : "login");
    setFormData({ username: "", email: "", password: "", identifier: "" });
    setNotice(null);
  };

  const handleUseDifferentEmail = () => {
    clearVerifyState();
    setPendingEmail("");
    setExpiresAt(null);
    setResendAvailableAt(null);
    setCode("");
    setView("form");
    setTab("signup");
    setFormData({ username: "", email: "", password: "", identifier: "" });
    setNotice(null);
  };

  const handleSubmitAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    const validationError = validateForm();
    if (validationError) {
      showNotice(validationError, "error");
      return;
    }

    try {
      if (tab === "signup") {
        const { email, expiresInSeconds } = await register({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        const newExpiresAt = Date.now() + expiresInSeconds * 1000;
        const newResendAvailableAt = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
        setPendingEmail(email);
        setExpiresAt(newExpiresAt);
        setResendAvailableAt(newResendAvailableAt);
        persistVerifyState(email, newExpiresAt, newResendAvailableAt);
        setCode("");
        setView("verify");
        showNotice("Verification code sent!", "success");
      } else {
        const token = await login({ identifier: formData.identifier, password: formData.password });
        if (!token) throw new Error("Invalid response from server");
        persistSession(token);
        navigate("/dashboard");
      }
    } catch (err: any) {
      const backendMsg = err?.response?.data?.message || err?.message || "";
      const fallback = tab === "signup" ? "Something went wrong. Please try again." : "Incorrect email/username or password.";
      showNotice(backendMsg || fallback, "error");
    }
  };

  const handleVerifySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNotice(null);
    if (code.length !== 6) {
      showNotice("Enter the 6-digit code from your email.", "error");
      return;
    }

    try {
      const token = await verifyEmail({ email: pendingEmail, code });
      persistSession(token);
      clearVerifyState();
      showNotice("Email verified! Redirecting...", "success");
      navigate("/dashboard");
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Invalid or expired code. Please try again.";
      showNotice(message, "error");
    }
  };

  const handleResend = async () => {
    setNotice(null);
    try {
      const { expiresInSeconds } = await resendCode({ email: pendingEmail });
      const newExpiresAt = Date.now() + expiresInSeconds * 1000;
      const newResendAvailableAt = Date.now() + RESEND_COOLDOWN_SECONDS * 1000;
      setExpiresAt(newExpiresAt);
      setResendAvailableAt(newResendAvailableAt);
      persistVerifyState(pendingEmail, newExpiresAt, newResendAvailableAt);
      setCode("");
      showNotice("New code sent!", "success");
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Couldn't resend the code. Please try again.";
      showNotice(message, "error");
    }
  };

  return (
    <div className="auth-gradient-bg min-h-screen overflow-hidden">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl items-center px-4 py-10 md:px-8">
        <div className="grid w-full items-center gap-10 lg:grid-cols-2">
          <div className="text-center" style={{ zIndex: 10 }} >
            <div className="mb-6 flex items-center justify-center gap-2">
              <img src={ShipMark} alt="" className="h-12 w-auto" />
              <span className="text-4xl font-bold text-white">KeelCompass</span>
            </div>
            <h1 className="mb-4 text-4xl font-bold leading-tight" style={{ color: "hsl(189, 60%, 95%)" }}>
              Navigate your questions, <br />
              <span style={{ color: "hsl(189, 70%, 75%)" }}>all in one place</span>
            </h1>
            <p className="mx-auto max-w-md opacity-80 lg:mx-0" style={{ color: "hsl(189, 40%, 90%)" }}>
              Sign in to track questions, collaborate with your team, and stay on
              course with KeelCompass.
            </p>
          </div>

          <div className="relative">
            <div className="auth-shape-1 absolute rounded-full shadow-lg"></div>
            <div className="auth-shape-2 absolute shadow-lg"></div>

            <div className="auth-glass relative rounded-2xl shadow-xl">
              <div className="px-6 py-10 md:px-10">
                {view === "verify" ? (
                  <>
                    <h2 className="mb-2 text-center text-2xl font-semibold text-gray-800">Check your email</h2>
                    <p className="mb-6 text-center text-sm text-gray-600">
                      We sent a 6-digit verification code to <span className="font-medium text-gray-800">{pendingEmail}</span>.
                      Enter it below to finish creating your account.
                    </p>
                    <form onSubmit={handleVerifySubmit}>
                      <input
                        id="verification-code"
                        type="text"
                        inputMode="numeric"
                        pattern="\d*"
                        autoComplete="one-time-code"
                        maxLength={6}
                        placeholder="000000"
                        value={code}
                        onChange={(e) => setCode(e.target.value.replace(/\D/g, "").slice(0, 6))}
                        className="mb-3 w-full rounded-lg border-2 border-gray-300 bg-transparent py-3 text-center text-2xl font-semibold tracking-[0.5em] text-gray-900 focus:border-teal-600 focus:outline-none"
                      />
                      <p className="mb-5 text-center text-sm text-gray-500">
                        {codeExpired
                          ? "Your code has expired. Request a new one below."
                          : `Code expires in ${formatCountdown(remainingCodeMs)}`}
                      </p>

                      <button
                        type="submit"
                        disabled={code.length !== 6 || codeExpired}
                        className="mb-4 w-full rounded-lg bg-teal-600 py-3 font-medium text-white transition hover:bg-teal-700 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Verify Email
                      </button>
                    </form>

                    <p className="text-center text-gray-600">
                      Didn't get a code?{" "}
                      <button
                        type="button"
                        onClick={handleResend}
                        disabled={!canResend}
                        className="font-medium text-teal-600 underline disabled:cursor-not-allowed disabled:text-gray-400 disabled:no-underline"
                      >
                        {canResend ? "Resend code" : `Resend available in ${formatCountdown(remainingResendMs)}`}
                      </button>
                    </p>
                    <p className="mt-2 text-center">
                      <button type="button" onClick={handleUseDifferentEmail} className="text-sm text-teal-600 underline">
                        Use a different email
                      </button>
                    </p>
                  </>
                ) : (
                  <>
                    <h2 className="mb-6 text-center text-2xl font-semibold text-gray-800">
                      {tab === "signup" ? "Create your account" : "Welcome!"}
                    </h2>
                    <form onSubmit={handleSubmitAuth}>
                      {tab === "signup" && (
                        <FloatingField
                          id="username"
                          type="text"
                          name="username"
                          label="Username"
                          autoComplete="username"
                          value={formData.username}
                          onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        />
                      )}
                      {tab === "signup" ? (
                        <>
                          <FloatingField
                            id="email"
                            type="email"
                            name="email"
                            label="Email address"
                            autoComplete="email"
                            value={formData.email}
                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          />
                          <p className="-mt-3 mb-4 text-xs text-gray-500">
                            Use your @{ALLOWED_SIGNUP_DOMAIN} email address.
                          </p>
                        </>
                      ) : (
                        <FloatingField
                          id="identifier"
                          type="text"
                          name="identifier"
                          label="Email or Username"
                          autoComplete="username"
                          value={formData.identifier}
                          onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                        />
                      )}
                      <FloatingField
                        id="password"
                        type="password"
                        name="password"
                        label="Password"
                        autoComplete={tab === "signup" ? "new-password" : "current-password"}
                        value={formData.password}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      />

                      <button className="mb-4 mt-2 w-full rounded-lg bg-teal-600 py-3 font-medium text-white transition hover:bg-teal-700">
                        {tab === "signup" ? "Sign Up" : "Login"}
                      </button>
                    </form>

                    <p className="text-center text-gray-600">
                      {tab === "signup" ? "Already have an account?" : "Don't have an account?"}{" "}
                      <button className="font-medium text-teal-600 underline" onClick={handleTabChange}>
                        {tab === "signup" ? "Login" : "Sign Up"}
                      </button>
                    </p>

                    {tab === "login" && (
                      <p className="mt-2 text-center">
                        <a href="/reset-password" className="text-teal-600">Forgot Password?</a>
                      </p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {notice && (
        <Snackbar
          message={notice.message}
          variant={notice.variant}
          duration={notice.variant === "success" ? 4000 : undefined}
          onClose={() => setNotice(null)}
        />
      )}
    </div>
  );
};

export default Auth;
