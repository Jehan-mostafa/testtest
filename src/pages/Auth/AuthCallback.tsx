import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get("token");
    const error = params.get("error");

    if (error || !token) {
      // فشل Google login → رجّع للـ login مع error message
      navigate("/login?error=google_failed", { replace: true });
      return;
    }

    // حفظ الـ token والـ user في localStorage
    const user = {
      id: params.get("id"),
      name: params.get("name"),
      email: params.get("email"),
      role: params.get("role"),
    };

    localStorage.setItem("token", token);
    localStorage.setItem("user", JSON.stringify(user));

    // Redirect حسب الـ role
    const role = user.role;
    if (role === "customer") navigate("/", { replace: true });
    else navigate(`/dashboard/${role}`, { replace: true });
  }, [navigate]);

  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh",
        background: "#FDFAF5",
        fontFamily: "Georgia, serif",
        color: "#5A4535",
      }}
    >
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: 40, marginBottom: 16 }}>🏺</div>
        <p style={{ fontSize: 16 }}>Signing you in...</p>
      </div>
    </div>
  );
}
