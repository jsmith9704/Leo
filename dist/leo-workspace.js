/* LEO — Investigation Workspace (Screen 4)
   Guides the analyst through contradiction review, archetype classification,
   verification steps, and documented resolution for a specific finding. */
const {
  useState: useStateW
} = React;
const ARCHETYPE_ICONS = {
  "borrowed-stability": "shield",
  "human-middleware": "route",
  "intent-drift": "zap",
  "reconciliation-failure": "alert",
  "ownership-failure": "user"
};
const RESOLUTION_CFG = {
  open: {
    color: "oklch(0.50 0.20 27)",
    bg: "oklch(0.60 0.20 27 / 0.10)",
    border: "oklch(0.60 0.20 27 / 0.35)"
  },
  "in-progress": {
    color: "oklch(0.50 0.16 42)",
    bg: "oklch(0.70 0.16 52 / 0.10)",
    border: "oklch(0.70 0.16 52 / 0.30)"
  },
  resolved: {
    color: "oklch(0.46 0.12 152)",
    bg: "oklch(0.66 0.13 152 / 0.10)",
    border: "oklch(0.66 0.13 152 / 0.28)"
  },
  dismissed: {
    color: "var(--ink-3)",
    bg: "var(--surface-2)",
    border: "var(--border)"
  }
};

// ── Finding picker (same visual idiom as investigation view) ────────────────
function WsFindingSwitcher({
  findings,
  activeId,
  onSelect
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 8,
      marginBottom: 20,
      flexWrap: "wrap"
    }
  }, findings.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    onClick: () => onSelect(f.id),
    className: "tag",
    style: {
      cursor: "pointer",
      padding: "6px 11px",
      fontSize: 11.5,
      borderColor: f.id === activeId ? dimColor(f.dim) : "var(--border)",
      background: f.id === activeId ? "var(--surface)" : "var(--surface-2)",
      color: f.id === activeId ? "var(--ink)" : "var(--ink-3)",
      fontWeight: f.id === activeId ? 700 : 500,
      fontFamily: "var(--mono)"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: "inline-block",
      width: 7,
      height: 7,
      borderRadius: 2,
      background: dimColor(f.dim),
      marginRight: 6,
      verticalAlign: "middle"
    }
  }), f.id)));
}

// ── Contradiction overview (dark panel, full width) ─────────────────────────
function ContradictionPanel({
  ws,
  finding
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "dpanel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dpanel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dpanel-eyebrow"
  }, "Continuity break \xB7 ", finding.id, " \xB7 ", finding.where), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-title"
  }, "Contradiction overview")), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      marginLeft: "auto",
      gap: 10,
      flexShrink: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sev " + finding.severity
  }, finding.severity), /*#__PURE__*/React.createElement("span", {
    className: "mono",
    style: {
      fontSize: 11,
      color: "var(--d-ink-3)"
    }
  }, Math.round(finding.confidence * 100), "% confidence"))), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-contradiction-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-col ws-contra-observed"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-label"
  }, "Observed"), /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-text"
  }, ws.contradiction.observed)), /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-divider"
  }), /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-col ws-contra-expected"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-label"
  }, "Expected"), /*#__PURE__*/React.createElement("div", {
    className: "ws-contra-text"
  }, ws.contradiction.expected))), /*#__PURE__*/React.createElement("div", {
    className: "ws-delta"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "alert",
    size: 14,
    style: {
      flexShrink: 0,
      marginTop: 1
    }
  }), /*#__PURE__*/React.createElement("span", null, ws.contradiction.delta)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      flexWrap: "wrap",
      gap: 12
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-dims-row"
  }, ws.affectedDims.map(dk => /*#__PURE__*/React.createElement(DimChip, {
    key: dk,
    dimKey: dk,
    solid: true
  }))), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 11.5,
      color: "var(--d-ink-3)",
      fontFamily: "var(--mono)"
    }
  }, ws.affectedDims.length, " dimension", ws.affectedDims.length !== 1 ? "s" : "", " degraded"))));
}

// ── Evidence chain (reused from investigation, dark panel) ──────────────────
function WsEvidenceCard({
  ev,
  last
}) {
  const parts = ev.highlight ? ev.quote.split(ev.highlight) : [ev.quote];
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
  }, ev.type), /*#__PURE__*/React.createElement("span", {
    className: "ev-src",
    style: {
      marginLeft: "auto"
    }
  }, ev.id)), /*#__PURE__*/React.createElement("div", {
    className: "ev-quote"
  }, parts[0], ev.highlight && /*#__PURE__*/React.createElement("mark", null, ev.highlight), parts[1]), /*#__PURE__*/React.createElement("div", {
    className: "ev-foot"
  }, /*#__PURE__*/React.createElement("span", null, ev.actor), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, ev.source), /*#__PURE__*/React.createElement("span", null, "\xB7"), /*#__PURE__*/React.createElement("span", null, ev.t))), !last && /*#__PURE__*/React.createElement("div", {
    className: "ev-connector"
  }));
}

// ── Affected dimensions panel (light, shows scores for this workflow) ────────
function AffectedDimensions({
  dims,
  wfId
}) {
  const wf = window.LEO_DATA.WORKFLOWS.find(w => w.id === wfId);
  return /*#__PURE__*/React.createElement("div", {
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
    name: "layers",
    size: 13
  }), " Affected continuity dimensions"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 13
    }
  }, dims.map(dk => {
    const m = dimMeta(dk);
    const score = wf ? wf.scores[dk] : 0;
    const t = riskTier(score);
    return /*#__PURE__*/React.createElement("div", {
      key: dk
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        display: "grid",
        gridTemplateColumns: "14px 114px 1fr 36px",
        alignItems: "center",
        gap: 12,
        marginBottom: 5
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        width: 11,
        height: 11,
        borderRadius: 3,
        background: dimColor(dk),
        display: "inline-block",
        flexShrink: 0
      }
    }), /*#__PURE__*/React.createElement("span", {
      style: {
        fontSize: 12.5,
        fontWeight: 600
      }
    }, m.label), /*#__PURE__*/React.createElement("div", {
      style: {
        height: 7,
        background: "var(--border)",
        borderRadius: 4,
        overflow: "hidden"
      }
    }, /*#__PURE__*/React.createElement("div", {
      style: {
        width: score + "%",
        height: "100%",
        background: dimColor(dk),
        borderRadius: 4
      }
    })), /*#__PURE__*/React.createElement("span", {
      style: {
        fontFamily: "var(--mono)",
        fontSize: 12,
        textAlign: "right",
        color: t.color,
        fontWeight: 700
      }
    }, score)), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 11.5,
        color: "var(--ink-3)",
        paddingLeft: 26,
        lineHeight: 1.45
      }
    }, m.desc));
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 11.5,
      color: "var(--ink-3)",
      lineHeight: 1.5
    }
  }, "Scores reflect cumulative degradation for this workflow. Higher score = greater degradation in that dimension."));
}

// ── Archetype card ──────────────────────────────────────────────────────────
function ArchetypeCard({
  arch,
  confidence,
  rationale
}) {
  const pct = Math.round(confidence * 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "ws-archetype"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-icon"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: ARCHETYPE_ICONS[arch.key] || "spark",
    size: 15
  })), /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-name"
  }, arch.label), /*#__PURE__*/React.createElement("span", {
    className: "ws-arch-conf"
  }, pct, "%")), /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-bar-fill",
    style: {
      width: pct + "%"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-desc"
  }, arch.desc), /*#__PURE__*/React.createElement("div", {
    className: "ws-arch-rationale"
  }, rationale));
}

// ── Verification path (interactive checklist) ────────────────────────────────
function VerificationPath({
  steps
}) {
  const [checked, setChecked] = useStateW(new Set());
  const toggle = i => setChecked(prev => {
    const n = new Set(prev);
    if (n.has(i)) n.delete(i);else n.add(i);
    return n;
  });
  return /*#__PURE__*/React.createElement("div", {
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
  }, steps.map((s, i) => /*#__PURE__*/React.createElement("button", {
    key: i,
    onClick: () => toggle(i),
    style: {
      display: "flex",
      gap: 10,
      alignItems: "flex-start",
      background: "none",
      border: "none",
      padding: "2px 0",
      textAlign: "left",
      cursor: "pointer",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ws-vcheck",
    "data-checked": checked.has(i) ? "1" : "0"
  }, checked.has(i) && /*#__PURE__*/React.createElement(Ic, {
    name: "check",
    size: 10
  })), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0,
      lineHeight: 1.5
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--mono)",
      fontSize: 10.5,
      color: "var(--ink-4)",
      marginRight: 6
    }
  }, String(s.step).padStart(2, "0")), /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      lineHeight: 1.5,
      color: checked.has(i) ? "var(--ink-3)" : "var(--ink)",
      textDecoration: checked.has(i) ? "line-through" : "none"
    }
  }, s.action))))), checked.size > 0 && /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 12,
      padding: "7px 10px",
      background: "var(--accent-3)",
      borderRadius: 6,
      fontSize: 11.5,
      color: "var(--accent)",
      fontFamily: "var(--mono)"
    }
  }, checked.size, " / ", steps.length, " steps verified"));
}

// ── Documentation panel ──────────────────────────────────────────────────────
function DocumentationPanel({
  finding
}) {
  const [notes, setNotes] = useStateW("");
  const [resolution, setResolution] = useStateW("open");
  const [saved, setSaved] = useStateW(false);
  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return /*#__PURE__*/React.createElement("div", {
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
    name: "doc",
    size: 13
  }), " Document findings \xB7 ", finding.id), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      fontWeight: 500,
      color: "var(--ink-3)",
      marginBottom: 8
    }
  }, "Resolution status"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 6,
      flexWrap: "wrap"
    }
  }, Object.entries(RESOLUTION_CFG).map(([key, cfg]) => /*#__PURE__*/React.createElement("button", {
    key: key,
    onClick: () => setResolution(key),
    style: {
      fontSize: 11,
      fontFamily: "var(--mono)",
      padding: "4px 11px",
      borderRadius: 6,
      cursor: "pointer",
      border: `1px solid ${resolution === key ? cfg.border : "var(--border)"}`,
      background: resolution === key ? cfg.bg : "var(--surface-2)",
      color: resolution === key ? cfg.color : "var(--ink-3)",
      fontWeight: resolution === key ? 700 : 500,
      textTransform: "capitalize",
      transition: "all .12s"
    }
  }, key)))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      fontWeight: 500,
      color: "var(--ink-3)",
      marginBottom: 8
    }
  }, "Investigation notes"), /*#__PURE__*/React.createElement("textarea", {
    className: "ws-textarea",
    value: notes,
    onChange: e => setNotes(e.target.value),
    placeholder: "Document what you found, decisions made, who was notified, and next steps\u2026"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      gap: 8,
      marginBottom: 8
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: handleSave,
    style: {
      flex: 1,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: saved ? "check" : "doc"
  }), saved ? "Saved" : "Save findings"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    style: {
      flex: 1,
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "route"
  }), " Route for review")), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    style: {
      width: "100%",
      justifyContent: "center",
      boxSizing: "border-box"
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "shield"
  }), " Add to QI review"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--ink-3)",
      marginTop: 13,
      lineHeight: 1.5,
      fontFamily: "var(--mono)"
    }
  }, "Findings are logged to the workflow audit trail with analyst attribution and timestamp."));
}

// ── Main workspace view ──────────────────────────────────────────────────────
function InvestigationWorkspace({
  findingId,
  wfId,
  onInvestigation
}) {
  const D = window.LEO_DATA;
  const findings = D.FINDINGS;
  const [activeId, setActive] = useStateW(findingId || findings[0].id);
  const finding = findings.find(f => f.id === activeId) || findings[0];
  const ws = D.WORKSPACE[finding.id];
  const evidence = finding.evidence.map(e => D.EVIDENCE[e]).filter(Boolean);
  const archetypeCards = ws ? ws.archetypes.map(a => {
    const meta = D.ARCHETYPES.find(arch => arch.key === a.key);
    return meta ? {
      ...meta,
      confidence: a.confidence,
      rationale: a.rationale
    } : null;
  }).filter(Boolean) : [];
  return /*#__PURE__*/React.createElement("div", {
    className: "page fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("button", {
    className: "crumb-btn",
    onClick: onInvestigation,
    style: {
      marginBottom: 10,
      display: "flex",
      alignItems: "center",
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "arrowL",
    size: 14
  }), " Back to investigation"), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Investigation Workspace \xB7 ", wfId), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, finding.title), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 12,
      marginTop: 10,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sev " + finding.severity
  }, finding.severity), /*#__PURE__*/React.createElement(DimChip, {
    dimKey: finding.dim,
    solid: true
  }), /*#__PURE__*/React.createElement("span", {
    className: "muted mono",
    style: {
      fontSize: 12,
      whiteSpace: "nowrap"
    }
  }, finding.where), /*#__PURE__*/React.createElement("span", {
    className: "muted",
    style: {
      fontSize: 12.5
    }
  }, "confidence ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--ink)"
    }
  }, Math.round(finding.confidence * 100), "%")))), /*#__PURE__*/React.createElement(WsFindingSwitcher, {
    findings: findings,
    activeId: activeId,
    onSelect: setActive
  }), ws && /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement(ContradictionPanel, {
    ws: ws,
    finding: finding
  })), ws ? /*#__PURE__*/React.createElement("div", {
    className: "ws-grid"
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "dpanel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dpanel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dpanel-eyebrow"
  }, "Supporting evidence \xB7 ", evidence.length, " item", evidence.length !== 1 ? "s" : ""), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-title"
  }, "Evidence chain"))), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-body",
    style: {
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "evidence-chain"
  }, evidence.map((ev, i) => /*#__PURE__*/React.createElement(WsEvidenceCard, {
    key: ev.id,
    ev: ev,
    last: i === evidence.length - 1
  }))))), /*#__PURE__*/React.createElement(AffectedDimensions, {
    dims: ws.affectedDims,
    wfId: wfId
  })), /*#__PURE__*/React.createElement("div", {
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
  }), " Suspected archetypes \xB7 ", archetypeCards.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, archetypeCards.map(a => /*#__PURE__*/React.createElement(ArchetypeCard, {
    key: a.key,
    arch: a,
    confidence: a.confidence,
    rationale: a.rationale
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 14,
      fontSize: 11,
      color: "var(--ink-3)",
      lineHeight: 1.5,
      fontFamily: "var(--mono)"
    }
  }, "Archetypes identify recurring failure patterns to guide systemic intervention beyond the immediate break.")), /*#__PURE__*/React.createElement(VerificationPath, {
    steps: ws.verificationPath
  }), /*#__PURE__*/React.createElement(DocumentationPanel, {
    finding: finding
  }))) : /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      padding: "28px 24px",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 13
    }
  }, "No workspace data available for this finding.")));
}
window.InvestigationWorkspace = InvestigationWorkspace;