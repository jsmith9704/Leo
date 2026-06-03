/* LEO — Screen 5: Analyze a real case
   Free-text (and optional structured) intake → Claude analysis via the
   analyze-case Edge Function → rendered in LEO's continuity language. */
const { useState: useStateAn, useEffect: useEffectAn } = React;

const STRUCTURED_TEMPLATE =
  "ENCOUNTER / VISIT NOTE:\n\n\n" +
  "REFERRAL / ORDER:\n\n\n" +
  "MESSAGES / HANDOFFS:\n\n\n" +
  "SCHEDULING / TIMING:\n\n\n" +
  "CURRENT STATUS / AUDIT:\n\n";

// ── Intake screen ─────────────────────────────────────────────────────────────
function AnalyzeCase({ onOpenCase, user }) {
  const [text, setText] = useStateAn("");
  const [showStructured, setShowStructured] = useStateAn(false);
  const [structured, setStructured] = useStateAn(STRUCTURED_TEMPLATE);
  const [busy, setBusy] = useStateAn(false);
  const [error, setError] = useStateAn(null);
  const [recent, setRecent] = useStateAn([]);
  const [loadingRecent, setLoadingRecent] = useStateAn(true);

  useEffectAn(() => {
    window.LEO_DB.loadCases().then((rows) => {
      setRecent(rows || []);
      setLoadingRecent(false);
    }).catch(() => setLoadingRecent(false));
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

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="eyebrow">Analyze case</div>
        <h1 className="page-title">Submit a case for continuity analysis</h1>
        <p style={{ margin: "8px 0 0", color: "var(--ink-3)", fontSize: 13.5, lineHeight: 1.55, maxWidth: 680 }}>
          Paste raw case material — an encounter note, referral order, in-basket messages, a discharge
          summary, scheduling or audit records. LEO will detect continuity breaks, score the six
          dimensions, link the evidence, and suggest failure archetypes. Use de-identified data only.
        </p>
      </div>

      <div className="ws-grid">
        {/* Left: intake form */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="panel" style={{ padding: "16px 18px" }}>
            <div className="section-label" style={{ marginTop: 0 }}>
              <Ic name="doc" size={13} /> Case material
            </div>
            <textarea
              className="ws-textarea"
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Paste the case here — notes, orders, messages, timestamps, status…"
              style={{ minHeight: 280, fontFamily: "var(--mono)", fontSize: 12.5, lineHeight: 1.6 }}
              disabled={busy}
            />

            <button
              onClick={() => setShowStructured((v) => !v)}
              style={{
                marginTop: 12, background: "none", border: "none", padding: 0, cursor: "pointer",
                fontSize: 12.5, fontWeight: 600, color: "var(--accent)", fontFamily: "var(--sans)",
                display: "flex", alignItems: "center", gap: 6,
              }}>
              <Ic name={showStructured ? "check" : "layers"} size={13} />
              {showStructured ? "Structured context added" : "Add structured context (optional)"}
            </button>

            {showStructured && (
              <div style={{ marginTop: 12 }}>
                <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginBottom: 8, lineHeight: 1.5 }}>
                  Optional — organize the material by stage to help LEO trace the workflow. Leave blank
                  sections out.
                </div>
                <textarea
                  className="ws-textarea"
                  value={structured}
                  onChange={(e) => setStructured(e.target.value)}
                  style={{ minHeight: 180, fontFamily: "var(--mono)", fontSize: 12, lineHeight: 1.6 }}
                  disabled={busy}
                />
              </div>
            )}

            {error && (
              <div style={{
                marginTop: 14, padding: "10px 12px",
                background: "oklch(0.60 0.20 27 / 0.08)", border: "1px solid oklch(0.60 0.20 27 / 0.28)",
                borderRadius: 8, fontSize: 12.5, color: "oklch(0.50 0.20 27)", lineHeight: 1.5,
              }}>
                {error}
              </div>
            )}

            <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 16 }}>
              <button className="btn primary" onClick={handleAnalyze} disabled={!canAnalyze}
                style={{ opacity: canAnalyze ? 1 : 0.55 }}>
                <Ic name={busy ? "pulse" : "spark"} /> {busy ? "LEO is analyzing…" : "Analyze case"}
              </button>
              {text.trim().length > 0 && text.trim().length < 20 && (
                <span style={{ fontSize: 11.5, color: "var(--ink-3)" }}>Add more material to analyze.</span>
              )}
            </div>

            {busy && (
              <div style={{ marginTop: 14, fontSize: 11.5, color: "var(--ink-3)", fontFamily: "var(--mono)", lineHeight: 1.5 }}>
                Tracing handoffs, extracting evidence, and scoring continuity dimensions. This usually
                takes 10–25 seconds.
              </div>
            )}
          </div>
        </div>

        {/* Right: recent cases */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="panel" style={{ padding: "16px 17px" }}>
            <div className="section-label" style={{ marginTop: 0 }}>
              <Ic name="flow" size={13} /> Recent analyses
            </div>
            {loadingRecent ? (
              <div className="muted" style={{ fontSize: 12.5 }}>Loading…</div>
            ) : recent.length === 0 ? (
              <div className="muted" style={{ fontSize: 12.5, lineHeight: 1.5 }}>
                No analyzed cases yet. Submit your first case to see it here.
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                {recent.map((c) => {
                  const t = riskTier(c.overall_risk || 0);
                  return (
                    <button key={c.id} onClick={() => onOpenCase(c.id)} style={{
                      display: "block", textAlign: "left", width: "100%", cursor: "pointer",
                      background: "var(--surface-2)", border: "1px solid var(--border)",
                      borderRadius: 9, padding: "10px 12px",
                    }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <span style={{ width: 8, height: 8, borderRadius: 2, background: t.color, flexShrink: 0 }} />
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: "var(--ink)", flex: 1, minWidth: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {c.title}
                        </span>
                        {c.overall_risk != null && (
                          <span style={{ fontFamily: "var(--mono)", fontSize: 11.5, fontWeight: 700, color: t.color }}>{c.overall_risk}</span>
                        )}
                      </div>
                      {c.context && (
                        <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 4, paddingLeft: 16, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                          {c.context}
                        </div>
                      )}
                      <div style={{ fontSize: 10.5, color: "var(--ink-4)", marginTop: 4, paddingLeft: 16, fontFamily: "var(--mono)" }}>
                        {c.submitted_by_name || "—"} · {new Date(c.created_at).toLocaleDateString()}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Evidence card (read-only, inline evidence) ────────────────────────────────
function CaseEvidenceCard({ ev, last }) {
  const parts = ev.highlight && ev.quote.includes(ev.highlight) ? ev.quote.split(ev.highlight) : [ev.quote];
  return (
    <React.Fragment>
      <div className="ev-card">
        <div className="ev-head">
          <span className="sq" style={{ width: 10, height: 10, borderRadius: 3, background: dimColor(ev.dim), flex: "none" }} />
          <span className="ev-type">{ev.type}</span>
        </div>
        <div className="ev-quote">
          {parts[0]}
          {ev.highlight && parts.length > 1 && <mark>{ev.highlight}</mark>}
          {parts[1]}
        </div>
        {(ev.actor || ev.source || ev.t) && (
          <div className="ev-foot">
            {[ev.actor, ev.source, ev.t].filter(Boolean).map((x, i, arr) => (
              <React.Fragment key={i}>{i > 0 && <span>·</span>}<span>{x}</span></React.Fragment>
            ))}
          </div>
        )}
      </div>
      {!last && <div className="ev-connector" />}
    </React.Fragment>
  );
}

// ── Archetype card (reads label/desc/icon from LEO_DATA) ──────────────────────
function CaseArchetypeCard({ a }) {
  const meta = window.LEO_DATA.ARCHETYPES.find((x) => x.key === a.key);
  const pct = Math.round((a.confidence || 0) * 100);
  return (
    <div className="ws-archetype">
      <div className="ws-arch-head">
        <div className="ws-arch-icon"><Ic name={(meta && meta.icon) || "spark"} size={15} /></div>
        <div className="ws-arch-name">{meta ? meta.label : a.key}</div>
        <span className="ws-arch-conf">{pct}%</span>
      </div>
      <div className="ws-arch-bar"><div className="ws-arch-bar-fill" style={{ width: pct + "%" }} /></div>
      {meta && <div className="ws-arch-desc">{meta.desc}</div>}
      <div className="ws-arch-rationale">{a.rationale}</div>
    </div>
  );
}

// ── One finding block ─────────────────────────────────────────────────────────
function CaseFinding({ f }) {
  const m = dimMeta(f.dim);
  const evidence = f.evidence || [];
  const archetypes = f.archetypes || [];
  const steps = f.verificationPath || [];
  return (
    <div style={{ marginBottom: 18 }}>
      {/* Contradiction (dark) */}
      <div className="dpanel">
        <div className="dpanel-head">
          <div>
            <div className="dpanel-eyebrow">{f.id} · {f.where}</div>
            <div className="dpanel-title">{f.title}</div>
          </div>
          <div className="row" style={{ marginLeft: "auto", gap: 10, flexShrink: 0 }}>
            <span className={"sev " + f.severity}>{f.severity}</span>
            <span className="mono" style={{ fontSize: 11, color: "var(--d-ink-3)" }}>{Math.round((f.confidence || 0) * 100)}% confidence</span>
          </div>
        </div>
        <div className="dpanel-body">
          <p style={{ margin: "0 0 16px", color: "var(--d-ink-2)", fontSize: 13, lineHeight: 1.6 }}>{f.detail}</p>
          {f.contradiction && (
            <React.Fragment>
              <div className="ws-contradiction-grid">
                <div className="ws-contra-col ws-contra-observed">
                  <div className="ws-contra-label">Observed</div>
                  <div className="ws-contra-text">{f.contradiction.observed}</div>
                </div>
                <div className="ws-contra-divider" />
                <div className="ws-contra-col ws-contra-expected">
                  <div className="ws-contra-label">Expected</div>
                  <div className="ws-contra-text">{f.contradiction.expected}</div>
                </div>
              </div>
              <div className="ws-delta">
                <Ic name="alert" size={14} style={{ flexShrink: 0, marginTop: 1 }} />
                <span>{f.contradiction.delta}</span>
              </div>
            </React.Fragment>
          )}
          <div className="ws-dims-row">
            {(f.affectedDims || [f.dim]).map((dk) => <DimChip key={dk} dimKey={dk} solid />)}
          </div>
        </div>
      </div>

      {/* Evidence + archetypes + verification (light, 2-col) */}
      <div className="ws-grid" style={{ marginTop: 14 }}>
        <div className="dpanel">
          <div className="dpanel-head">
            <div>
              <div className="dpanel-eyebrow">Supporting evidence · {evidence.length}</div>
              <div className="dpanel-title">Evidence chain</div>
            </div>
          </div>
          <div className="dpanel-body" style={{ paddingTop: 16 }}>
            {evidence.length ? (
              <div className="evidence-chain">
                {evidence.map((ev, i) => <CaseEvidenceCard key={i} ev={ev} last={i === evidence.length - 1} />)}
              </div>
            ) : (
              <div style={{ fontSize: 12.5, color: "var(--d-ink-3)" }}>No direct quotes extracted for this finding.</div>
            )}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="panel" style={{ padding: "16px 17px" }}>
            <div className="section-label" style={{ marginTop: 0 }}>
              <Ic name="spark" size={13} /> Suspected archetypes · {archetypes.length}
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {archetypes.map((a, i) => <CaseArchetypeCard key={i} a={a} />)}
              {archetypes.length === 0 && <div className="muted" style={{ fontSize: 12.5 }}>None identified.</div>}
            </div>
          </div>

          {steps.length > 0 && (
            <div className="panel" style={{ padding: "16px 17px" }}>
              <div className="section-label" style={{ marginTop: 0 }}>
                <Ic name="target" size={13} /> Verification path · {steps.length} steps
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
                {steps.map((s, i) => (
                  <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                    <span style={{ fontFamily: "var(--mono)", fontSize: 10.5, color: "var(--ink-4)", marginTop: 2 }}>
                      {String(s.step ?? i + 1).padStart(2, "0")}
                    </span>
                    <span style={{ fontSize: 12.5, lineHeight: 1.5, color: "var(--ink)" }}>{s.action}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Analyzed-case view ────────────────────────────────────────────────────────
function AnalyzedCase({ caseId, onBack }) {
  const [row, setRow] = useStateAn(null);
  const [loading, setLoading] = useStateAn(true);

  useEffectAn(() => {
    setLoading(true);
    window.LEO_DB.loadCase(caseId).then((r) => {
      setRow(r);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [caseId]);

  if (loading) {
    return <div className="page"><div className="muted" style={{ fontSize: 13 }}>Loading analysis…</div></div>;
  }
  if (!row || !row.analysis) {
    return (
      <div className="page">
        <button className="crumb-btn" onClick={onBack} style={{ marginBottom: 14, display: "flex", alignItems: "center", gap: 6 }}>
          <Ic name="arrowL" size={14} /> Back
        </button>
        <div className="muted" style={{ fontSize: 13 }}>Case not found.</div>
      </div>
    );
  }

  const a = row.analysis;
  const risk = a.overallRisk != null ? a.overallRisk : (row.overall_risk || 0);
  const scores = a.dimensionScores || {};
  const findings = a.findings || [];
  const recs = a.recommendations || [];

  return (
    <div className="page fade-in">
      <div className="page-head">
        <button className="crumb-btn" onClick={onBack} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <Ic name="arrowL" size={14} /> Back to Analyze
        </button>
        <div className="eyebrow">Analyzed case · {row.submitted_by_name || "—"}</div>
        <h1 className="page-title">{a.title || row.title}</h1>
        {a.context && <div className="muted mono" style={{ fontSize: 12.5, marginTop: 6 }}>{a.context}</div>}
        {a.summary && (
          <p style={{ margin: "12px 0 0", color: "var(--ink-2)", fontSize: 13.5, lineHeight: 1.6, maxWidth: 760 }}>{a.summary}</p>
        )}
      </div>

      {/* Overview: gauge + dimension scores */}
      <div className="dpanel" style={{ marginBottom: 18 }}>
        <div className="dpanel-body" style={{ display: "flex", gap: 28, alignItems: "center", flexWrap: "wrap", paddingTop: 20, paddingBottom: 20 }}>
          <div style={{ flexShrink: 0 }}>
            <Gauge score={risk} />
          </div>
          <div style={{ flex: 1, minWidth: 280 }}>
            <div className="section-label on-dark" style={{ marginTop: 0 }}><Ic name="layers" size={13} /> Continuity dimensions</div>
            <DimLegend scores={{
              information: scores.information || 0, intent: scores.intent || 0, ownership: scores.ownership || 0,
              action: scores.action || 0, timing: scores.timing || 0, verification: scores.verification || 0,
            }} dark />
            <div style={{ fontSize: 11, color: "var(--d-ink-3)", marginTop: 12, fontFamily: "var(--mono)" }}>
              Higher score = greater degradation in that dimension.
            </div>
          </div>
        </div>
      </div>

      {/* Findings */}
      <div className="section-label"><Ic name="search" size={13} /> Continuity breaks detected · {findings.length}</div>
      {findings.length === 0 ? (
        <div className="panel" style={{ padding: "24px", textAlign: "center" }}>
          <div className="muted" style={{ fontSize: 13 }}>No meaningful continuity break detected — the loop appears intact.</div>
        </div>
      ) : (
        findings.map((f, i) => <CaseFinding key={f.id || i} f={f} />)
      )}

      {/* Recommendations */}
      {recs.length > 0 && (
        <div className="panel" style={{ padding: "16px 18px", marginTop: 6 }}>
          <div className="section-label" style={{ marginTop: 0 }}><Ic name="target" size={13} /> Recommended actions</div>
          {recs.map((r, i) => (
            <div className="rec" key={r.id || i} style={{ marginTop: i ? 12 : 0 }}>
              <div className="rec-title"><span className="rec-num">{i + 1}</span>{r.title}</div>
              <div className="rec-detail">{r.detail}</div>
              <div className="rec-foot">
                <span className={"tag " + (r.priority === "Immediate" ? "immediate" : "systemic")}>{r.priority}</span>
                <span className="tag">Effort: {r.effort}</span>
                {r.owner && <span className="tag"><Ic name="user" size={11} style={{ verticalAlign: "-1px", marginRight: 3 }} />{r.owner}</span>}
                {(r.addresses || []).length > 0 && <span className="tag">{r.addresses.join(", ")}</span>}
              </div>
            </div>
          ))}
        </div>
      )}

      <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 16, lineHeight: 1.5, fontFamily: "var(--mono)" }}>
        Generated by LEO from submitted material. Treat as decision support, not clinical advice — verify
        each finding against the source record using the verification paths above.
      </div>
    </div>
  );
}

window.AnalyzeCase = AnalyzeCase;
window.AnalyzedCase = AnalyzedCase;
