function _extends() { return _extends = Object.assign ? Object.assign.bind() : function (n) { for (var e = 1; e < arguments.length; e++) { var t = arguments[e]; for (var r in t) ({}).hasOwnProperty.call(t, r) && (n[r] = t[r]); } return n; }, _extends.apply(null, arguments); }
/* LEO — UI primitives. Exports to window. */
const {
  useState,
  useMemo
} = React;

// ---------- icons (stroke, 16px) -------------------------------------
function Icon({
  d,
  fill,
  size = 16,
  ...rest
}) {
  return /*#__PURE__*/React.createElement("svg", _extends({
    viewBox: "0 0 24 24",
    width: size,
    height: size,
    fill: fill ? "currentColor" : "none",
    stroke: fill ? "none" : "currentColor",
    strokeWidth: "1.8",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }, rest), Array.isArray(d) ? d.map((p, i) => /*#__PURE__*/React.createElement("path", {
    key: i,
    d: p
  })) : /*#__PURE__*/React.createElement("path", {
    d: d
  }));
}
const ICONS = {
  grid: "M4 4h7v7H4zM13 4h7v7h-7zM4 13h7v7H4zM13 13h7v7h-7z",
  flow: ["M6 4v6", "M6 14v6", "M18 4v6", "M6 7h9a3 3 0 0 1 3 3v0", "M6 17h12"],
  pulse: "M3 12h4l3 8 4-16 3 8h4",
  shield: "M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z",
  search: ["M11 11m-7 0a7 7 0 1 0 14 0a7 7 0 1 0-14 0", "M21 21l-4.3-4.3"],
  bell: ["M18 8a6 6 0 1 0-12 0c0 7-3 9-3 9h18s-3-2-3-9", "M13.7 21a2 2 0 0 1-3.4 0"],
  user: ["M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0", "M4 21c0-4 4-6 8-6s8 2 8 6"],
  clock: ["M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0", "M12 7v5l3 2"],
  link: ["M9 15l6-6", "M11 6l1-1a4 4 0 0 1 6 6l-1 1", "M13 18l-1 1a4 4 0 0 1-6-6l1-1"],
  alert: ["M12 9v4", "M12 17h.01", "M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z"],
  arrowR: ["M5 12h14", "M13 6l6 6-6 6"],
  arrowL: ["M19 12H5", "M11 6l-6 6 6 6"],
  doc: ["M14 3v5h5", "M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"],
  route: ["M6 3v6", "M6 21v-6", "M6 15a3 3 0 0 0 3-3h6a3 3 0 0 0 3-3", "M18 6m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0", "M6 18m-3 0a3 3 0 1 0 6 0a3 3 0 1 0-6 0"],
  check: "M5 13l4 4L19 7",
  spark: "M12 3l2.2 6.3L21 11l-6.8 1.7L12 19l-2.2-6.3L3 11l6.8-1.7z",
  filter: "M4 5h16l-6 7v6l-4 2v-8z",
  hospital: ["M3 21h18", "M5 21V7l7-4 7 4v14", "M9 9h0M15 9h0M9 13h0M15 13h0", "M10 21v-4h4v4"],
  stethoscope: ["M4 3v6a4 4 0 0 0 8 0V3", "M8 17a5 5 0 0 0 10 0v-1", "M18 12m-2 0a2 2 0 1 0 4 0a2 2 0 1 0-4 0"],
  download: ["M12 3v12", "M7 11l5 4 5-4", "M5 21h14"],
  layers: ["M12 3 3 8l9 5 9-5z", "M3 13l9 5 9-5"],
  target: ["M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0-18 0", "M12 12m-4 0a4 4 0 1 0 8 0a4 4 0 1 0-8 0", "M12 12h.01"],
  zap: "M13 2L4 14h7l-1 8 9-12h-7z"
};
function Ic({
  name,
  ...r
}) {
  return /*#__PURE__*/React.createElement(Icon, _extends({
    d: ICONS[name]
  }, r));
}

// ---------- risk helpers ---------------------------------------------
function riskTier(n) {
  if (n >= 80) return {
    key: "critical",
    label: "Critical",
    color: "var(--r-critical)"
  };
  if (n >= 65) return {
    key: "risk",
    label: "At risk",
    color: "var(--r-risk)"
  };
  if (n >= 45) return {
    key: "watch",
    label: "Watch",
    color: "var(--r-watch)"
  };
  return {
    key: "stable",
    label: "Stable",
    color: "var(--r-stable)"
  };
}
function dimColor(key) {
  return `var(--dim-${key})`;
}
function dimMeta(key) {
  return window.LEO_DATA.DIMS.find(d => d.key === key);
}
function RiskMeter({
  value
}) {
  const t = riskTier(value);
  return /*#__PURE__*/React.createElement("div", {
    className: "risk-meter"
  }, /*#__PURE__*/React.createElement("div", {
    className: "risk-bar"
  }, /*#__PURE__*/React.createElement("div", {
    className: "risk-fill",
    style: {
      width: value + "%",
      background: t.color
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "risk-num",
    style: {
      color: t.color
    }
  }, value));
}
function StatusBadge({
  value
}) {
  const t = riskTier(value);
  return /*#__PURE__*/React.createElement("span", {
    className: "badge " + t.key
  }, /*#__PURE__*/React.createElement("span", {
    className: "dot",
    style: {
      background: t.color
    }
  }), t.label);
}
function DimChip({
  dimKey,
  solid
}) {
  const m = dimMeta(dimKey);
  if (!m) return null;
  return /*#__PURE__*/React.createElement("span", {
    className: "dchip" + (solid ? " solid" : ""),
    style: solid ? {
      background: dimColor(dimKey)
    } : null
  }, !solid && /*#__PURE__*/React.createElement("span", {
    className: "sq",
    style: {
      background: dimColor(dimKey)
    }
  }), m.label);
}

// donut gauge for the workflow score (dark)
function Gauge({
  score
}) {
  const t = riskTier(score);
  const r = 54,
    c = 2 * Math.PI * r,
    off = c * (1 - score / 100);
  return /*#__PURE__*/React.createElement("div", {
    className: "gauge"
  }, /*#__PURE__*/React.createElement("svg", {
    viewBox: "0 0 132 132",
    width: "132",
    height: "132"
  }, /*#__PURE__*/React.createElement("circle", {
    cx: "66",
    cy: "66",
    r: r,
    fill: "none",
    stroke: "var(--d-border-2)",
    strokeWidth: "11"
  }), /*#__PURE__*/React.createElement("circle", {
    cx: "66",
    cy: "66",
    r: r,
    fill: "none",
    stroke: t.color,
    strokeWidth: "11",
    strokeLinecap: "round",
    strokeDasharray: c,
    strokeDashoffset: off,
    transform: "rotate(-90 66 66)",
    style: {
      transition: "stroke-dashoffset .8s cubic-bezier(.3,1,.4,1)"
    }
  })), /*#__PURE__*/React.createElement("div", {
    className: "gauge-num"
  }, /*#__PURE__*/React.createElement("div", {
    className: "gauge-score",
    style: {
      color: t.color
    }
  }, score), /*#__PURE__*/React.createElement("div", {
    className: "gauge-label"
  }, t.label)));
}

// dimension legend used on the dark gauge panel
function DimLegend({
  scores,
  dark
}) {
  const DIMS = window.LEO_DATA.DIMS;
  return /*#__PURE__*/React.createElement("div", {
    className: "dlegend"
  }, DIMS.map(d => {
    const v = scores[d.key];
    return /*#__PURE__*/React.createElement("div", {
      className: "dlegend-row",
      key: d.key
    }, /*#__PURE__*/React.createElement("span", {
      className: "sq",
      style: {
        width: 11,
        height: 11,
        borderRadius: 3,
        background: dimColor(d.key)
      }
    }), /*#__PURE__*/React.createElement("span", {
      className: "dlegend-label"
    }, d.label), /*#__PURE__*/React.createElement("span", {
      className: "dlegend-track"
    }, /*#__PURE__*/React.createElement("span", {
      className: "dlegend-fill",
      style: {
        width: v + "%",
        background: dimColor(d.key)
      }
    })), /*#__PURE__*/React.createElement("span", {
      className: "dlegend-val"
    }, v));
  }));
}

// light dimension bars (portfolio rollup)
function DimBars({
  scores
}) {
  const DIMS = window.LEO_DATA.DIMS;
  return /*#__PURE__*/React.createElement("div", {
    className: "dimbars"
  }, DIMS.map(d => /*#__PURE__*/React.createElement("div", {
    className: "dimbar-row",
    key: d.key
  }, /*#__PURE__*/React.createElement("span", {
    className: "dimbar-label"
  }, /*#__PURE__*/React.createElement("span", {
    className: "sq",
    style: {
      width: 9,
      height: 9,
      borderRadius: 2.5,
      background: dimColor(d.key)
    }
  }), d.label), /*#__PURE__*/React.createElement("span", {
    className: "dimbar-track"
  }, /*#__PURE__*/React.createElement("span", {
    className: "dimbar-fill",
    style: {
      width: scores[d.key] + "%",
      background: dimColor(d.key)
    }
  })), /*#__PURE__*/React.createElement("span", {
    className: "dimbar-val"
  }, scores[d.key]))));
}
Object.assign(window, {
  Ic,
  Icon,
  ICONS,
  riskTier,
  dimColor,
  dimMeta,
  RiskMeter,
  StatusBadge,
  DimChip,
  Gauge,
  DimLegend,
  DimBars
});