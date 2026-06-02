/* LEO — App shell, navigation, routing */
const { useState: useStateA, useEffect: useEffectA } = React;

const LEO_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "Clinical blue",
  "density": "regular",
  "panelTone": "Slate"
}/*EDITMODE-END*/;

const ACCENT_HUES = { "Clinical blue": 248, "Teal": 196, "Indigo": 286 };
const PANEL_TONES = {
  Slate:    { bg: "0.215 0.018 262", s: "0.255 0.02 262", r: "0.30 0.022 262", b: "0.36 0.022 262", b2: "0.32 0.02 262" },
  Navy:     { bg: "0.205 0.032 256", s: "0.245 0.032 256", r: "0.295 0.034 256", b: "0.355 0.03 256", b2: "0.31 0.028 256" },
  Graphite: { bg: "0.205 0.004 260", s: "0.245 0.004 260", r: "0.30 0.005 260", b: "0.36 0.006 260", b2: "0.32 0.005 260" },
};

function useLeoTweaks(t) {
  useEffectA(() => {
    const root = document.documentElement;
    root.style.setProperty("--accent-h", ACCENT_HUES[t.accent] || 248);
    root.dataset.density = t.density;
    const p = PANEL_TONES[t.panelTone] || PANEL_TONES.Slate;
    root.style.setProperty("--d-bg", `oklch(${p.bg})`);
    root.style.setProperty("--d-surface", `oklch(${p.s})`);
    root.style.setProperty("--d-raised", `oklch(${p.r})`);
    root.style.setProperty("--d-border", `oklch(${p.b})`);
    root.style.setProperty("--d-border-2", `oklch(${p.b2})`);
  }, [t.accent, t.density, t.panelTone]);
}

function Sidebar({ view, go, profile, session, onSignOut }) {
  const { ROLLUP } = window.LEO_DATA;
  const item = (key, icon, label, count) => (
    <button className={"nav-item" + (view === key ? " active" : "")} onClick={() => go(key)}>
      <Ic name={icon} />{label}{count != null && <span className="count">{count}</span>}
    </button>
  );

  const displayName = profile ? profile.name : (session ? session.user.email : "");
  const displayRole = profile ? profile.role : "analyst";
  const initials = displayName
    ? displayName.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)
    : "?";

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brand-mark">L</div>
        <div>
          <div className="brand-name">LEO</div>
          <div className="brand-sub">EVIDENCE × OPS</div>
        </div>
      </div>
      <nav className="nav">
        <div className="nav-label">Operations</div>
        {item("list", "grid", "Continuity overview")}
        {item("list2", "flow", "Workflows", ROLLUP.monitored.toLocaleString())}
        {item("invq", "search", "Investigations", ROLLUP.critical)}
        {item("pulse", "pulse", "Signals")}
        <div className="nav-label">Governance</div>
        {item("rec", "target", "Recommendations")}
        {item("dims", "layers", "Dimensions")}
        {item("qi", "shield", "QI review")}
      </nav>
      <div className="sidebar-foot">
        <div className="user">
          <div className="avatar">{initials}</div>
          <div>
            <div className="user-name">{displayName}</div>
            <div className="user-role">{displayRole}</div>
          </div>
        </div>
        {onSignOut && (
          <button
            onClick={onSignOut}
            className="icon-btn"
            title="Sign out"
            style={{ marginLeft: "auto", flexShrink: 0 }}
          >
            <Ic name="arrowL" />
          </button>
        )}
      </div>
    </aside>
  );
}

function Topbar({ crumbs }) {
  return (
    <header className="topbar">
      <div className="crumbs">
        {crumbs.map((c, i) => (
          <React.Fragment key={i}>
            {i > 0 && <span className="sep">/</span>}
            {c.onClick ? <button className="crumb-btn" onClick={c.onClick}>{c.label}</button>
              : <span className="crumb-cur">{c.label}</span>}
          </React.Fragment>
        ))}
      </div>
      <div className="search"><Ic name="search" /><input placeholder="Search workflows, patients, owners…" /></div>
      <button className="icon-btn"><Ic name="bell" /></button>
    </header>
  );
}

function App() {
  // route: { name: 'list' | 'detail' | 'inv' | 'workspace', wfId, findingId }
  const [route, setRoute] = useStateA({ name: "list" });
  const [t, setTweak] = useTweaks(LEO_TWEAK_DEFAULTS);
  useLeoTweaks(t);

  // Auth state
  const [session, setSession] = useStateA(null);
  const [profile, setProfile] = useStateA(null);
  const [authLoading, setAuthLoading] = useStateA(true);

  useEffectA(() => {
    // Load initial session
    window.LEO_DB.getSession().then(async (sess) => {
      setSession(sess);
      if (sess) {
        const prof = await window.LEO_DB.getProfile(sess.user.id);
        setProfile(prof);
      }
      setAuthLoading(false);
    }).catch(() => setAuthLoading(false));

    // Subscribe to auth changes
    const { data: { subscription } } = window.LEO_DB.onAuthChange(async (sess) => {
      setSession(sess);
      if (sess) {
        const prof = await window.LEO_DB.getProfile(sess.user.id);
        setProfile(prof);
      } else {
        setProfile(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  if (authLoading) {
    return (
      <div style={{
        minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
        background: "var(--bg)", fontFamily: "var(--mono)", color: "var(--ink-3)", fontSize: 14,
      }}>
        Loading…
      </div>
    );
  }

  if (!session) {
    return <LoginScreen />;
  }

  const openWorkflow = (wfId) => setRoute({ name: "detail", wfId });
  const openInvestigation = (findingId) => setRoute({ name: "inv", wfId: route.wfId || "WF-2287", findingId });
  const openWorkspace = (findingId) => setRoute({ name: "workspace", wfId: route.wfId || "WF-2287", findingId });
  const goList = () => setRoute({ name: "list" });

  let crumbs, body, navView;
  if (route.name === "list") {
    navView = "list";
    crumbs = [{ label: "Continuity overview" }];
    body = <WorkflowsList onOpen={openWorkflow} />;
  } else if (route.name === "detail") {
    navView = "list2";
    const wf = window.LEO_DATA.WORKFLOWS.find((w) => w.id === route.wfId);
    crumbs = [{ label: "Workflows", onClick: goList }, { label: wf ? wf.id : route.wfId }];
    body = <WorkflowDetail id={route.wfId} onInvestigate={openInvestigation} />;
  } else if (route.name === "inv") {
    navView = "invq";
    crumbs = [
      { label: "Workflows", onClick: goList },
      { label: route.wfId, onClick: () => openWorkflow(route.wfId) },
      { label: "Investigation" },
    ];
    body = <Investigation findingId={route.findingId} wfId={route.wfId} onBack={() => openWorkflow(route.wfId)} onWorkspace={openWorkspace} user={profile} />;
  } else {
    navView = "invq";
    crumbs = [
      { label: "Workflows", onClick: goList },
      { label: route.wfId, onClick: () => openWorkflow(route.wfId) },
      { label: "Investigation", onClick: () => openInvestigation(route.findingId) },
      { label: "Workspace" },
    ];
    body = <InvestigationWorkspace findingId={route.findingId} wfId={route.wfId} onInvestigation={() => openInvestigation(route.findingId)} user={profile} />;
  }

  // sidebar nav: map some entries to list, detail-focus to deep workflow
  const go = (key) => {
    if (key === "list") goList();
    else if (key === "list2" || key === "qi" || key === "dims" || key === "rec" || key === "pulse") goList();
    else if (key === "invq") openWorkflow("WF-2287");
  };

  return (
    <div className="app">
      <Sidebar view={navView} go={go} profile={profile} session={session} onSignOut={() => window.LEO_DB.signOut()} />
      <div className="main">
        <Topbar crumbs={crumbs} />
        <div className="scroll">{body}</div>
      </div>
      <TweaksPanel>
        <TweakSection label="Appearance" />
        <TweakRadio label="Accent" value={t.accent} options={["Clinical blue", "Teal", "Indigo"]} onChange={(v) => setTweak("accent", v)} />
        <TweakRadio label="Density" value={t.density} options={["compact", "regular", "comfy"]} onChange={(v) => setTweak("density", v)} />
        <TweakSection label="Data panels" />
        <TweakRadio label="Tone" value={t.panelTone} options={["Slate", "Navy", "Graphite"]} onChange={(v) => setTweak("panelTone", v)} />
      </TweaksPanel>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
