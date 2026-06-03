/* LEO — Login + Request access screen */
const {
  useState: useStateLogin
} = React;
const AUTH_CARD = {
  width: 360,
  background: "var(--surface)",
  border: "1px solid var(--border)",
  borderRadius: 14,
  padding: "36px 32px",
  boxShadow: "0 4px 24px oklch(0 0 0 / 0.07)"
};
const AUTH_LABEL = {
  display: "block",
  fontSize: 12,
  fontWeight: 600,
  color: "var(--ink-2)",
  marginBottom: 6
};
const AUTH_ERR = {
  marginBottom: 16,
  padding: "9px 12px",
  background: "oklch(0.60 0.20 27 / 0.08)",
  border: "1px solid oklch(0.60 0.20 27 / 0.28)",
  borderRadius: 7,
  fontSize: 12.5,
  color: "oklch(0.50 0.20 27)",
  lineHeight: 1.45
};
function AuthBrand() {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: "flex",
      alignItems: "center",
      gap: 12,
      marginBottom: 32
    }
  }, /*#__PURE__*/React.createElement("div", {
    className: "brand-mark"
  }, "L"), /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--mono)",
      fontWeight: 700,
      fontSize: 15,
      letterSpacing: "0.04em",
      color: "var(--ink)"
    }
  }, "LEO"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontFamily: "var(--mono)",
      fontSize: 10,
      letterSpacing: "0.12em",
      color: "var(--ink-3)",
      textTransform: "uppercase"
    }
  }, "EVIDENCE \xD7 OPS")));
}
function SignInForm({
  onRequestAccess
}) {
  const [email, setEmail] = useStateLogin("");
  const [password, setPassword] = useStateLogin("");
  const [error, setError] = useStateLogin(null);
  const [loading, setLoading] = useStateLogin(false);
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await window.LEO_DB.signIn(email, password);
      // Auth state change fires automatically in App via onAuthChange subscription
    } catch (err) {
      setError(err.message || "Sign in failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 24
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      color: "var(--ink)",
      marginBottom: 4
    }
  }, "Sign in"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--ink-3)"
    }
  }, "Access your LEO analyst workspace")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 14
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: AUTH_LABEL
  }, "Email"), /*#__PURE__*/React.createElement("input", {
    className: "leo-input",
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "analyst@hospital.org",
    required: true,
    autoComplete: "email"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 20
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: AUTH_LABEL
  }, "Password"), /*#__PURE__*/React.createElement("input", {
    className: "leo-input",
    type: "password",
    value: password,
    onChange: e => setPassword(e.target.value),
    placeholder: "\u2022\u2022\u2022\u2022\u2022\u2022\u2022\u2022",
    required: true,
    autoComplete: "current-password"
  })), error && /*#__PURE__*/React.createElement("div", {
    style: AUTH_ERR
  }, error), /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    type: "submit",
    disabled: loading,
    style: {
      width: "100%",
      justifyContent: "center",
      opacity: loading ? 0.7 : 1
    }
  }, loading ? "Signing in…" : "Sign in")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 22,
      paddingTop: 18,
      borderTop: "1px solid var(--border)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      fontSize: 12.5,
      color: "var(--ink-3)"
    }
  }, "Need an account? "), /*#__PURE__*/React.createElement("button", {
    onClick: onRequestAccess,
    style: {
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--accent)",
      fontFamily: "var(--sans)"
    }
  }, "Request access")));
}
function RequestAccessForm({
  onBack
}) {
  const [name, setName] = useStateLogin("");
  const [email, setEmail] = useStateLogin("");
  const [org, setOrg] = useStateLogin("");
  const [reason, setReason] = useStateLogin("");
  const [error, setError] = useStateLogin(null);
  const [loading, setLoading] = useStateLogin(false);
  const [done, setDone] = useStateLogin(false);
  const handleSubmit = async e => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const ok = await window.LEO_DB.requestAccess({
        name,
        email,
        organization: org,
        reason
      });
      if (!ok) throw new Error("Could not submit your request. Please try again.");
      setDone(true);
    } catch (err) {
      setError(err.message || "Could not submit your request. Please try again.");
    } finally {
      setLoading(false);
    }
  };
  if (done) {
    return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
      style: {
        width: 44,
        height: 44,
        borderRadius: 11,
        display: "grid",
        placeItems: "center",
        background: "oklch(0.66 0.13 152 / 0.12)",
        border: "1px solid oklch(0.66 0.13 152 / 0.30)",
        marginBottom: 18
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "check",
      size: 20
    })), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 17,
        fontWeight: 700,
        color: "var(--ink)",
        marginBottom: 6
      }
    }, "Request submitted"), /*#__PURE__*/React.createElement("div", {
      style: {
        fontSize: 13,
        color: "var(--ink-3)",
        lineHeight: 1.55,
        marginBottom: 22
      }
    }, "Thanks, ", name || "there", ". Your access request has been logged for review. A LEO administrator will follow up at ", /*#__PURE__*/React.createElement("b", {
      style: {
        color: "var(--ink-2)"
      }
    }, email), " once your account is provisioned."), /*#__PURE__*/React.createElement("button", {
      className: "btn",
      onClick: onBack,
      style: {
        width: "100%",
        justifyContent: "center"
      }
    }, /*#__PURE__*/React.createElement(Ic, {
      name: "arrowL",
      size: 14
    }), " Back to sign in"));
  }
  return /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 22
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 17,
      fontWeight: 700,
      color: "var(--ink)",
      marginBottom: 4
    }
  }, "Request access"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 13,
      color: "var(--ink-3)",
      lineHeight: 1.5
    }
  }, "LEO access is granted by an administrator. Tell us who you are and we'll be in touch.")), /*#__PURE__*/React.createElement("form", {
    onSubmit: handleSubmit
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 13
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: AUTH_LABEL
  }, "Full name"), /*#__PURE__*/React.createElement("input", {
    className: "leo-input",
    type: "text",
    value: name,
    onChange: e => setName(e.target.value),
    placeholder: "Jane Smith",
    required: true,
    autoComplete: "name"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 13
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: AUTH_LABEL
  }, "Work email"), /*#__PURE__*/React.createElement("input", {
    className: "leo-input",
    type: "email",
    value: email,
    onChange: e => setEmail(e.target.value),
    placeholder: "jane@hospital.org",
    required: true,
    autoComplete: "email"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 13
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: AUTH_LABEL
  }, "Organization"), /*#__PURE__*/React.createElement("input", {
    className: "leo-input",
    type: "text",
    value: org,
    onChange: e => setOrg(e.target.value),
    placeholder: "Memorial Health System",
    required: true,
    autoComplete: "organization"
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      marginBottom: 18
    }
  }, /*#__PURE__*/React.createElement("label", {
    style: AUTH_LABEL
  }, "Reason for access"), /*#__PURE__*/React.createElement("textarea", {
    className: "ws-textarea",
    value: reason,
    onChange: e => setReason(e.target.value),
    placeholder: "Your role and how you'll use LEO\u2026",
    required: true,
    style: {
      minHeight: 76,
      fontFamily: "var(--sans)",
      fontSize: 13
    }
  })), error && /*#__PURE__*/React.createElement("div", {
    style: AUTH_ERR
  }, error), /*#__PURE__*/React.createElement("button", {
    className: "btn primary",
    type: "submit",
    disabled: loading,
    style: {
      width: "100%",
      justifyContent: "center",
      opacity: loading ? 0.7 : 1
    }
  }, loading ? "Submitting…" : "Submit request")), /*#__PURE__*/React.createElement("div", {
    style: {
      marginTop: 20,
      paddingTop: 16,
      borderTop: "1px solid var(--border)",
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onBack,
    style: {
      background: "none",
      border: "none",
      padding: 0,
      cursor: "pointer",
      fontSize: 12.5,
      fontWeight: 600,
      color: "var(--accent)",
      fontFamily: "var(--sans)"
    }
  }, "\u2190 Back to sign in")));
}
function LoginScreen({
  onEnterDemo
}) {
  const [mode, setMode] = useStateLogin("signin"); // "signin" | "request"

  return /*#__PURE__*/React.createElement("div", {
    style: {
      minHeight: "100vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      gap: 16,
      background: "var(--bg)"
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: AUTH_CARD
  }, /*#__PURE__*/React.createElement(AuthBrand, null), mode === "signin" ? /*#__PURE__*/React.createElement(SignInForm, {
    onRequestAccess: () => setMode("request")
  }) : /*#__PURE__*/React.createElement(RequestAccessForm, {
    onBack: () => setMode("signin")
  })), onEnterDemo && /*#__PURE__*/React.createElement("div", {
    style: {
      width: 360,
      textAlign: "center"
    }
  }, /*#__PURE__*/React.createElement("button", {
    onClick: onEnterDemo,
    className: "btn",
    style: {
      width: "100%",
      justifyContent: "center"
    }
  }, /*#__PURE__*/React.createElement(Ic, {
    name: "grid",
    size: 14
  }), " Explore the public demo"), /*#__PURE__*/React.createElement("div", {
    style: {
      fontSize: 11.5,
      color: "var(--ink-3)",
      marginTop: 9,
      fontFamily: "var(--mono)",
      lineHeight: 1.5
    }
  }, "No account needed \xB7 synthetic sample data \xB7 read-only")));
}
window.LoginScreen = LoginScreen;
