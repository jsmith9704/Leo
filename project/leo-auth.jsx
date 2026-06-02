/* LEO — Login screen */
const { useState: useStateLogin } = React;

function LoginScreen() {
  const [email, setEmail] = useStateLogin("");
  const [password, setPassword] = useStateLogin("");
  const [error, setError] = useStateLogin(null);
  const [loading, setLoading] = useStateLogin(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await window.LEO_DB.signIn(email, password);
      // Auth state change fires automatically in App via onAuthChange subscription
    } catch (err) {
      setError(err.message || "Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      background: "var(--bg)",
    }}>
      <div style={{
        width: 360,
        background: "var(--surface)",
        border: "1px solid var(--border)",
        borderRadius: 14,
        padding: "36px 32px",
        boxShadow: "0 4px 24px oklch(0 0 0 / 0.07)",
      }}>
        {/* Brand mark */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
          <div className="brand-mark">L</div>
          <div>
            <div style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: 15, letterSpacing: "0.04em", color: "var(--ink)" }}>LEO</div>
            <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--ink-3)", textTransform: "uppercase" }}>EVIDENCE × OPS</div>
          </div>
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Sign in</div>
          <div style={{ fontSize: 13, color: "var(--ink-3)" }}>Access your LEO analyst workspace</div>
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-2)", marginBottom: 6 }}>
              Email
            </label>
            <input
              className="leo-input"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="analyst@hospital.org"
              required
              autoComplete="email"
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <label style={{ display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-2)", marginBottom: 6 }}>
              Password
            </label>
            <input
              className="leo-input"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              autoComplete="current-password"
            />
          </div>

          {error && (
            <div style={{
              marginBottom: 16,
              padding: "9px 12px",
              background: "oklch(0.60 0.20 27 / 0.08)",
              border: "1px solid oklch(0.60 0.20 27 / 0.28)",
              borderRadius: 7,
              fontSize: 12.5,
              color: "oklch(0.50 0.20 27)",
              lineHeight: 1.45,
            }}>
              {error}
            </div>
          )}

          <button
            className="btn primary"
            type="submit"
            disabled={loading}
            style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}
          >
            {loading ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

window.LoginScreen = LoginScreen;
