/* LEO — Screen 2: Workflow detail (timeline hero) */
const {
  useState: useStateD
} = React;
function StepDims({
  dims
}) {
  return /*#__PURE__*/React.createElement("div", {
    className: "tl-dims"
  }, dims.map(dk => {
    const m = dimMeta(dk);
    return /*#__PURE__*/React.createElement("span", {
      className: "ddot",
      key: dk
    }, /*#__PURE__*/React.createElement("span", {
      className: "sq",
      style: {
        background: dimColor(dk)
      }
    }), m.short);
  }));
}
function TimelineStep({
  s
}) {
  const statusClass = s.status === "break" ? "break" : s.status === "degraded" ? "degraded" : "";
  return /*#__PURE__*/React.createElement("div", {
    className: "tl-step"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tl-node " + s.status
  }, s.status === "break" ? "!" : s.seq), /*#__PURE__*/React.createElement("div", {
    className: "tl-card " + statusClass
  }, /*#__PURE__*/React.createElement("div", {
    className: "tl-top"
  }, /*#__PURE__*/React.createElement("span", {
    className: "tl-phase"
  }, s.phase), /*#__PURE__*/React.createElement("span", {
    className: "tl-time"
  }, s.t)), /*#__PURE__*/React.createElement("div", {
    className: "tl-meta"
  }, /*#__PURE__*/React.createElement("b", null, s.actor), " \xB7 ", s.role, " \xB7 ", /*#__PURE__*/React.createElement("span", {
    style: {
      fontFamily: "var(--mono)",
      fontSize: 10.5
    }
  }, s.system)), /*#__PURE__*/React.createElement("div", {
    className: "tl-summary"
  }, s.summary), s.note && /*#__PURE__*/React.createElement("div", {
    className: "tl-note " + statusClass
  }, s.note), s.intent && !s.note && /*#__PURE__*/React.createElement("div", {
    className: "tl-note"
  }, s.intent), /*#__PURE__*/React.createElement(StepDims, {
    dims: s.dims
  })));
}
function WorkflowDetail({
  id,
  onInvestigate
}) {
  const D = window.LEO_DATA;
  const wf = D.WORKFLOWS.find(w => w.id === id) || D.WORKFLOWS[0];
  const isFocus = wf.id === "WF-2287";
  const findings = isFocus ? D.FINDINGS : [];
  return /*#__PURE__*/React.createElement("div", {
    className: "page fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head spread",
    style: {
      alignItems: "flex-start"
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, wf.id, " \xB7 ", wf.dept), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, wf.title), /*#__PURE__*/React.createElement("p", {
    className: "page-desc"
  }, wf.origin, " \u2192 ", wf.dept, ". ", wf.patient, " \xB7 ", wf.patientMeta, ".")), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      flex: "none"
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "download"
  }), " Export"), isFocus && /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: () => onInvestigate(findings[0].id)
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "search"
  }), " Investigate"))), /*#__PURE__*/React.createElement("div", {
    className: "detail-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "detail-top"
  }, /*#__PURE__*/React.createElement("div", {
    className: "summary-card"
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label",
    style: {
      marginTop: 0
    }
  }, "Context"), /*#__PURE__*/React.createElement("div", {
    className: "patient-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pr-icon"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "user"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pr-k"
  }, "Patient"), /*#__PURE__*/React.createElement("div", {
    className: "pr-v"
  }, wf.patient, " \xB7 ", wf.patientMeta))), /*#__PURE__*/React.createElement("div", {
    className: "patient-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pr-icon"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "route"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pr-k"
  }, "Path"), /*#__PURE__*/React.createElement("div", {
    className: "pr-v"
  }, wf.origin, " \u2192 ", wf.dept))), /*#__PURE__*/React.createElement("div", {
    className: "patient-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pr-icon"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "clock"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pr-k"
  }, "Current stage"), /*#__PURE__*/React.createElement("div", {
    className: "pr-v"
  }, wf.stage))), /*#__PURE__*/React.createElement("div", {
    className: "patient-row"
  }, /*#__PURE__*/React.createElement("span", {
    className: "pr-icon"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "user"
  })), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "pr-k"
  }, "Current owner"), /*#__PURE__*/React.createElement("div", {
    className: "pr-v",
    style: wf.owners[0] === "—" ? {
      color: "var(--r-critical)"
    } : null
  }, wf.owners[0] === "—" ? "Unassigned — no owner" : wf.owners.join(" · "))))), /*#__PURE__*/React.createElement("div", {
    className: "dpanel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dpanel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dpanel-eyebrow"
  }, "Continuity risk score"), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-title"
  }, "Composite & dimensions"))), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gauge-wrap"
  }, /*#__PURE__*/React.createElement(Gauge, {
    score: wf.risk
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      flex: 1
    }
  }, /*#__PURE__*/React.createElement(DimLegend, {
    scores: wf.scores
  })))))), /*#__PURE__*/React.createElement("div", {
    className: "dpanel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "dpanel-head"
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "dpanel-eyebrow"
  }, "Workflow timeline \xB7 ", D.TIMELINE.length, " events"), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-title"
  }, "Continuity across the referral & consult loop")), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      marginLeft: "auto",
      gap: 14
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "ddot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sq",
    style: {
      background: "oklch(0.78 0.12 152)"
    }
  }), " intact"), /*#__PURE__*/React.createElement("span", {
    className: "ddot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sq",
    style: {
      background: "oklch(0.8 0.13 80)"
    }
  }), " degraded"), /*#__PURE__*/React.createElement("span", {
    className: "ddot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sq",
    style: {
      background: "var(--r-critical)"
    }
  }), " break"))), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-body",
    style: {
      paddingTop: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "tl"
  }, /*#__PURE__*/React.createElement("div", {
    className: "tl-spine"
  }), (isFocus ? D.TIMELINE : D.TIMELINE.slice(0, 4)).map(s => /*#__PURE__*/React.createElement(TimelineStep, {
    key: s.seq,
    s: s
  }))))), isFocus && /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    className: "section-label"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "alert",
    size: 14
  }), " Detected continuity breaks \xB7 ", findings.length), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 12
    }
  }, findings.map(f => /*#__PURE__*/React.createElement("div", {
    className: "finding",
    key: f.id,
    onClick: () => onInvestigate(f.id)
  }, /*#__PURE__*/React.createElement("div", {
    className: "finding-rail",
    style: {
      background: dimColor(f.dim)
    }
  }), /*#__PURE__*/React.createElement("div", {
    className: "finding-body"
  }, /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 9,
      flexWrap: "wrap"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sev " + f.severity
  }, f.severity), /*#__PURE__*/React.createElement("span", {
    className: "finding-title"
  }, f.title)), /*#__PURE__*/React.createElement("div", {
    className: "finding-detail"
  }, f.detail), /*#__PURE__*/React.createElement("div", {
    className: "finding-meta"
  }, /*#__PURE__*/React.createElement("span", {
    className: "row",
    style: {
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(DimChip, {
    dimKey: f.dim
  })), /*#__PURE__*/React.createElement("span", {
    className: "mono"
  }, f.where), /*#__PURE__*/React.createElement("span", {
    className: "row",
    style: {
      gap: 5
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "link",
    size: 13
  }), " ", f.evidence.length, " evidence items"))), /*#__PURE__*/React.createElement("div", {
    className: "finding-right"
  }, /*#__PURE__*/React.createElement("span", {
    className: "conf"
  }, "confidence ", /*#__PURE__*/React.createElement("b", null, Math.round(f.confidence * 100), "%")), /*#__PURE__*/React.createElement("span", {
    className: "btn",
    style: {
      padding: "6px 11px",
      fontSize: 12
    }
  }, "Investigate ", /*#__PURE__*/React.createElement(Ic, {
    name: "arrowR",
    size: 13
  })))))))));
}
window.WorkflowDetail = WorkflowDetail;