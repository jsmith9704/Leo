/* LEO — Screen 1: Workflows list (portfolio) */
const {
  useState: useStateL
} = React;
function WorkflowsList({
  onOpen
}) {
  const {
    WORKFLOWS,
    ROLLUP
  } = window.LEO_DATA;
  const [filter, setFilter] = useStateL("all");
  const shown = WORKFLOWS.filter(w => {
    if (filter === "all") return true;
    if (filter === "critical") return w.risk >= 80;
    if (filter === "risk") return w.risk >= 65 && w.risk < 80;
    return w.risk < 65;
  });
  return /*#__PURE__*/React.createElement("div", {
    className: "page fade-in"
  }, /*#__PURE__*/React.createElement("div", {
    className: "page-head"
  }, /*#__PURE__*/React.createElement("div", {
    className: "eyebrow"
  }, "Continuity portfolio"), /*#__PURE__*/React.createElement("h1", {
    className: "page-title"
  }, "Operational continuity overview"), /*#__PURE__*/React.createElement("p", {
    className: "page-desc"
  }, "LEO monitors live healthcare workflows and scores where information, intent, ownership, action, timing, and verification degrade as work moves between people and systems.")), /*#__PURE__*/React.createElement("div", {
    className: "kpi-grid"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Workflows monitored"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, ROLLUP.monitored.toLocaleString()), /*#__PURE__*/React.createElement("div", {
    className: "kpi-foot"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "layers",
    size: 13
  }), " across 9 service lines")), /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "At risk"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val",
    style: {
      color: "var(--r-risk)"
    }
  }, ROLLUP.atRisk, /*#__PURE__*/React.createElement("span", {
    className: "unit"
  }, "/ ", ROLLUP.monitored.toLocaleString())), /*#__PURE__*/React.createElement("div", {
    className: "kpi-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "delta up"
  }, "\u25B2 12"), " vs. last week")), /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Critical breaks open"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val",
    style: {
      color: "var(--r-critical)"
    }
  }, ROLLUP.critical), /*#__PURE__*/React.createElement("div", {
    className: "kpi-foot"
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "alert",
    size: 13
  }), " require investigation")), /*#__PURE__*/React.createElement("div", {
    className: "kpi"
  }, /*#__PURE__*/React.createElement("div", {
    className: "kpi-label"
  }, "Median cycle time"), /*#__PURE__*/React.createElement("div", {
    className: "kpi-val"
  }, ROLLUP.medianCycle), /*#__PURE__*/React.createElement("div", {
    className: "kpi-foot"
  }, /*#__PURE__*/React.createElement("span", {
    className: "delta down"
  }, "\u25BC 0.8d"), " improving"))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "grid",
      gridTemplateColumns: "1fr 312px",
      gap: 18,
      alignItems: "start"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel"
  }, /*#__PURE__*/React.createElement("div", {
    className: "panel-head"
  }, /*#__PURE__*/React.createElement("span", {
    className: "panel-title"
  }, "Active workflows"), /*#__PURE__*/React.createElement("div", {
    className: "toolbar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "chip-toggle"
  }, [["all", "All"], ["critical", "Critical"], ["risk", "At risk"], ["watch", "Watch / stable"]].map(([k, l]) => /*#__PURE__*/React.createElement("button", {
    key: k,
    className: filter === k ? "on" : "",
    onClick: () => setFilter(k)
  }, l))))), /*#__PURE__*/React.createElement("table", null, /*#__PURE__*/React.createElement("thead", null, /*#__PURE__*/React.createElement("tr", null, /*#__PURE__*/React.createElement("th", {
    style: {
      width: "30%"
    }
  }, "Workflow"), /*#__PURE__*/React.createElement("th", null, "Stage"), /*#__PURE__*/React.createElement("th", null, "Continuity risk"), /*#__PURE__*/React.createElement("th", null, "Dominant break"), /*#__PURE__*/React.createElement("th", null, "Status"))), /*#__PURE__*/React.createElement("tbody", null, shown.map(w => /*#__PURE__*/React.createElement("tr", {
    key: w.id,
    onClick: () => onOpen(w.id)
  }, /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("div", {
    className: "wf-title",
    style: {
      display: "inline"
    }
  }, w.title, w.primary && /*#__PURE__*/React.createElement("span", {
    className: "tag systemic",
    style: {
      fontSize: 9.5,
      marginLeft: 8,
      verticalAlign: "1px"
    }
  }, "FOCUS")), /*#__PURE__*/React.createElement("div", {
    className: "cell-sub"
  }, /*#__PURE__*/React.createElement("span", {
    className: "wf-id"
  }, w.id), " \xB7 ", w.dept, " \xB7 ", w.patient, " ", /*#__PURE__*/React.createElement("span", {
    className: "muted"
  }, "(", w.patientMeta, ")"))), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5
    }
  }, w.stage), /*#__PURE__*/React.createElement("div", {
    className: "cell-sub"
  }, w.lastEvent)), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(RiskMeter, {
    value: w.risk
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(DimChip, {
    dimKey: w.dominant
  })), /*#__PURE__*/React.createElement("td", null, /*#__PURE__*/React.createElement(StatusBadge, {
    value: w.risk
  }))))))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 18
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
  }, "Degradation by dimension"), /*#__PURE__*/React.createElement(DimBars, {
    scores: ROLLUP.dimAvg
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      marginTop: 14,
      lineHeight: 1.5
    }
  }, "Portfolio-wide average degradation. ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--ink-2)"
    }
  }, "Ownership"), " and", " ", /*#__PURE__*/React.createElement("b", {
    style: {
      color: "var(--ink-2)"
    }
  }, "Timing"), " are the leading systemic failure modes this quarter.")), /*#__PURE__*/React.createElement("div", {
    className: "panel",
    style: {
      padding: "16px 18px"
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "section-label",
    style: {
      marginTop: 0
    }
  }, "Investigation queue"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      flexDirection: "column",
      gap: 11
    }
  }, WORKFLOWS.filter(w => w.risk >= 65).slice(0, 4).map(w => /*#__PURE__*/React.createElement("button", {
    key: w.id,
    onClick: () => onOpen(w.id),
    style: {
      display: "flex",
      gap: 10,
      alignItems: "center",
      background: "none",
      border: "none",
      padding: "2px 0",
      textAlign: "left",
      width: "100%"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 36,
      borderRadius: 4,
      background: riskTier(w.risk).color,
      flex: "none"
    }
  }), /*#__PURE__*/React.createElement("span", {
    style: {
      flex: 1,
      minWidth: 0
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      fontWeight: 600,
      display: "block",
      overflow: "hidden",
      textOverflow: "ellipsis",
      whiteSpace: "nowrap"
    }
  }, w.title), /*#__PURE__*/React.createElement("span", {
    className: "cell-sub"
  }, w.breaks, " breaks \xB7 ", w.dept)), /*#__PURE__*/React.createElement("span", {
    className: "risk-num",
    style: {
      color: riskTier(w.risk).color
    }
  }, w.risk))))))));
}
window.WorkflowsList = WorkflowsList;