/* LEO — Screen 3: Investigation view (evidence chain + recommendations) */
const {
  useState: useStateI
} = React;
function EvidenceCard({
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
function Investigation({
  findingId,
  wfId,
  onBack,
  onWorkspace
}) {
  const D = window.LEO_DATA;
  const findings = D.FINDINGS;
  const [activeId, setActive] = useStateI(findingId || findings[0].id);
  const finding = findings.find(f => f.id === activeId) || findings[0];
  const evidence = finding.evidence.map(e => D.EVIDENCE[e]).filter(Boolean);
  const recs = D.RECOMMENDATIONS.filter(r => r.addresses.includes(finding.id));
  const m = dimMeta(finding.dim);
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
  }), " Back to ", wfId), /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Investigation \xB7 ", finding.id), /*#__PURE__*/React.createElement("h1", {
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
  }, Math.round(finding.confidence * 100), "%")), onWorkspace && /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    onClick: () => onWorkspace(activeId),
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "layers"
  }), " Open Workspace"))), /*#__PURE__*/React.createElement("div", {
    className: "row",
    style: {
      gap: 8,
      marginBottom: 20,
      flexWrap: "wrap"
    }
  }, findings.map(f => /*#__PURE__*/React.createElement("button", {
    key: f.id,
    onClick: () => setActive(f.id),
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
  }), f.id))), /*#__PURE__*/React.createElement("div", {
    className: "inv-grid"
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
  }, "Continuity hypothesis"), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-title"
  }, "How the ", m.label.toLowerCase(), " thread degraded")), /*#__PURE__*/React.createElement("span", {
    className: "ddot",
    style: {
      marginLeft: "auto"
    }
  }, /*#__PURE__*/React.createElement("span", {
    className: "sq",
    style: {
      background: dimColor(finding.dim)
    }
  }), m.short)), /*#__PURE__*/React.createElement("div", {
    className: "dpanel-body",
    style: {
      paddingTop: 16
    }
  }, /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      color: "var(--d-ink-2)",
      fontSize: 13,
      lineHeight: 1.6
    }
  }, finding.detail), /*#__PURE__*/React.createElement("div", {
    className: "section-label on-dark",
    style: {
      marginTop: 22
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "link",
    size: 13
  }), " Linked evidence chain \xB7 ", evidence.length), /*#__PURE__*/React.createElement("div", {
    className: "evidence-chain"
  }, evidence.map((ev, i) => /*#__PURE__*/React.createElement(EvidenceCard, {
    key: ev.id,
    ev: ev,
    last: i === evidence.length - 1
  })))))), /*#__PURE__*/React.createElement("div", {
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
    name: "target",
    size: 13
  }), " Recommended actions"), recs.map((r, i) => /*#__PURE__*/React.createElement("div", {
    className: "rec",
    key: r.id,
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
  }, "Effort: ", r.effort), /*#__PURE__*/React.createElement("span", {
    className: "tag"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "user",
    size: 11,
    style: {
      verticalAlign: "-1px",
      marginRight: 3
    }
  }), r.owner)))), recs.length === 0 && /*#__PURE__*/React.createElement("div", {
    className: "muted",
    style: {
      fontSize: 12.5
    }
  }, "No recommendations linked to this finding.")), /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      padding: "16px 17px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label",
    style: {
      marginTop: 0
    }
  }, "Resolve"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 9
    }
  }, /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    style: {
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "check"
  }), " Assign owner & create tasks"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    style: {
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "route"
  }), " Route to ", recs[0] ? recs[0].owner : "owner"), /*#__PURE__*/React.createElement("button", {
    className: "btn",
    style: {
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "doc"
  }), " Add to QI review")), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11,
      color: "var(--ink-3)",
      marginTop: 13,
      lineHeight: 1.5,
      fontFamily: "var(--mono)"
    }
  }, "Actions are logged to the workflow audit trail and notify the assigned owner.")))));
}
window.Investigation = Investigation;