import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { googleAuth } from "../utils/store";
import Snackbar from "../components/Snackbar";
import ShipMark from "../assets/ship-mark.png";

export const persistSession = (token: string) => {
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
  const [notice, setNotice] = useState<{ message: string; variant: "success" | "error" } | null>(null);

  const showError = (message: string) => {
    setNotice({ message, variant: "error" });
    setTimeout(() => setNotice(null), 4000);
  };

  const handleGoogleSuccess = async (credentialResponse: CredentialResponse) => {
    if (!credentialResponse.credential) {
      showError("Google didn't return a credential. Please try again.");
      return;
    }

    try {
      const { token, needsProfile } = await googleAuth({ credential: credentialResponse.credential });
      persistSession(token);
      navigate(needsProfile ? "/complete-profile" : "/dashboard");
    } catch (err: any) {
      const message = err?.response?.data?.message || err?.message || "Couldn't sign in with Google. Please try again.";
      showError(message);
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
                <h2 className="mb-2 text-center text-2xl font-semibold text-gray-800">Welcome!</h2>
                <p className="mb-8 text-center text-sm text-gray-600">
                  Sign in with your KeelWorks Google account to continue.
                </p>

                <div className="flex justify-center">
                  <GoogleLogin
                    onSuccess={handleGoogleSuccess}
                    onError={() => showError("Couldn't sign in with Google. Please try again.")}
                  />
                </div>
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

export default Auth;
