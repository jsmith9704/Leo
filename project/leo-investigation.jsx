/* LEO — Screen 3: Investigation view (evidence chain + recommendations) */
const { useState: useStateI } = React;

function EvidenceCard({ ev, last }) {
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

function Investigation({ findingId, wfId, onBack, onWorkspace }) {
  const D = window.LEO_DATA;
  const findings = D.FINDINGS;
  const [activeId, setActive] = useStateI(findingId || findings[0].id);
  const finding = findings.find((f) => f.id === activeId) || findings[0];
  const evidence = finding.evidence.map((e) => D.EVIDENCE[e]).filter(Boolean);
  const recs = D.RECOMMENDATIONS.filter((r) => r.addresses.includes(finding.id));
  const m = dimMeta(finding.dim);

  return (
    <div className="page fade-in">
      <div className="page-head">
        <button className="crumb-btn" onClick={onBack} style={{ marginBottom: 10, display: "flex", alignItems: "center", gap: 6 }}>
          <Ic name="arrowL" size={14} /> Back to {wfId}
        </button>
        <div className="eyebrow">Investigation · {finding.id}</div>
        <h1 className="page-title">{finding.title}</h1>
        <div className="row" style={{ gap: 12, marginTop: 10, flexWrap: "wrap" }}>
          <span className={"sev " + finding.severity}>{finding.severity}</span>
          <DimChip dimKey={finding.dim} solid />
          <span className="muted mono" style={{ fontSize: 12, whiteSpace: "nowrap" }}>{finding.where}</span>
          <span className="muted" style={{ fontSize: 12.5 }}>confidence <b style={{ color: "var(--ink)" }}>{Math.round(finding.confidence * 100)}%</b></span>
          {onWorkspace && (
            <button className="btn primary" onClick={() => onWorkspace(activeId)} style={{ marginLeft: "auto" }}>
              <Ic name="layers" /> Open Workspace
            </button>
          )}
        </div>
      </div>

      {/* finding switcher */}
      <div className="row" style={{ gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
        {findings.map((f) => (
          <button key={f.id} onClick={() => setActive(f.id)}
            className="tag" style={{
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

      <div className="inv-grid">
        {/* left: hypothesis + evidence chain (dark) */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="dpanel">
            <div className="dpanel-head">
              <div>
                <div className="dpanel-eyebrow">Continuity hypothesis</div>
                <div className="dpanel-title">How the {m.label.toLowerCase()} thread degraded</div>
              </div>
              <span className="ddot" style={{ marginLeft: "auto" }}><span className="sq" style={{ background: dimColor(finding.dim) }} />{m.short}</span>
            </div>
            <div className="dpanel-body" style={{ paddingTop: 16 }}>
              <p style={{ margin: 0, color: "var(--d-ink-2)", fontSize: 13, lineHeight: 1.6 }}>{finding.detail}</p>
              <div className="section-label on-dark" style={{ marginTop: 22 }}><Ic name="link" size={13} /> Linked evidence chain · {evidence.length}</div>
              <div className="evidence-chain">
                {evidence.map((ev, i) => <EvidenceCard key={ev.id} ev={ev} last={i === evidence.length - 1} />)}
              </div>
            </div>
          </div>
        </div>

        {/* right: recommendations + actions */}
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div className="panel" style={{ padding: "16px 17px" }}>
            <div className="section-label" style={{ marginTop: 0 }}><Ic name="target" size={13} /> Recommended actions</div>
            {recs.map((r, i) => (
              <div className="rec" key={r.id} style={{ marginTop: i ? 12 : 0 }}>
                <div className="rec-title"><span className="rec-num">{i + 1}</span>{r.title}</div>
                <div className="rec-detail">{r.detail}</div>
                <div className="rec-foot">
                  <span className={"tag " + (r.priority === "Immediate" ? "immediate" : "systemic")}>{r.priority}</span>
                  <span className="tag">Effort: {r.effort}</span>
                  <span className="tag"><Ic name="user" size={11} style={{ verticalAlign: "-1px", marginRight: 3 }} />{r.owner}</span>
                </div>
              </div>
            ))}
            {recs.length === 0 && <div className="muted" style={{ fontSize: 12.5 }}>No recommendations linked to this finding.</div>}
          </div>

          <div className="panel" style={{ padding: "16px 17px" }}>
            <div className="section-label" style={{ marginTop: 0 }}>Resolve</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 9 }}>
              <button className="btn primary" style={{ justifyContent: "center" }}><Ic name="check" /> Assign owner & create tasks</button>
              <button className="btn" style={{ justifyContent: "center" }}><Ic name="route" /> Route to {recs[0] ? recs[0].owner : "owner"}</button>
              <button className="btn" style={{ justifyContent: "center" }}><Ic name="doc" /> Add to QI review</button>
            </div>
            <div style={{ fontSize: 11, color: "var(--ink-3)", marginTop: 13, lineHeight: 1.5, fontFamily: "var(--mono)" }}>
              Actions are logged to the workflow audit trail and notify the assigned owner.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.Investigation = Investigation;
