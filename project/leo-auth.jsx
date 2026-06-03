/* LEO — Login + Request access screen */
const { useState: useStateLogin } = React;

const AUTH_CARD = {
  width: 360,
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "36px 32px",
  boxShadow: "0 4px 24px oklch(0 0 0 / 0.07)",
};
const AUTH_LABEL = { display: "block", fontSize: 12, fontWeight: 600, color: "var(--ink-2)", marginBottom: 6 };
const AUTH_ERR = {
  marginBottom: 16, padding: "9px 12px",
  background: "oklch(0.60 0.20 27 / 0.08)", border: "1px solid oklch(0.60 0.20 27 / 0.28)",
  borderRadius: 7, fontSize: 12.5, color: "oklch(0.50 0.20 27)", lineHeight: 1.45,
};

function AuthBrand() {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32 }}>
      <div className="brand-mark">L</div>
      <div>
        <div style={{ fontFamily: "var(--mono)", fontWeight: 700, fontSize: 15, letterSpacing: "0.04em", color: "var(--ink)" }}>LEO</div>
        <div style={{ fontFamily: "var(--mono)", fontSize: 10, letterSpacing: "0.12em", color: "var(--ink-3)", textTransform: "uppercase" }}>EVIDENCE × OPS</div>
      </div>
    </div>
  );
}

function SignInForm({ onRequestAccess }) {
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
    <React.Fragment>
      <div style={{ marginBottom: 24 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Sign in</div>
        <div style={{ fontSize: 13, color: "var(--ink-3)" }}>Access your LEO analyst workspace</div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 14 }}>
          <label style={AUTH_LABEL}>Email</label>
          <input className="leo-input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="analyst@hospital.org" required autoComplete="email" />
        </div>

        <div style={{ marginBottom: 20 }}>
          <label style={AUTH_LABEL}>Password</label>
          <input className="leo-input" type="password" value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••" required autoComplete="current-password" />
        </div>

        {error && <div style={AUTH_ERR}>{error}</div>}

        <button className="btn primary" type="submit" disabled={loading}
          style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Signing in…" : "Sign in"}
        </button>
      </form>

      <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <span style={{ fontSize: 12.5, color: "var(--ink-3)" }}>Need an account? </span>
        <button onClick={onRequestAccess} style={{
          background: "none", border: "none", padding: 0, cursor: "pointer",
          fontSize: 12.5, fontWeight: 600, color: "var(--accent)", fontFamily: "var(--sans)",
        }}>
          Request access
        </button>
      </div>
    </React.Fragment>
  );
}

function RequestAccessForm({ onBack }) {
  const [name, setName] = useStateLogin("");
  const [email, setEmail] = useStateLogin("");
  const [org, setOrg] = useStateLogin("");
  const [reason, setReason] = useStateLogin("");
  const [error, setError] = useStateLogin(null);
  const [loading, setLoading] = useStateLogin(false);
  const [done, setDone] = useStateLogin(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const ok = await window.LEO_DB.requestAccess({ name, email, organization: org, reason });
      if (!ok) throw new Error("Could not submit your request. Please try again.");
      setDone(true);
    } catch (err) {
      setError(err.message || "Could not submit your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <React.Fragment>
        <div style={{
          width: 44, height: 44, borderRadius: 11, display: "grid", placeItems: "center",
          background: "oklch(0.66 0.13 152 / 0.12)", border: "1px solid oklch(0.66 0.13 152 / 0.30)",
          marginBottom: 18,
        }}>
          <Ic name="check" size={20} />
        </div>
        <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 6 }}>Request submitted</div>
        <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.55, marginBottom: 22 }}>
          Thanks, {name || "there"}. Your access request has been logged for review. A LEO
          administrator will follow up at <b style={{ color: "var(--ink-2)" }}>{email}</b> once
          your account is provisioned.
        </div>
        <button className="btn" onClick={onBack} style={{ width: "100%", justifyContent: "center" }}>
          <Ic name="arrowL" size={14} /> Back to sign in
        </button>
      </React.Fragment>
    );
  }

  return (
    <React.Fragment>
      <div style={{ marginBottom: 22 }}>
        <div style={{ fontSize: 17, fontWeight: 700, color: "var(--ink)", marginBottom: 4 }}>Request access</div>
        <div style={{ fontSize: 13, color: "var(--ink-3)", lineHeight: 1.5 }}>
          LEO access is granted by an administrator. Tell us who you are and we'll be in touch.
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 13 }}>
          <label style={AUTH_LABEL}>Full name</label>
          <input className="leo-input" type="text" value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Smith" required autoComplete="name" />
        </div>

        <div style={{ marginBottom: 13 }}>
          <label style={AUTH_LABEL}>Work email</label>
          <input className="leo-input" type="email" value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@hospital.org" required autoComplete="email" />
        </div>

        <div style={{ marginBottom: 13 }}>
          <label style={AUTH_LABEL}>Organization</label>
          <input className="leo-input" type="text" value={org}
            onChange={(e) => setOrg(e.target.value)}
            placeholder="Memorial Health System" required autoComplete="organization" />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label style={AUTH_LABEL}>Reason for access</label>
          <textarea className="ws-textarea" value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Your role and how you'll use LEO…"
            required style={{ minHeight: 76, fontFamily: "var(--sans)", fontSize: 13 }} />
        </div>

        {error && <div style={AUTH_ERR}>{error}</div>}

        <button className="btn primary" type="submit" disabled={loading}
          style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.7 : 1 }}>
          {loading ? "Submitting…" : "Submit request"}
        </button>
      </form>

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)", textAlign: "center" }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", padding: 0, cursor: "pointer",
          fontSize: 12.5, fontWeight: 600, color: "var(--accent)", fontFamily: "var(--sans)",
        }}>
          ← Back to sign in
        </button>
      </div>
    </React.Fragment>
  );
}

function LoginScreen({ onEnterDemo }) {
  const [mode, setMode] = useStateLogin("signin"); // "signin" | "request"

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: 16,
      background: "var(--bg)",
    }}>
      <div style={AUTH_CARD}>
        <AuthBrand />
        {mode === "signin"
          ? <SignInForm onRequestAccess={() => setMode("request")} />
          : <RequestAccessForm onBack={() => setMode("signin")} />}
      </div>
      {onEnterDemo && (
        <div style={{ width: 360, textAlign: "center" }}>
          <button onClick={onEnterDemo} className="btn" style={{ width: "100%", justifyContent: "center" }}>
            <Ic name="grid" size={14} /> Explore the public demo
          </button>
          <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 9, fontFamily: "var(--mono)", lineHeight: 1.5 }}>
            No account needed · synthetic sample data · read-only
          </div>
        </div>
      )}
    </div>
  );
}

window.LoginScreen = LoginScreen;
