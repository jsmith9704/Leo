/* LEO — Screen 1: Workflows list (portfolio) */
const { useState: useStateL } = React;

function WorkflowsList({ onOpen }) {
  const { WORKFLOWS, ROLLUP } = window.LEO_DATA;
  const [filter, setFilter] = useStateL("all");

  const shown = WORKFLOWS.filter((w) => {
    if (filter === "all") return true;
    if (filter === "critical") return w.risk >= 80;
    if (filter === "risk") return w.risk >= 65 && w.risk < 80;
    return w.risk < 65;
  });

  return (
    <div className="page fade-in">
      <div className="page-head">
        <div className="eyebrow">Continuity portfolio</div>
        <h1 className="page-title">Operational continuity overview</h1>
        <p className="page-desc">
          LEO monitors live healthcare workflows and scores where information, intent, ownership, action,
          timing, and verification degrade as work moves between people and systems.
        </p>
      </div>

      {/* KPIs */}
      <div className="kpi-grid">
        <div className="kpi">
          <div className="kpi-label">Workflows monitored</div>
          <div className="kpi-val">{ROLLUP.monitored.toLocaleString()}</div>
          <div className="kpi-foot"><Ic name="layers" size={13} /> across 9 service lines</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">At risk</div>
          <div className="kpi-val" style={{ color: "var(--r-risk)" }}>{ROLLUP.atRisk}<span className="unit">/ {ROLLUP.monitored.toLocaleString()}</span></div>
          <div className="kpi-foot"><span className="delta up">▲ 12</span> vs. last week</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Critical breaks open</div>
          <div className="kpi-val" style={{ color: "var(--r-critical)" }}>{ROLLUP.critical}</div>
          <div className="kpi-foot"><Ic name="alert" size={13} /> require investigation</div>
        </div>
        <div className="kpi">
          <div className="kpi-label">Median cycle time</div>
          <div className="kpi-val">{ROLLUP.medianCycle}</div>
          <div className="kpi-foot"><span className="delta down">▼ 0.8d</span> improving</div>
        </div>
      </div>

      {/* main split: table + rollup */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 312px", gap: 18, alignItems: "start" }}>
        <div className="panel">
          <div className="panel-head">
            <span className="panel-title">Active workflows</span>
            <div className="toolbar">
              <div className="chip-toggle">
                {[["all", "All"], ["critical", "Critical"], ["risk", "At risk"], ["watch", "Watch / stable"]].map(([k, l]) => (
                  <button key={k} className={filter === k ? "on" : ""} onClick={() => setFilter(k)}>{l}</button>
                ))}
              </div>
            </div>
          </div>
          <table>
            <thead>
              <tr>
                <th style={{ width: "30%" }}>Workflow</th>
                <th>Stage</th>
                <th>Continuity risk</th>
                <th>Dominant break</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {shown.map((w) => (
                <tr key={w.id} onClick={() => onOpen(w.id)}>
                  <td>
                    <div className="wf-title" style={{ display: "inline" }}>
                      {w.title}
                      {w.primary && <span className="tag systemic" style={{ fontSize: 9.5, marginLeft: 8, verticalAlign: "1px" }}>FOCUS</span>}
                    </div>
                    <div className="cell-sub">
                      <span className="wf-id">{w.id}</span> · {w.dept} · {w.patient} <span className="muted">({w.patientMeta})</span>
                    </div>
                  </td>
                  <td><span style={{ fontSize: 12.5 }}>{w.stage}</span><div className="cell-sub">{w.lastEvent}</div></td>
                  <td><RiskMeter value={w.risk} /></td>
                  <td><DimChip dimKey={w.dominant} /></td>
                  <td><StatusBadge value={w.risk} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* rollup column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div className="panel" style={{ padding: "16px 18px" }}>
            <div className="section-label" style={{ marginTop: 0 }}>Degradation by dimension</div>
            <DimBars scores={ROLLUP.dimAvg} />
            <div style={{ fontSize: 11.5, color: "var(--ink-3)", marginTop: 14, lineHeight: 1.5 }}>
              Portfolio-wide average degradation. <b style={{ color: "var(--ink-2)" }}>Ownership</b> and{" "}
              <b style={{ color: "var(--ink-2)" }}>Timing</b> are the leading systemic failure modes this quarter.
            </div>
          </div>
          <div className="panel" style={{ padding: "16px 18px" }}>
            <div className="section-label" style={{ marginTop: 0 }}>Investigation queue</div>
            <div style={{ display: "flex", flexDirection: "column", gap: 11 }}>
              {WORKFLOWS.filter((w) => w.risk >= 65).slice(0, 4).map((w) => (
                <button key={w.id} onClick={() => onOpen(w.id)}
                  style={{ display: "flex", gap: 10, alignItems: "center", background: "none", border: "none", padding: "2px 0", textAlign: "left", width: "100%" }}>
                  <span style={{ width: 6, height: 36, borderRadius: 4, background: riskTier(w.risk).color, flex: "none" }} />
                  <span style={{ flex: 1, minWidth: 0 }}>
                    <span style={{ fontSize: 12.5, fontWeight: 600, display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{w.title}</span>
                    <span className="cell-sub">{w.breaks} breaks · {w.dept}</span>
                  </span>
                  <span className="risk-num" style={{ color: riskTier(w.risk).color }}>{w.risk}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

window.WorkflowsList = WorkflowsList;
