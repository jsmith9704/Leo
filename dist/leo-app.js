/* LEO — App shell, navigation, routing */
const {
  useState: useStateA,
  useEffect: useEffectA
} = React;
const LEO_TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "accent": "Clinical blue",
  "density": "regular",
  "panelTone": "Slate"
} /*EDITMODE-END*/;
const ACCENT_HUES = {
  "Clinical blue": 248,
  "Teal": 196,
  "Indigo": 286
};
const PANEL_TONES = {
  Slate: {
    bg: "0.215 0.018 262",
    s: "0.255 0.02 262",
    r: "0.30 0.022 262",
    b: "0.36 0.022 262",
    b2: "0.32 0.02 262"
  },
  Navy: {
    bg: "0.205 0.032 256",
    s: "0.245 0.032 256",
    r: "0.295 0.034 256",
    b: "0.355 0.03 256",
    b2: "0.31 0.028 256"
  },
  Graphite: {
    bg: "0.205 0.004 260",
    s: "0.245 0.004 260",
    r: "0.30 0.005 260",
    b: "0.36 0.006 260",
    b2: "0.32 0.005 260"
  }
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
function Sidebar({
  view,
  go,
  profile,
  session,
  onSignOut,
  demo
}) {
  const {
    ROLLUP
  } = window.LEO_DATA;
  const item = (key, icon, label, count) => /*#__PURE__*/React.createElement("button", {
    className: "nav-item" + (view === key ? " active" : ""),
    onClick: () => go(key)
  }, /*#__PURE__*/React.createElement(Ic, {
    name: icon
  }), label, count != null && /*#__PURE__*/React.createElement("span", {
    className: "count"
  }, count));
  const displayName = profile ? profile.name : session ? session.user.email : "";
  const displayRole = profile ? profile.role : "analyst";
  const initials = displayName ? displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2) : "?";
  return /*#__PURE__*/React.createElement("aside", {
    className: "sidebar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand"
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand-mark"
  }, "L"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "brand-name"
  }, "LEO"), /*#__PURE__*/React.createElement("div", {
    className: "brand-sub"
  }, "EVIDENCE \xD7 OPS"))), /*#__PURE__*/React.createElement("nav", {
    className: "nav"
  }, /*#__PURE__*/React.createElement("div", {
    className: "nav-label"
  }, "Operations"), item("list", "grid", "Continuity overview"), item("analyze", "spark", "Analyze case"), item("list2", "flow", "Workflows", ROLLUP.monitored.toLocaleString()), item("invq", "search", "Investigations", ROLLUP.critical), item("pulse", "pulse", "Signals"), /*#__PURE__*/React.createElement("div", {
    className: "nav-label"
  }, "Governance"), item("rec", "target", "Recommendations"), item("dims", "layers", "Dimensions"), item("qi", "shield", "QI review")), /*#__PURE__*/React.createElement("div", {
    className: "sidebar-foot"
  }, /*#__PURE__*/React.createElement("div", {
    className: "user"
  }, /*#__PURE__*/React.createElement("div", {
    className: "avatar"
  }, initials), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "user-name"
  }, displayName), /*#__PURE__*/React.createElement("div", {
    className: "user-role"
  }, displayRole))), onSignOut && /*#__PURE__*/React.createElement("button", {
    onClick: onSignOut,
    className: "icon-btn",
    title: demo ? "Exit demo · sign in" : "Sign out",
    style: {
      marginLeft: "auto",
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "arrowL"
  }))));
}
function Topbar({
  crumbs
}) {
  return /*#__PURE__*/React.createElement("header", {
    className: "topbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "crumbs"
  }, crumbs.map((c, i) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("span", {
    className: "sep"
  }, "/"), c.onClick ? /*#__PURE__*/React.createElement("button", {
    className: "crumb-btn",
    onClick: c.onClick
  }, c.label) : /*#__PURE__*/React.createElement("span", {
    className: "crumb-cur"
  }, c.label)))), /*#__PURE__*/React.createElement("div", {
    className: "search"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "search"
  }), /*#__PURE__*/React.createElement("input", {
    placeholder: "Search workflows, patients, owners\u2026"
  })), /*#__PURE__*/React.createElement("button", {
    className: "icon-btn"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "bell"
  })));
}
const DEMO_PROFILE = {
  name: "Demo visitor",
  role: "Public demo"
};
function DemoBanner({
  onSignIn
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "8px 18px",
      background: "var(--surface-2)",
      borderBottom: "1px solid var(--border)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--mono)",
      fontWeight: 700,
      fontSize: 10,
      letterSpacing: "0.08em",
      textTransform: "uppercase",
      color: "var(--accent)",
      border: "1px solid var(--accent)",
      borderRadius: 5,
      padding: "2px 7px",
      flexShrink: 0
    }
  }, "Public demo"), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-3)",
      lineHeight: 1.4
    }
  }, "Exploring synthetic sample data. Case analysis, saved notes, and submission require pilot access."), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    onClick: onSignIn,
    style: {
      marginLeft: "auto",
      flexShrink: 0,
      padding: "5px 13px",
      fontSize: 12
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "arrowR",
    size: 13
  }), " Sign in"));
}
function App() {
  // route: { name: 'list' | 'detail' | 'inv' | 'workspace' | 'analyze' | 'case', wfId, findingId, caseId }
  const [route, setRoute] = useStateA({
    name: "list"
  });
  const [t, setTweak] = useTweaks(LEO_TWEAK_DEFAULTS);
  useLeoTweaks(t);

  // Auth state
  const [session, setSession] = useStateA(null);
  const [profile, setProfile] = useStateA(null);
  const [authLoading, setAuthLoading] = useStateA(true);
  // Public demo is the default front door: visitors land in the read-only synthetic
  // prototype with no login wall. Login still reachable via the "Sign in" affordance.
  const [demoMode, setDemoMode] = useStateA(true);
  useEffectA(() => {
    // Load initial session
    window.LEO_DB.getSession().then(async sess => {
      setSession(sess);
      if (sess) {
        const prof = await window.LEO_DB.getProfile(sess.user.id);
        setProfile(prof);
      }
      setAuthLoading(false);
    }).catch(() => setAuthLoading(false));

    // Subscribe to auth changes
    const {
      data: {
        subscription
      }
    } = window.LEO_DB.onAuthChange(async sess => {
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
    return /*#__PURE__*/React.createElement("div", {
      style: {
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "var(--bg)",
        fontFamily: "var(--mono)",
        color: "var(--ink-3)",
        fontSize: 14
      }
    }, "Loading\u2026");
  }
  if (!session && !demoMode) {
    return /*#__PURE__*/React.createElement(LoginScreen, {
      onEnterDemo: () => setDemoMode(true)
    });
  }

  // Public demo mode: no authenticated session, write features gated.
  const demo = !session;
  const effectiveProfile = profile || (demo ? DEMO_PROFILE : null);
  const openWorkflow = wfId => setRoute({
    name: "detail",
    wfId
  });
  const openInvestigation = findingId => setRoute({
    name: "inv",
    wfId: route.wfId || "WF-2287",
    findingId
  });
  const openWorkspace = findingId => setRoute({
    name: "workspace",
    wfId: route.wfId || "WF-2287",
    findingId
  });
  const goAnalyze = () => setRoute({
    name: "analyze"
  });
  const openCase = caseId => setRoute({
    name: "case",
    caseId
  });
  const goList = () => setRoute({
    name: "list"
  });
  let crumbs, body, navView;
  if (route.name === "list") {
    navView = "list";
    crumbs = [{
      label: "Continuity overview"
    }];
    body = /*#__PURE__*/React.createElement(WorkflowsList, {
      onOpen: openWorkflow
    });
  } else if (route.name === "detail") {
    navView = "list2";
    const wf = window.LEO_DATA.WORKFLOWS.find(w => w.id === route.wfId);
    crumbs = [{
      label: "Workflows",
      onClick: goList
    }, {
      label: wf ? wf.id : route.wfId
    }];
    body = /*#__PURE__*/React.createElement(WorkflowDetail, {
      id: route.wfId,
      onInvestigate: openInvestigation
    });
  } else if (route.name === "inv") {
    navView = "invq";
    crumbs = [{
      label: "Workflows",
      onClick: goList
    }, {
      label: route.wfId,
      onClick: () => openWorkflow(route.wfId)
    }, {
      label: "Investigation"
    }];
    body = /*#__PURE__*/React.createElement(Investigation, {
      findingId: route.findingId,
      wfId: route.wfId,
      onBack: () => openWorkflow(route.wfId),
      onWorkspace: openWorkspace,
      user: effectiveProfile
    });
  } else if (route.name === "analyze") {
    navView = "analyze";
    crumbs = [{
      label: "Analyze case"
    }];
    body = /*#__PURE__*/React.createElement(AnalyzeCase, {
      onOpenCase: openCase,
      user: effectiveProfile,
      demo: demo
    });
  } else if (route.name === "case") {
    navView = "analyze";
    crumbs = [{
      label: "Analyze case",
      onClick: goAnalyze
    }, {
      label: "Analysis"
    }];
    body = /*#__PURE__*/React.createElement(AnalyzedCase, {
      caseId: route.caseId,
      onBack: goAnalyze
    });
  } else {
    navView = "invq";
    crumbs = [{
      label: "Workflows",
      onClick: goList
    }, {
      label: route.wfId,
      onClick: () => openWorkflow(route.wfId)
    }, {
      label: "Investigation",
      onClick: () => openInvestigation(route.findingId)
    }, {
      label: "Workspace"
    }];
    body = /*#__PURE__*/React.createElement(InvestigationWorkspace, {
      findingId: route.findingId,
      wfId: route.wfId,
      onInvestigation: () => openInvestigation(route.findingId),
      user: effectiveProfile,
      demo: demo
    });
  }

  // sidebar nav: map some entries to list, detail-focus to deep workflow
  const go = key => {
    if (key === "list") goList();else if (key === "analyze") goAnalyze();else if (key === "list2" || key === "qi" || key === "dims" || key === "rec" || key === "pulse") goList();else if (key === "invq") openWorkflow("WF-2287");
  };
  return /*#__PURE__*/React.createElement("div", {
    className: "app"
  }, /*#__PURE__*/React.createElement(Sidebar, {
    view: navView,
    go: go,
    profile: effectiveProfile,
    session: session,
    demo: demo,
    onSignOut: demo ? () => setDemoMode(false) : () => window.LEO_DB.signOut()
  }), /*#__PURE__*/React.createElement("div", {
    className: "main"
  }, demo && /*#__PURE__*/React.createElement(DemoBanner, {
    onSignIn: () => setDemoMode(false)
  }), /*#__PURE__*/React.createElement(Topbar, {
    crumbs: crumbs
  }), /*#__PURE__*/React.createElement("div", {
    className: "scroll"
  }, body)), /*#__PURE__*/React.createElement(TweaksPanel, null, /*#__PURE__*/React.createElement(TweakSection, {
    label: "Appearance"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Accent",
    value: t.accent,
    options: ["Clinical blue", "Teal", "Indigo"],
    onChange: v => setTweak("accent", v)
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Density",
    value: t.density,
    options: ["compact", "regular", "comfy"],
    onChange: v => setTweak("density", v)
  }), /*#__PURE__*/React.createElement(TweakSection, {
    label: "Data panels"
  }), /*#__PURE__*/React.createElement(TweakRadio, {
    label: "Tone",
    value: t.panelTone,
    options: ["Slate", "Navy", "Graphite"],
    onChange: v => setTweak("panelTone", v)
  })));
}
ReactDOM.createRoot(document.getElementById("root")).render(/*#__PURE__*/React.createElement(App, null));
