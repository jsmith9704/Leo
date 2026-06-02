/* LEO — Screen 2: Workflow detail (timeline hero) */
const { useState: useStateD } = React;

function StepDims({ dims }) {
  return (
    <div className="tl-dims">
      {dims.map((dk) => {
        const m = dimMeta(dk);
        return (
          <span className="ddot" key={dk}>
            <span className="sq" style={{ background: dimColor(dk) }} />{m.short}
          </span>
        );
      })}
    </div>
  );
}

function TimelineStep({ s }) {
  const statusClass = s.status === "break" ? "break" : s.status === "degraded" ? "degraded" : "";
  return (
    <div className="tl-step">
      <div className={"tl-node " + s.status}>{s.status === "break" ? "!" : s.seq}</div>
      <div className={"tl-card " + statusClass}>
        <div className="tl-top">
          <span className="tl-phase">{s.phase}</span>
          <span className="tl-time">{s.t}</span>
        </div>
        <div className="tl-meta"><b>{s.actor}</b> · {s.role} · <span style={{ fontFamily: "var(--mono)", fontSize: 10.5 }}>{s.system}</span></div>
        <div className="tl-summary">{s.summary}</div>
        {s.note && <div className={"tl-note " + statusClass}>{s.note}</div>}
        {(s.intent && !s.note) && <div className="tl-note">{s.intent}</div>}
        <StepDims dims={s.dims} />
      </div>
    </div>
  );
}

function WorkflowDetail({ id, onInvestigate }) {
  const D = window.LEO_DATA;
  const wf = D.WORKFLOWS.find((w) => w.id === id) || D.WORKFLOWS[0];
  const isFocus = wf.id === "WF-2287";
  const findings = isFocus ? D.FINDINGS : [];

  return (
    <div className="page fade-in">
      <div className="page-head spread" style={{ alignItems: "flex-start" }}>
        <div>
          <div className="eyebrow">{wf.id} · {wf.dept}</div>
          <h1 className="page-title">{wf.title}</h1>
          <p className="page-desc">{wf.origin} → {wf.dept}. {wf.patient} · {wf.patientMeta}.</p>
        </div>
        <div className="row" style={{ flex: "none" }}>
          <button className="btn"><Ic name="download" /> Export</button>
          {isFocus && <button className="btn primary" onClick={() => onInvestigate(findings[0].id)}><Ic name="search" /> Investigate</button>}
        </div>
      </div>

      <div className="detail-grid">
        {/* top: patient/context + dark score panel */}
        <div className="detail-top">
          <div className="summary-card">
            <div className="section-label" style={{ marginTop: 0 }}>Context</div>
            <div className="patient-row">
              <span className="pr-icon"><Ic name="user" /></span>
              <div><div className="pr-k">Patient</div><div className="pr-v">{wf.patient} · {wf.patientMeta}</div></div>
            </div>
            <div className="patient-row">
              <span className="pr-icon"><Ic name="route" /></span>
              <div><div className="pr-k">Path</div><div className="pr-v">{wf.origin} → {wf.dept}</div></div>
            </div>
            <div className="patient-row">
              <span className="pr-icon"><Ic name="clock" /></span>
              <div><div className="pr-k">Current stage</div><div className="pr-v">{wf.stage}</div></div>
            </div>
            <div className="patient-row">
              <span className="pr-icon"><Ic name="user" /></span>
              <div><div className="pr-k">Current owner</div>
                <div className="pr-v" style={wf.owners[0] === "—" ? { color: "var(--r-critical)" } : null}>
                  {wf.owners[0] === "—" ? "Unassigned — no owner" : wf.owners.join(" · ")}
                </div></div>
            </div>
          </div>

          {/* dark gauge panel */}
          <div className="dpanel">
            <div className="dpanel-head">
              <div>
                <div className="dpanel-eyebrow">Continuity risk score</div>
                <div className="dpanel-title">Composite & dimensions</div>
              </div>
            </div>
            <div className="dpanel-body">
              <div className="gauge-wrap">
                <Gauge score={wf.risk} />
                <div style={{ flex: 1 }}><DimLegend scores={wf.scores} /></div>
              </div>
            </div>
          </div>
        </div>

        {/* HERO: timeline (dark) */}
        <div className="dpanel">
          <div className="dpanel-head">
            <div>
              <div className="dpanel-eyebrow">Workflow timeline · {D.TIMELINE.length} events</div>
              <div className="dpanel-title">Continuity across the referral & consult loop</div>
            </div>
            <div className="row" style={{ marginLeft: "auto", gap: 14 }}>
              <span className="ddot"><span className="sq" style={{ background: "oklch(0.78 0.12 152)" }} /> intact</span>
              <span className="ddot"><span className="sq" style={{ background: "oklch(0.8 0.13 80)" }} /> degraded</span>
              <span className="ddot"><span className="sq" style={{ background: "var(--r-critical)" }} /> break</span>
            </div>
          </div>
          <div className="dpanel-body" style={{ paddingTop: 18 }}>
            <div className="tl">
              <div className="tl-spine" />
              {(isFocus ? D.TIMELINE : D.TIMELINE.slice(0, 4)).map((s) => <TimelineStep key={s.seq} s={s} />)}
            </div>
          </div>
        </div>

        {/* findings */}
        {isFocus && (
          <div>
            <div className="section-label"><Ic name="alert" size={14} /> Detected continuity breaks · {findings.length}</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {findings.map((f) => (
                <div className="finding" key={f.id} onClick={() => onInvestigate(f.id)}>
                  <div className="finding-rail" style={{ background: dimColor(f.dim) }} />
                  <div className="finding-body">
                    <div className="row" style={{ gap: 9, flexWrap: "wrap" }}>
                      <span className={"sev " + f.severity}>{f.severity}</span>
                      <span className="finding-title">{f.title}</span>
                    </div>
                    <div className="finding-detail">{f.detail}</div>
                    <div className="finding-meta">
                      <span className="row" style={{ gap: 6 }}><DimChip dimKey={f.dim} /></span>
                      <span className="mono">{f.where}</span>
                      <span className="row" style={{ gap: 5 }}><Ic name="link" size={13} /> {f.evidence.length} evidence items</span>
                    </div>
                  </div>
                  <div className="finding-right">
                    <span className="conf">confidence <b>{Math.round(f.confidence * 100)}%</b></span>
                    <span className="btn" style={{ padding: "6px 11px", fontSize: 12 }}>Investigate <Ic name="arrowR" size={13} /></span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

window.WorkflowDetail = WorkflowDetail;
