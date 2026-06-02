/* LEO — Linking Evidence & Operations
   Demo dataset. De-identified, synthetic. */
(function () {
  // ---- Continuity dimensions ----------------------------------------
  const DIMS = [
    { key: "information", label: "Information", short: "INFO", hue: 240,
      desc: "Data lost, truncated, or altered across handoffs." },
    { key: "intent", label: "Intent", short: "INTENT", hue: 292,
      desc: "Clinical reasoning / the “why” behind an action." },
    { key: "ownership", label: "Ownership", short: "OWN", hue: 158,
      desc: "Who currently holds the task — and whether anyone does." },
    { key: "action", label: "Action", short: "ACT", hue: 42,
      desc: "What was actually done vs. what was intended." },
    { key: "timing", label: "Timing", short: "TIME", hue: 200,
      desc: "Latency and sequencing vs. clinical target." },
    { key: "verification", label: "Verification", short: "VERIFY", hue: 332,
      desc: "Confirmation the loop closed and was acknowledged." },
  ];

  // ---- Workflows list -----------------------------------------------
  const WORKFLOWS = [
    {
      id: "WF-2287",
      title: "Referral & specialist consult loop",
      patient: "M. Okonkwo", patientMeta: "67F · MRN 04‑881‑2207",
      dept: "Cardiology", origin: "Primary Care — Ridgeline Clinic",
      stage: "Consult complete · loop open", risk: 82, trend: +14,
      dominant: "intent",
      scores: { information: 64, intent: 88, ownership: 79, action: 71, timing: 83, verification: 90 },
      owners: ["Referral Coordination", "Cardiology Intake"], lastEvent: "2d ago",
      status: "At risk", breaks: 5, primary: true,
    },
    {
      id: "WF-2231",
      title: "Discharge → PCP follow-up handoff",
      patient: "R. Delacroix", patientMeta: "74M · MRN 03‑552‑9910",
      dept: "Med‑Surg 4E", origin: "Inpatient discharge",
      stage: "Discharged · no follow-up booked", risk: 91, trend: +6,
      dominant: "ownership",
      scores: { information: 58, intent: 61, ownership: 94, action: 80, timing: 88, verification: 86 },
      owners: ["—"], lastEvent: "19h ago",
      status: "Critical", breaks: 6,
    },
    {
      id: "WF-2264",
      title: "Critical lab value → provider notification",
      patient: "S. Whitfield", patientMeta: "59F · MRN 05‑113‑7741",
      dept: "Laboratory", origin: "Chem panel — critical K+",
      stage: "Result released · ack pending", risk: 76, trend: -3,
      dominant: "verification",
      scores: { information: 40, intent: 35, ownership: 68, action: 55, timing: 81, verification: 92 },
      owners: ["On-call Hospitalist"], lastEvent: "41m ago",
      status: "At risk", breaks: 3,
    },
    {
      id: "WF-2208",
      title: "Specialist → PCP results return",
      patient: "T. Abara", patientMeta: "52M · MRN 02‑447‑1180",
      dept: "Endocrinology", origin: "Consult note authored",
      stage: "Note signed · not routed", risk: 71, trend: +2,
      dominant: "information",
      scores: { information: 85, intent: 52, ownership: 70, action: 49, timing: 66, verification: 74 },
      owners: ["Endo Documentation"], lastEvent: "1d ago",
      status: "At risk", breaks: 4,
    },
    {
      id: "WF-2249",
      title: "Prior auth → medication start",
      patient: "L. Nakamura", patientMeta: "48F · MRN 04‑220‑6651",
      dept: "Pharmacy", origin: "e-Prescribe — PA required",
      stage: "Auth approved · fill pending", risk: 54, trend: -8,
      dominant: "timing",
      scores: { information: 38, intent: 33, ownership: 47, action: 44, timing: 79, verification: 51 },
      owners: ["Specialty Pharmacy"], lastEvent: "5h ago",
      status: "Watch", breaks: 2,
    },
    {
      id: "WF-2255",
      title: "ED → inpatient admission handoff",
      patient: "D. Castellano", patientMeta: "81M · MRN 01‑903‑4412",
      dept: "Emergency", origin: "Admit decision",
      stage: "Boarding · handoff in progress", risk: 48, trend: +1,
      dominant: "action",
      scores: { information: 44, intent: 40, ownership: 52, action: 70, timing: 58, verification: 41 },
      owners: ["ED Charge RN", "Admitting"], lastEvent: "3h ago",
      status: "Watch", breaks: 2,
    },
    {
      id: "WF-2271",
      title: "Imaging order → result acknowledgment",
      patient: "J. Pereira", patientMeta: "39F · MRN 05‑667‑2093",
      dept: "Radiology", origin: "CT abdomen ordered",
      stage: "Read finalized · acknowledged", risk: 28, trend: -11,
      dominant: "verification",
      scores: { information: 22, intent: 18, ownership: 31, action: 26, timing: 34, verification: 39 },
      owners: ["Ordering Provider"], lastEvent: "6h ago",
      status: "Stable", breaks: 0,
    },
  ];

  // ---- The deep workflow: WF-2287 timeline --------------------------
  // status: ok | degraded | break
  const TIMELINE = [
    {
      seq: 1, t: "May 04 · 09:12", phase: "Decision to refer",
      actor: "Dr. A. Alvarez", role: "PCP · Ridgeline Clinic",
      system: "EHR · Encounter", status: "ok",
      summary: "New-onset palpitations; office ECG shows atrial fibrillation. Plan: urgent cardiology eval and decision on anticoagulation.",
      intent: "Cardiology eval + start/defer anticoagulation given CHA₂DS₂-VASc 4.",
      dims: ["intent", "information"],
    },
    {
      seq: 2, t: "May 04 · 09:26", phase: "Referral order placed",
      actor: "Dr. A. Alvarez", role: "PCP", system: "EHR · Order entry",
      status: "degraded",
      summary: "Referral order created, priority “Urgent — within 7 days.” Free-text reason field truncated on save.",
      note: "Reason captured as “AFib eval.” The anticoagulation question did not carry into the structured order.",
      dims: ["information", "intent"],
    },
    {
      seq: 3, t: "May 05 · 14:03", phase: "Routed to scheduling",
      actor: "Referral Coordination", role: "Queue transfer", system: "Referral mgmt",
      status: "ok",
      summary: "Order leaves the clinician’s queue. Task ownership transfers to Referral Coordination.",
      intent: "Ownership handoff #1 — clinician → coordinator.",
      dims: ["ownership"],
    },
    {
      seq: 4, t: "May 06 – May 12", phase: "Insurance authorization",
      actor: "Authorization Team", role: "Payer auth", system: "Auth portal",
      status: "degraded",
      summary: "Prior authorization opened and approved after 6 days. No alert raised that the urgent window had elapsed.",
      note: "Latency: 6 days consumed against a 7-day urgent target before scheduling even begins.",
      dims: ["timing"],
    },
    {
      seq: 5, t: "May 13 · 10:41", phase: "Patient outreach",
      actor: "Cardiology Intake", role: "Scheduler", system: "Phone · Telephony",
      status: "degraded",
      summary: "Two outreach attempts; patient reached on 2nd call. Urgency not conveyed — appointment offered from routine pool.",
      note: "The “urgent” priority was not visible to the scheduler at booking.",
      dims: ["action", "information"],
    },
    {
      seq: 6, t: "May 13 · 10:58", phase: "Appointment scheduled",
      actor: "Cardiology Intake", role: "Scheduler", system: "Scheduling",
      status: "break",
      summary: "Booked as ROUTINE for May 28 — 24 days after referral.",
      note: "Contradiction: order priority “Urgent / ≤7d” vs. booked “Routine / 24d.” No reconciliation event.",
      dims: ["action", "intent", "timing"],
    },
    {
      seq: 7, t: "May 28 · 11:20", phase: "Specialist consult",
      actor: "Dr. M. Boone", role: "Cardiology", system: "EHR · Encounter",
      status: "degraded",
      summary: "Patient evaluated. AFib confirmed; rate control discussed. Anticoagulation not addressed in plan.",
      note: "Consult opened to reason “AFib eval.” Original anticoagulation question never surfaced to the specialist.",
      dims: ["intent", "information"],
    },
    {
      seq: 8, t: "May 28 · 16:44", phase: "Consult note authored",
      actor: "Dr. M. Boone", role: "Cardiology", system: "EHR · Documentation",
      status: "ok",
      summary: "Consult note signed. Recommends rate control + follow-up in 4 weeks. Note filed to chart.",
      intent: "Documentation complete from the specialist’s frame of reference.",
      dims: ["action"],
    },
    {
      seq: 9, t: "May 28 · 16:44", phase: "Loop closure",
      actor: "—", role: "No owner assigned", system: "Referral mgmt",
      status: "break",
      summary: "Consult complete, but no task routes the result back to the referring PCP, and no owner is responsible for closing the referral.",
      note: "Ownership gap + unverified closure: PCP has not acknowledged; anticoagulation decision is unresolved and unowned.",
      dims: ["ownership", "verification", "intent"],
    },
  ];

  // ---- Detected breaks (findings) for WF-2287 -----------------------
  const FINDINGS = [
    {
      id: "F-01", dim: "intent", severity: "critical",
      title: "Anticoagulation question lost between referral and consult",
      where: "Steps 1 → 2 → 7",
      detail: "The referring intent (decide on anticoagulation) was captured in the encounter note but dropped from the structured referral order and never reached the specialist.",
      confidence: 0.93,
      evidence: ["EV-101", "EV-102", "EV-107"],
    },
    {
      id: "F-02", dim: "action", severity: "critical",
      title: "Urgency contradiction — ordered Urgent, booked Routine",
      where: "Step 2 vs Step 6",
      detail: "Order priority “Urgent / ≤7 days” conflicts with the scheduled “Routine / 24 days.” No reconciliation or override justification exists.",
      confidence: 0.97,
      evidence: ["EV-102", "EV-106"],
    },
    {
      id: "F-03", dim: "ownership", severity: "high",
      title: "No owner for loop closure after consult",
      where: "Step 9",
      detail: "After the consult note was signed, no task or person became responsible for returning results to the PCP or closing the referral.",
      confidence: 0.89,
      evidence: ["EV-109"],
    },
    {
      id: "F-04", dim: "timing", severity: "high",
      title: "Urgent window elapsed during authorization",
      where: "Step 4",
      detail: "6 of the 7 urgent-target days were consumed by prior authorization with no escalation alert.",
      confidence: 0.84,
      evidence: ["EV-104"],
    },
    {
      id: "F-05", dim: "verification", severity: "medium",
      title: "Closure never acknowledged by referring provider",
      where: "Step 9",
      detail: "No read receipt, acknowledgment, or PCP review event is recorded for the consult outcome.",
      confidence: 0.78,
      evidence: ["EV-109"],
    },
  ];

  // ---- Evidence corpus (for investigation view) ---------------------
  const EVIDENCE = {
    "EV-101": {
      id: "EV-101", type: "Encounter note", source: "EHR · Ridgeline Clinic",
      actor: "Dr. A. Alvarez", t: "May 04 · 09:12", dim: "intent",
      quote: "…ECG c/w new atrial fibrillation. Will refer to cardiology urgently and decide on anticoagulation (CHA₂DS₂-VASc 4) — defer initiation pending specialist input.",
      highlight: "decide on anticoagulation",
    },
    "EV-102": {
      id: "EV-102", type: "Referral order", source: "EHR · Order entry",
      actor: "Dr. A. Alvarez", t: "May 04 · 09:26", dim: "information",
      quote: "REFERRAL · Cardiology · Priority: URGENT (≤7d) · Reason: “AFib eval”",
      highlight: "AFib eval",
    },
    "EV-104": {
      id: "EV-104", type: "Authorization log", source: "Payer auth portal",
      actor: "Authorization Team", t: "May 06 – May 12", dim: "timing",
      quote: "PA opened 05/06 09:00 · Approved 05/12 15:22 · Elapsed 6d 06h · No urgent-window flag set.",
      highlight: "Elapsed 6d 06h",
    },
    "EV-106": {
      id: "EV-106", type: "Scheduling record", source: "Scheduling system",
      actor: "Cardiology Intake", t: "May 13 · 10:58", dim: "action",
      quote: "APPT booked · Class: ROUTINE · Date: 05/28 · Lead time 24d · Source pool: routine.",
      highlight: "Class: ROUTINE",
    },
    "EV-107": {
      id: "EV-107", type: "Consult note", source: "EHR · Documentation",
      actor: "Dr. M. Boone", t: "May 28 · 16:44", dim: "intent",
      quote: "Consult for AFib evaluation. Recommend rate control, f/u 4 weeks. (No reference to anticoagulation decision in plan.)",
      highlight: "No reference to anticoagulation",
    },
    "EV-109": {
      id: "EV-109", type: "Workflow audit", source: "Referral mgmt",
      actor: "System", t: "May 28 · 16:44", dim: "ownership",
      quote: "STATE: consult_complete · next_owner: NULL · close_task: not_created · pcp_ack: none.",
      highlight: "next_owner: NULL",
    },
  };

  // ---- Recommendations for the investigation ------------------------
  const RECOMMENDATIONS = [
    {
      id: "R-01", priority: "Immediate", effort: "Low",
      title: "Re-open the anticoagulation decision with the PCP",
      detail: "Create a task to Dr. Alvarez to resolve anticoagulation; attach the original encounter intent (EV-101) and the consult note (EV-107).",
      addresses: ["F-01", "F-05"], owner: "Referral Coordination",
    },
    {
      id: "R-02", priority: "Immediate", effort: "Low",
      title: "Assign an owner to close WF-2287",
      detail: "Route loop-closure to Cardiology Intake with PCP acknowledgment required before close.",
      addresses: ["F-03", "F-05"], owner: "Cardiology Intake",
    },
    {
      id: "R-03", priority: "Systemic", effort: "Medium",
      title: "Make referral priority binding at scheduling",
      detail: "Block routine-pool booking when order priority is Urgent unless an override reason is recorded.",
      addresses: ["F-02"], owner: "Scheduling Ops",
    },
    {
      id: "R-04", priority: "Systemic", effort: "Medium",
      title: "Structured “clinical question” field on referrals",
      detail: "Replace free-text reason with a required, non-truncating clinical-question field that carries to the consult header.",
      addresses: ["F-01"], owner: "EHR Governance",
    },
    {
      id: "R-05", priority: "Systemic", effort: "Low",
      title: "Escalate when an urgent window is at risk during auth",
      detail: "Raise an alert at 50% of the urgent target if authorization is still open.",
      addresses: ["F-04"], owner: "Authorization Team",
    },
  ];

  // ---- Portfolio rollup metrics -------------------------------------
  const ROLLUP = {
    monitored: 1284, atRisk: 196, critical: 38, closedClean: 1050,
    avgRisk: 41, medianCycle: "11.4d",
    dimAvg: { information: 39, intent: 44, ownership: 58, action: 47, timing: 52, verification: 49 },
  };

  window.LEO_DATA = { DIMS, WORKFLOWS, TIMELINE, FINDINGS, EVIDENCE, RECOMMENDATIONS, ROLLUP };
})();
