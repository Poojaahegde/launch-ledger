# Product requirements: Launch Ledger

**Status:** portfolio prototype  
**Owner:** Pooja Hegde  
**Scenario:** fictional guided setup flow for new accounts  
**Evidence:** entirely synthetic, used to demonstrate product decision making

## 1. Problem and user

A product team can agree that a pilot improved one metric and still disagree about whether to expand it. The missing piece is often a shared decision contract: what improvement is enough, which harms stop rollout, and what operational readiness must exist first.

The primary user is a PM preparing a release review with engineering, support, design, and leadership. Their job is to make an accountable launch recommendation in a few minutes and leave a record that another person can audit.

## 2. Goal

Given pilot evidence for a guided setup flow, the user can produce a reasoned **expand, hold, or roll back** recommendation. The recommendation should expose the thresholds, failed gates, and immediate next step.

## 3. Scope

### In scope

- Edit activation, support-contact, performance, sample, and exposure inputs.
- Mark instrumentation and rollback readiness.
- Evaluate the pilot against published thresholds.
- Copy a plain-text decision receipt.
- Explore synthetic cases that lead to each decision.

### Out of scope

- Ingesting real customer data or connecting to analytics systems.
- Calculating statistical significance or guaranteeing causal impact.
- Automatically changing rollout flags.
- Replacing a human release review.

## 4. Decision contract

**Success metric:** first data-source connection within seven days per eligible new account. The prototype displays this as activation rate. The illustrative expansion bar is +3.0 percentage points versus the current experience.

**Guardrails:** seven-day setup-related support-contact rate may rise by at most +1.0 point; p95 setup-page load time may rise by at most +200 ms. A breach recommends rollback regardless of activation gain.

**Readiness:** events and denominators must be verified; an owner and working rollback switch must be confirmed; the pilot must contain at least 1,000 eligible accounts. Missing readiness recommends hold when guardrails have not breached.

**Decision priority:** invalid data → correct the inputs; guardrail breach → roll back; missing success or readiness → hold; otherwise → staged expansion to 50%.

## 5. Acceptance criteria

1. Given a pilot above the activation bar with both guardrails inside limits and readiness confirmed, when a PM evaluates it, then the UI recommends staged expansion and lists supporting reasons.
2. Given an activation win and a support or latency breach, when the PM evaluates it, then the UI recommends rollback and names each breached guardrail.
3. Given an incomplete sample, unverified events, missing rollback readiness, or insufficient activation lift without a guardrail breach, then the UI recommends hold and identifies the gap.
4. Given a change to any field or readiness checkbox, the decision and receipt update using the current values.
5. Given a copy action in a secure browser context, the receipt contains the recommendation, inputs, reasons, next action, and a synthetic-data label.
6. On a narrow screen, inputs, recommendation, and decision reasons remain readable without horizontal scrolling.

## 6. Measurement plan for a real pilot

Track eligibility, exposure assignment, first-source connection within seven days, setup-related support contacts within seven days, p95 setup-page load time, rollback events, and any incident. Freeze event definitions before analysis. Check sample-ratio mismatch, missing event rates, novelty effects, account-type segments, and confidence intervals. Hold expansion if measurement is unreliable.

## 7. Limits and next iteration

The prototype intentionally uses deterministic threshold logic and synthetic values. A production version would import verified analysis, require an accountable owner and review date on each decision, store versioned receipts, and separate experimental evidence from qualitative release concerns.
