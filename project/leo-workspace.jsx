/* LEO — Investigation Workspace (Screen 4)
   Guides the analyst through contradiction review, archetype classification,
   verification steps, and documented resolution for a specific finding. */
const { useState: useStateW } = React;

const ARCHETYPE_ICONS = {
  "borrowed-stability":   "shield",
  "human-middleware":     "route",
  "intent-drift":         "zap",
  "reconciliation-failure": "alert",
  "ownership-failure":    "user",
};

const RESOLUTION_CFG = {
  open:        { color: "oklch(0.50 0.20 27)",  bg: "oklch(0.60 0.20 27 / 0.10)", border: "oklch(0.60 0.20 27 / 0.35)" },
  "in-progress":{ color: "oklch(0.50 0.16 42)", bg: "oklch(0.70 0.16 52 / 0.10)", border: "oklch(0.70 0.16 52 / 0.30)" },
  resolved:    { color: "oklch(0.46 0.12 152)", bg: "oklch(0.66 0.13 152 / 0.10)", border: "oklch(0.66 0.13 152 / 0.28)" },
  dismissed:   { color: "var(--ink-3)",          bg: "var(--surface-2)",            border: "var(--border)" },
};

// ── Finding picker (same visual idiom as investigation view) ────────────────
function WsFindingSwitcher({ findings, activeId, onSelect }) {
  return (
    <div className="row" style={{ gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
      {findings.map((f) => (
        <button key={f.id} onClick={() => onSelect(f.id)} className="tag" style={{
          cursor: "pointer", padding: "6px 11px", fontSize: 11.5,
          borderColor: f.id === activeId ? dimColor(f.dim) : "var(--border)",
          background: f.id === activeId ? "var(--surface)" : "var(--surface-2)",
          color: f.id === activeId ? "var(--ink)" : "var(--ink-3)",
          fontWeight: f.id === activeId ? 700 : 500, fontFamily: "var(--mono)",
        }}>
          <span style={{ display: "inline-block", width: 7, height: 7, borderRadius: 2, background: dimColor(f.dim), marginRight: 6, verticalAlign: "middle" }} />
          {f.id}
        </button>
      ))}
    </div>
  );
}

// ── Contradiction overview (dark panel, full width) ─────────────────────────
function ContradictionPanel({ ws, finding }) {
  return (
    <div className="dpanel">
      <div className="dpanel-head">
        <div>
          <div className="dpanel-eyebrow">Continuity break · {finding.id} · {finding.where}</div>
          <div className="dpanel-title">Contradiction overview</div>
        </div>
        <div className="row" style={{ marginLeft: "auto", gap: 10, flexShrink: 0 }}>
          <span className={"sev " + finding.severity}>{finding.severity}</span>
          <span className="mono" style={{ fontSize: 11, color: "var(--d-ink-3)" }}>
            {Math.round(finding.confidence * 100)}% confidence
          </span>
        </div>
      </div>
      <div className="dpanel-body">
        <div className="ws-contradiction-grid">
          <div className="ws-contra-col ws-contra-observed">
            <div className="ws-contra-label">Observed</div>
            <div className="ws-contra-text">{ws.contradiction.observed}</div>
          </div>
          <div className="ws-contra-divider" />
          <div className="ws-contra-col ws-contra-expected">
            <div className="ws-contra-label">Expected</div>
            <div className="ws-contra-text">{ws.contradiction.expected}</div>
          </div>
        </div>
        <div className="ws-delta">
          <Ic name="alert" size={14} style={{ flexShrink: 0, marginTop: 1 }} />
          <span>{ws.contradiction.delta}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 12 }}>
          <div className="ws-dims-row">
            {ws.affectedDims.map((dk) => <DimChip key={dk} dimKey={dk} solid />)}
          </div>
          <span style={{ fontSize: 11.5, color: "var(--d-ink-3)", fontFamily: "var(--mono)" }}>
            {ws.affectedDims.length} dimension{ws.affectedDims.length !== 1 ? "s" : ""} degraded
          </span>
        </div>
      </div>
    </div>
  );
}

// ── Evidence chain (reused from investigation, dark panel) ──────────────────
function WsEvidenceCard({ ev, last }) {
  const parts = ev.highlight ? ev.quote.split(ev.highlight) : [ev.quote];
  return (
    <React.Fragment>
      <div className="ev-card">
        <div className="ev-head">
          <span className="sq" style={{ width: 10, height: 10, borderRadius: 3, background: dimColor(ev.dim), flex: "none" }} />
          <span className="ev-type">{ev.type}</span>
          <span className="ev-src" style={{ marginLeft: "auto" }}>{ev.id}</span>
        </div>
        <div className="ev-quote">
          {parts[0]}
          {ev.highlight && <mark>{ev.highlight}</mark>}
          {parts[1]}
        </div>
        <div className="ev-foot">
          <span>{ev.actor}</span><span>·</span><span>{ev.source}</span><span>·</span><span>{ev.t}</span>
        </div>
      </div>
      {!last && <div className="ev-connector" />}
    </React.Fragment>
  );
}

// ── Affected dimensions panel (light, shows scores for this workflow) ────────
function AffectedDimensions({ dims, wfId }) {
  const wf = window.LEO_DATA.WORKFLOWS.find((w) => w.id === wfId);
  return (
    <div className="panel" style={{ padding: "16px 18px" }}>
      <div className="section-label" style={{ marginTop: 0 }}>
        <Ic name="layers" size={13} /> Affected continuity dimensions
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 13 }}>
        {dims.map((dk) => {
          const m = dimMeta(dk);
          const score = wf ? wf.scores[dk] : 0;
          const t = riskTier(score);
          return (
            <div key={dk}>
              <div style={{ display: "grid", gridTemplateColumns: "14px 114px 1fr 36px", alignItems: "center", gap: 12, marginBottom: 5 }}>
                <span style={{ width: 11, height: 11, borderRadius: 3, background: dimColor(dk), display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: 12.5, fontWeight: 600 }}>{m.label}</span>
                <div style={{ height: 7, background: "var(--border)", borderRadius: 4, overflow: "hidden" }}>
                  <div style={{ width: score + "%", height: "100%", background: dimColor(dk), borderRadius: 4 }} />
                </div>
                <span style={{ fontFamily: "var(--mono)", fontSize: 12, textAlign: "right", color: t.color, fontWeight: 700 }}>{score}</span>
              </div>
              <div style={{ fontSize: 11.5, color: "var(--ink-3)", paddingLeft: 26, lineHeight: 1.45 }}>{m.desc}</div>
            </div>
          );
        })}
      </div>
      <div style={{ marginTop: 14, fontSize: 11.5, color: "var(--ink-3)", lineHeight: 1.5 }}>
        Scores reflect cumulative degradation for this workflow. Higher score = greater degradation in that dimension.
      </div>
    </div>
  );
}

// ── Archetype card ──────────────────────────────────────────────────────────
function ArchetypeCard({ arch, confidence, rationale }) {
  const pct = Math.round(confidence * 100);
  return (
    <div className="ws-archetype">
      <div className="ws-arch-head">
        <div className="ws-arch-icon">
          <Ic name={ARCHETYPE_ICONS[arch.key] || "spark"} size={15} />
        </div>
        <div className="ws-arch-name">{arch.label}</div>
        <span className="ws-arch-conf">{pct}%</span>
      </div>
      <div className="ws-arch-bar">
        <div className="ws-arch-bar-fill" style={{ width: pct + "%" }} />
      </div>
      <div className="ws-arch-desc">{arch.desc}</div>
      <div className="ws-arch-rationale">{rationale}</div>
    </div>
  );
}

// ── Verification path (interactive checklist) ────────────────────────────────
function VerificationPath({ steps }) {
  const [checked, setChecked] = useStateW(new Set());
  const toggle = (i) =>
    setChecked((prev) => {
      const n = new Set(prev);
      if (n.has(i)) n.delete(i); else n.add(i);
      return n;
    });

  return (
    <div className="panel" style={{ padding: "16px 17px" }}>
      <div className="section-label" style={{ marginTop: 0 }}>
        <Ic name="target" size={13} /> Verification path · {steps.length} steps
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
        {steps.map((s, i) => (
          <button key={i} onClick={() => toggle(i)} style={{
            display: "flex", gap: 10, alignItems: "flex-start",
            background: "none", border: "none", padding: "2px 0",
            textAlign: "left", cursor: "pointer", width: "100%",
          }}>
            <span className="ws-vcheck" data-checked={checked.has(i) ? "1" : "0"}>
              {checked.has(i) && <Ic name="check" size={10} />}
            </span>
            <span style={{ flex: 1, minWidth: 0, lineHeight: 1.5 }}>
              <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--ink-4)", marginRight: 6 }}>
                {String(s.step).padStart(2, "0")}
              </span>
              <span style={{
                fontSize: 12.5, lineHeight: 1.5,
                color: checked.has(i) ? "var(--ink-3)" : "var(--ink)",
                textDecoration: checked.has(i) ? "line-through" : "none",
              }}>
                {s.action}
              </span>
            </span>
          </button>
        ))}
      </div>
      {checked.size > 0 && (
        <div style={{ marginTop: 12, padding: "7px 10px", background: "var(--accent-3)", borderRadius: 6, fontSize: 11.5, color: "var(--accent)", fontFamily: "var(--mono)" }}>
          {checked.size} / {steps.length} steps verified
        </div>
      )}
    </div>
  );
}

// ── Documentation panel ──────────────────────────────────────────────────────
function DocumentationPanel({ finding }) {
  const [notes, setNotes] = useStateW("");
  const [resolution, setResolution] = useStateW("open");
  const [saved, setSaved] = useStateW(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="panel" style={{ padding: "16px 17px" }}>
      <div className="section-label" style={{ marginTop: 0 }}>
        <Ic name="doc" size={13} /> Document findings · {finding.id}
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: "var(--ink-3)", marginBottom: 8 }}>Resolution status</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {Object.entries(RESOLUTION_CFG).map(([key, cfg]) => (
            <button key={key} onClick={() => setResolution(key)} style={{
              fontSize: 11, fontFamily: "var(--mono)", padding: "4px 11px", borderRadius: 6, cursor: "pointer",
              border: `1px solid ${resolution === key ? cfg.border : "var(--border)"}`,
              background: resolution === key ? cfg.bg : "var(--surface-2)",
              color: resolution === key ? cfg.color : "var(--ink-3)",
              fontWeight: resolution === key ? 700 : 500,
              textTransform: "capitalize", transition: "all .12s",
            }}>
              {key}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: 14 }}>
        <div style={{ fontSize: 11.5, fontWeight: 500, color: "var(--ink-3)", marginBottom: 8 }}>Investigation notes</div>
        <textarea
          className="ws-textarea"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Document what you found, decisions made, who was notified, and next steps…"
        />
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: 8 }}>
        <button className="btn primary" onClick={handleSave} style={{ flex: 1, justifyContent: "center" }}>
          <Ic name={saved ? "check" : "doc"} />
          {saved ? "Saved" : "Save findings"}
        </button>
        <button className="btn" style={{ flex: 1, justifyContent: "center" }}>
          <Ic name="route" /> Route for review
        </button>
      </div>
      <button className="btn" style={{ width: "100%", justifyContent: "center", boxSizing: "border-box" }}>
        <Ic name="shield" /> Add to QI review
      </button>

      <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 13, lineHeight: 1.5, fontFamily: "var(--mono)" }}>
        Findings are logged to the workflow audit trail with analyst attribution and timestamp.
      </div>
    </div>
  );
}

// ── Main workspace view ──────────────────────────────────────────────────────
function InvestigationWorkspace({ findingId, wfId, onInvestigation }) {
  const D = window.LEO_DATA;
  const findings = D.FINDINGS;
  const [activeId, setActive] = useStateW(findingId || findings[0].id);

  const finding = findings.find((f) => f.id === activeId) || findings[0];
  const ws = D.WORKSPACE[finding.id];
  const evidence = finding.evidence.map((e) => D.EVIDENCE[e]).filter(Boolean);

  const archetypeCards = ws
    ? ws.archetypes
        .map((a) => {
          const meta = D.ARCHETYPES.find((arch) => arch.key === a.key);
          return meta ? { ...meta, confidence: a.confidence, rationale: a.rationale } : null;
        })
        .filter(Boolean)
    : [];

  return (
    <div className="page fade-in">
      {/* Page header */}
      <div className="page-head">
        <button className="crumb-btn" onClick={onInvestigation}
          style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <Ic name="arrowL" size={14} /> Back to investigation
        </button>
        <div className="eyebrow">Investigation Workspace · {wfId}</div>
        <h1 className="page-title">{finding.title}</h1>
        <div className="row" style={{ gap: 12, marginTop: 10, flexWrap: "wrap" }}>
          <span className={"sev " + finding.severity}>{finding.severity}</span>
          <DimChip dimKey={finding.dim} solid />
          <span className="muted mono" style={{ fontSize: 12, whiteSpace: "nowrap" }}>{finding.where}</span>
          <span className="muted" style={{ fontSize: 12.5 }}>
            confidence <b style={{ color: "var(--ink)" }}>{Math.round(finding.confidence * 100)}%</b>
          </span>
        </div>
      </div>

      <WsFindingSwitcher findings={findings} activeId={activeId} onSelect={setActive} />

      {/* Contradiction overview — full width */}
      {ws && (
        <div style={{ marginBottom: 18 }}>
          <ContradictionPanel ws={ws} finding={finding} />
        </div>
      )}

      {/* Main 2-col grid */}
      {ws ? (
        <div className="ws-grid">
          {/* Left col: evidence chain + affected dimensions */}
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div className="dpanel">
              <div className="dpanel-head">
                <div>
                  <div className="dpanel-eyebrow">Supporting evidence · {evidence.length} item{evidence.length !== 1 ? "s" : ""}</div>
                  <div className="dpanel-title">Evidence chain</div>
                </div>
              </div>
              <div className="dpanel-body" style={{ paddingTop: 16 }}>
                <div className="evidence-chain">
                  {evidence.map((ev, i) => (
                    <WsEvidenceCard key={ev.id} ev={ev} last={i === evidence.length - 1} />
                  ))}
                </div>
              </div>
            </div>

            <AffectedDimensions dims={ws.affectedDims} wfId={wfId} />
          </div>

          {/* Right col: archetypes + verification + documentation */}
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div className="panel" style={{ padding: "16px 17px" }}>
              <div className="section-label" style={{ marginTop: 0 }}>
                <Ic name="spark" size={13} /> Suspected archetypes · {archetypeCards.length}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {archetypeCards.map((a) => (
                  <ArchetypeCard key={a.key} arch={a} confidence={a.confidence} rationale={a.rationale} />
                ))}
              </div>
              <div style={{ marginTop: 14, fontSize: 11, color: "var(--ink-3)", lineHeight: 1.5, fontFamily: "var(--mono)" }}>
                Archetypes identify recurring failure patterns to guide systemic intervention beyond the immediate break.
              </div>
            </div>

            <VerificationPath steps={ws.verificationPath} />

            <DocumentationPanel finding={finding} />
          </div>
        </div>
      ) : (
        <div className="panel" style={{ padding: "28px 24px", textAlign: "center" }}>
          <div className="muted" style={{ fontSize: 13 }}>No workspace data available for this finding.</div>
        </div>
      )}
    </div>
  );
}

window.InvestigationWorkspace = InvestigationWorkspace;
