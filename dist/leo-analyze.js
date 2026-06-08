/* LEO — Screen 5: Analyze a real case
   Free-text (and optional structured) intake → Claude analysis via the
   analyze-case Edge Function → rendered in LEO's continuity language. */
const {
  useState: useStateAn,
  useEffect: useEffectAn
} = React;
const STRUCTURED_TEMPLATE = "ENCOUNTER / VISIT NOTE:\n\n\n" + "REFERRAL / ORDER:\n\n\n" + "MESSAGES / HANDOFFS:\n\n\n" + "SCHEDULING / TIMING:\n\n\n" + "CURRENT STATUS / AUDIT:\n\n";

// ── Intake screen ─────────────────────────────────────────────────────────────
function AnalyzeCase({
  onOpenCase,
  user,
  demo
}) {
  const [text, setText] = useStateAn("");
  const [showStructured, setShowStructured] = useStateAn(false);
  const [structured, setStructured] = useStateAn(STRUCTURED_TEMPLATE);
  const [busy, setBusy] = useStateAn(false);
  const [error, setError] = useStateAn(null);
  const [recent, setRecent] = useStateAn([]);
  const [loadingRecent, setLoadingRecent] = useStateAn(true);
  useEffectAn(() => {
    if (demo) {
      setLoadingRecent(false);
      return;
    } // no DB reads in public demo
    window.LEO_DB.loadCases().then(rows => {
      setRecent(rows || []);
      setLoadingRecent(false);
    }).catch(() => setLoadingRecent(false));
  }, []);
  // Load the Tally popup script when the public demo gate is shown.
  useEffectAn(() => {
    if (!demo) return;
    if (document.getElementById("tally-embed-script")) return;
    var s = document.createElement("script");
    s.id = "tally-embed-script";
    s.src = "https://tally.so/widgets/embed.js";
    s.async = true;
    document.body.appendChild(s);
  }, []);
  const canAnalyze = text.trim().length >= 20 && !busy;
  const handleAnalyze = async () => {
    if (!canAnalyze) return;
    setBusy(true);
    setError(null);
    try {
      const struct = showStructured && structured.trim() !== STRUCTURED_TEMPLATE.trim() ? structured : null;
      const saved = await window.LEO_DB.analyzeCase(text, struct);
      if (saved && saved.id) {
        onOpenCase(saved.id);
      } else {
        throw new Error("No analysis was returned.");
      }
    } catch (err) {
      setError(err.message || "Analysis failed. Please try again.");
    } finally {
      setBusy(false);
    }
  };
  if (demo) {
    return /*#__PURE__*/React.createElement("div", {
      className: "page fade-in"
    }, /*#__PURE__*/React.createElement("div", {
      className: "page-head"
    }, /*#__PURE__*/React.createElement("div", {
      className: "eyebrow"
    }, "Analyze case"), /*#__PURE__*/React.createElement("h1", {
      className: "page-title"
    }, "Submit a case for continuity analysis"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: "8px 0 0",
        color: "var(--ink-3)",
        fontSize: 13.5,
        lineHeight: 1.55,
        maxWidth: 680
      }
    }, "Paste raw case material \u2014 an encounter note, referral order, in-basket messages, a discharge summary, scheduling or audit records. LEO detects continuity breaks, scores the six dimensions, links the evidence, and suggests failure archetypes.")), /*#__PURE__*/React.createElement("div", {
      className: "panel",
      style: {
        padding: "30px 28px",
        maxWidth: 580
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 44,
        borderRadius: 11,
        display: "grid",
        placeItems: "center",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        marginBottom: 16
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "shield",
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 16,
        fontWeight: 700,
        color: "var(--ink)",
        marginBottom: 8
      }
    }, "Pilot access required"), /*#__PURE__*/React.createElement("p", {
      style: {
        margin: 0,
        color: "var(--ink-3)",
        fontSize: 13,
        lineHeight: 1.6
      }
    }, "Live case analysis is part of the LEO pilot. This public demo shows LEO's full interface and a worked synthetic example \u2014 but submitting a new case and running AI analysis are disabled here. Request pilot access to analyze your own de-identified cases."), /*#__PURE__*/React.createElement("button", {
      className: "btn primary",
      onClick: function () {
        try {
          if (window.Tally && typeof window.Tally.openPopup === "function") {
            window.Tally.openPopup("9q4oq1", {
              layout: "modal",
              width: 540
            });
            return;
          }
        } catch (e) {}
        window.open("https://tally.so/r/9q4oq1", "_blank", "noopener");
      },
      style: {
        marginTop: 16
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "spark",
      size: 14
    }), " Request pilot access")));
  }
  return /*#__PURE__*/React.createElement("div", {
    className: "page fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Analyze case"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Submit a case for continuity analysis"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "8px 0 0",
      color: "var(--ink-3)",
      fontSize: 13.5,
      lineHeight: 1.55,
      maxWidth: 680
    }
  }, "Paste raw case material \u2014 an encounter note, referral order, in-basket messages, a discharge summary, scheduling or audit records. LEO will detect continuity breaks, score the six dimensions, link the evidence, and suggest failure archetypes. Use de-identified data only.")), /*#__PURE__*/React.createElement("div", {
    className: "ws-grid"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      padding: "16px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label",
    style: {
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "doc",
    size: 13
  }), " Case material"), /*#__PURE__*/React.createElement("textarea", {
    className: "ws-textarea",
    value: text,
    onChange: e => setText(e.target.value),
    placeholder: "Paste the case here \u2014 notes, orders, messages, timestamps, status\u2026",
    style: {
      minHeight: 280,
      fontFamily: "var(--mono)",
      fontSize: 12.5,
      lineHeight: 1.6
    },
    disabled: busy
  }), /*#__PURE__*/React.createElement("button", {
    onClick: () => setShowStructured(v => !v),
    style: {
      marginTop: 12,
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--accent)",
      fontFamily: "var(--sans)",
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: showStructured ? "check" : "layers",
    size: 13
  }), showStructured ? "Structured context added" : "Add structured context (optional)"), showStructured && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      marginBottom: 8,
      lineHeight: 1.5
    }
  }, "Optional \u2014 organize the material by stage to help LEO trace the workflow. Leave blank sections out."), /*#__PURE__*/React.createElement("textarea", {
    className: "ws-textarea",
    value: structured,
    onChange: e => setStructured(e.target.value),
    style: {
      minHeight: 180,
      fontFamily: "var(--mono)",
      fontSize: 12,
      lineHeight: 1.6
    },
    disabled: busy
  })), error && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      padding: "10px 12px",
      background: "oklch(0.60 0.20 27 / 0.08)",
      border: "1px solid oklch(0.60 0.20 27 / 0.28)",
      borderRadius: 8,
      fontSize: 12.5,
      color: "oklch(0.50 0.20 27)",
      lineHeight: 1.5
    }
  }, error), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginTop: 16
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: handleAnalyze,
    disabled: !canAnalyze,
    style: {
      opacity: canAnalyze ? 1 : 0.55
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: busy ? "pulse" : "spark"
  }), " ", busy ? "LEO is analyzing…" : "Analyze case"), text.trim().length > 0 && text.trim().length < 20 && /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)"
    }
  }, "Add more material to analyze.")), busy && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 11.5,
      color: "var(--ink-3)",
      fontFamily: "var(--mono)",
      lineHeight: 1.5
    }
  }, "Tracing handoffs, extracting evidence, and scoring continuity dimensions. This usually takes 10\u201325 seconds."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      padding: "16px 17px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label",
    style: {
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "flow",
    size: 13
  }), " Recent analyses"), loadingRecent ? /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12.5
    }
  }, "Loading\u2026") : recent.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12.5,
      lineHeight: 1.5
    }
  }, "No analyzed cases yet. Submit your first case to see it here.") : /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 8
    }
  }, recent.map(c => {
    const t = riskTier(c.overall_risk || 0);
    return /*#__PURE__*/React.createElement("button", {
      key: c.id,
      onClick: () => onOpenCase(c.id),
      style: {
        display: "block",
        textAlign: "left",
        width: "100%",
        cursor: "pointer",
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
        borderRadius: 9,
        padding: "10px 12px"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "flex",
        alignItems: "center",
        gap: 8
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 8,
        height: 8,
        borderRadius: 2,
        background: t.color,
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600,
        color: "var(--ink)",
        flex: 1,
        minWidth: 0,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, c.title), c.overall_risk != null && /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 11.5,
        fontWeight: 700,
        color: t.color
      }
    }, c.overall_risk)), c.context && /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11,
        color: "var(--ink-3)",
        marginTop: 4,
        paddingLeft: 16,
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
      }
    }, c.context), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 10.5,
        color: "var(--ink-4)",
        marginTop: 4,
        paddingLeft: 16,
        fontFamily: "var(--mono)"
      }
    }, c.submitted_by_name || "—", " \xB7 ", new Date(c.created_at).toLocaleDateString()));
  }))))));
}

// ── Evidence card (read-only, inline evidence) ────────────────────────────────
function CaseEvidenceCard({
  ev,
  last
}) {
  const parts = ev.highlight && ev.quote.includes(ev.highlight) ? ev.quote.split(ev.highlight) : [ev.quote];
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ev-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ev-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sq",
    style: {
      width: 10,
      height: 10,
      borderRadius: 3,
      background: dimColor(ev.dim),
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    className: "ev-type"
  }, ev.type)), /*#__PURE__*/React.createElement("div", {
    className: "ev-quote"
  }, parts[0], ev.highlight && parts.length > 1 && /*#__PURE__*/React.createElement("mark", null, ev.highlight), parts[1]), (ev.actor || ev.source || ev.t) && /*#__PURE__*/React.createElement("div", {
    className: "ev-foot"
  }, [ev.actor, ev.source, ev.t].filter(Boolean).map((x, i, arr) => /*#__PURE__*/React.createElement(React.Fragment, {
    key: i
  }, i > 0 && /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, x))))), !last && /*#__PURE__*/React.createElement("div", {
    className: "ev-connector"
  }));
}

// ── Archetype card (reads label/desc/icon from LEO_DATA) ──────────────────────
function CaseArchetypeCard({
  a
}) {
  const meta = window.LEO_DATA.ARCHETYPES.find(x => x.key === a.key);
  const pct = Math.round((a.confidence || 0) * 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "ws-archetype"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-icon"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: meta && meta.icon || "spark",
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-name"
  }, meta ? meta.label : a.key), /*#__PURE__*/React.createElement("span", {
    className: "ws-arch-conf"
  }, pct, "%")), /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-bar-fill",
    style: {
      width: pct + "%"
    }
  })), meta && /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-desc"
  }, meta.desc), /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-rationale"
  }, a.rationale));
}

// ── One finding block ─────────────────────────────────────────────────────────
function CaseFinding({
  f
}) {
  const m = dimMeta(f.dim);
  const evidence = f.evidence || [];
  const archetypes = f.archetypes || [];
  const steps = f.verificationPath || [];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dpanel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dpanel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dpanel-eyebrow"
  }, f.id, " \xB7 ", f.where), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-title"
  }, f.title)), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      marginLeft: "auto",
      gap: 10,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sev " + f.severity
  }, f.severity), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: "var(--d-ink-3)"
    }
  }, Math.round((f.confidence || 0) * 100), "% confidence"))), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-body"
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "0 0 16px",
      color: "var(--d-ink-2)",
      fontSize: 13,
      lineHeight: 1.6
    }
  }, f.detail), f.contradiction && /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    className: "ws-contradiction-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-col ws-contra-observed"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-label"
  }, "Observed"), /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-text"
  }, f.contradiction.observed)), /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-col ws-contra-expected"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-label"
  }, "Expected"), /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-text"
  }, f.contradiction.expected))), /*#__PURE__*/React.createElement("div", {
    className: "ws-delta"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "alert",
    size: 14,
    style: {
      flexShrink: 0,
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("span", null, f.contradiction.delta))), /*#__PURE__*/React.createElement("div", {
    className: "ws-dims-row"
  }, (f.affectedDims || [f.dim]).map(dk => /*#__PURE__*/React.createElement(DimChip, {
    key: dk,
    dimKey: dk,
    solid: true
  }))))), /*#__PURE__*/React.createElement("div", {
    className: "ws-grid",
    style: {
      marginTop: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dpanel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dpanel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dpanel-eyebrow"
  }, "Supporting evidence \xB7 ", evidence.length), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-title"
  }, "Evidence chain"))), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-body",
    style: {
      paddingTop: 16
    }
  }, evidence.length ? /*#__PURE__*/React.createElement("div", {
    className: "evidence-chain"
  }, evidence.map((ev, i) => /*#__PURE__*/React.createElement(CaseEvidenceCard, {
    key: i,
    ev: ev,
    last: i === evidence.length - 1
  }))) : /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 12.5,
      color: "var(--d-ink-3)"
    }
  }, "No direct quotes extracted for this finding."))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      padding: "16px 17px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label",
    style: {
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "spark",
    size: 13
  }), " Suspected archetypes \xB7 ", archetypes.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, archetypes.map((a, i) => /*#__PURE__*/React.createElement(CaseArchetypeCard, {
    key: i,
    a: a
  })), archetypes.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12.5
    }
  }, "None identified."))), steps.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      padding: "16px 17px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label",
    style: {
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "target",
    size: 13
  }), " Verification path \xB7 ", steps.length, " steps"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 10
    }
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("div", {
    key: i,
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--mono)",
      fontSize: 10.5,
      color: "var(--ink-4)",
      marginTop: 2
    }
  }, String(s.step ?? i + 1).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      lineHeight: 1.5,
      color: "var(--ink)"
    }
  }, s.action))))))));
}

// ── Analyzed-case view ────────────────────────────────────────────────────────
function AnalyzedCase({
  caseId,
  onBack
}) {
  const [row, setRow] = useStateAn(null);
  const [loading, setLoading] = useStateAn(true);
  useEffectAn(() => {
    setLoading(true);
    window.LEO_DB.loadCase(caseId).then(r => {
      setRow(r);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [caseId]);
  if (loading) {
    return /*#__PURE__*/React.createElement("div", {
      className: "page"
    }, /*#__PURE__*/React.createElement("div", {
      className: "muted",
      style: {
        fontSize: 13
      }
    }, "Loading analysis\u2026"));
  }
  if (!row || !row.analysis) {
    return /*#__PURE__*/React.createElement("div", {
      className: "page"
    }, /*#__PURE__*/React.createElement("button", {
      className: "crumb-btn",
      onClick: onBack,
      style: {
        marginBottom: 14,
        display: "flex",
        alignItems: "center",
        gap: 6
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "arrowL",
      size: 14
    }), " Back"), /*#__PURE__*/React.createElement("div", {
      className: "muted",
      style: {
        fontSize: 13
      }
    }, "Case not found."));
  }
  const a = row.analysis;
  const risk = a.overallRisk != null ? a.overallRisk : row.overall_risk || 0;
  const scores = a.dimensionScores || {};
  const findings = a.findings || [];
  const recs = a.recommendations || [];
  return /*#__PURE__*/React.createElement("div", {
    className: "page fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "crumb-btn",
    onClick: onBack,
    style: {
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "arrowL",
    size: 14
  }), " Back to Analyze"), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Analyzed case \xB7 ", row.submitted_by_name || "—"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, a.title || row.title), a.context && /*#__PURE__*/React.createElement("div", {
    className: "muted mono",
    style: {
      fontSize: 12.5,
      marginTop: 6
    }
  }, a.context), a.summary && /*#__PURE__*/React.createElement("p", {
    style: {
      margin: "12px 0 0",
      color: "var(--ink-2)",
      fontSize: 13.5,
      lineHeight: 1.6,
      maxWidth: 760
    }
  }, a.summary)), /*#__PURE__*/React.createElement("div", {
    className: "dpanel",
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dpanel-body",
    style: {
      display: "flex",
      gap: 28,
      alignItems: "center",
      flexWrap: "wrap",
      paddingTop: 20,
      paddingBottom: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement(Gauge, {
    score: risk
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1,
      minWidth: 280
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label on-dark",
    style: {
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "layers",
    size: 13
  }), " Continuity dimensions"), /*#__PURE__*/React.createElement(DimLegend, {
    scores: {
      information: scores.information || 0,
      intent: scores.intent || 0,
      ownership: scores.ownership || 0,
      action: scores.action || 0,
      timing: scores.timing || 0,
      verification: scores.verification || 0
    },
    dark: true
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--d-ink-3)",
      marginTop: 12,
      fontFamily: "var(--mono)"
    }
  }, "Higher score = greater degradation in that dimension.")))), /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "search",
    size: 13
  }), " Continuity breaks detected \xB7 ", findings.length), findings.length === 0 ? /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      padding: "24px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 13
    }
  }, "No meaningful continuity break detected \u2014 the loop appears intact.")) : findings.map((f, i) => /*#__PURE__*/React.createElement(CaseFinding, {
    key: f.id || i,
    f: f
  })), recs.length > 0 && /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      padding: "16px 18px",
      marginTop: 6
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label",
    style: {
      marginTop: 0
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "target",
    size: 13
  }), " Recommended actions"), recs.map((r, i) => /*#__PURE__*/React.createElement("div", {
    className: "rec",
    key: r.id || i,
    style: {
      marginTop: i ? 12 : 0
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "rec-title"
  }, /*#__PURE__*/React.createElement("span", {
    className: "rec-num"
  }, i + 1), r.title), /*#__PURE__*/React.createElement("div", {
    className: "rec-detail"
  }, r.detail), /*#__PURE__*/React.createElement("div", {
    className: "rec-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tag " + (r.priority === "Immediate" ? "immediate" : "systemic")
  }, r.priority), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, "Effort: ", r.effort), r.owner && /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "user",
    size: 11,
    style: {
      verticalAlign: "-1px",
      marginRight: 3
    }
  }), r.owner), (r.addresses || []).length > 0 && /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, r.addresses.join(", ")))))), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--ink-3)",
      marginTop: 16,
      lineHeight: 1.5,
      fontFamily: "var(--mono)"
    }
  }, "Generated by LEO from submitted material. Treat as decision support, not clinical advice \u2014 verify each finding against the source record using the verification paths above."));
}
window.AnalyzeCase = AnalyzeCase;
window.AnalyzedCase = AnalyzedCase;
