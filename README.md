# Launch Ledger

**A product release decision lab that makes launch judgment visible.**

**[Try the live decision lab](https://poojaahegde.github.io/launch-ledger/)** · [Read the PRD](PRD.md) · [Inspect the decision rules](app.js)

> **Independent portfolio simulation.** The guided setup feature, all cohorts, metrics, and outcomes are illustrative. This project does not claim a real company launch, live customers, or a completed experiment.

## The PM problem

A team wants to expand a guided setup flow after a 10% pilot. Activation may rise, but the flow might also increase support contacts or slow the page. A PM needs to say **expand, hold, or roll back**, with a reason that engineering, support, and leadership can inspect.

## What the prototype does

- Lets you edit baseline and pilot activation, support contacts, p95 load time, sample size, and exposure.
- Checks whether key events and rollback ownership are ready.
- Applies explicit success and guardrail thresholds to the same evidence.
- Produces a recommendation with reasons, a next step, and a copyable decision receipt.
- Includes three synthetic scenarios to show a promising pilot, mixed evidence, and a guardrail breach.

## Decision rules

| Gate | Illustrative rule |
| --- | --- |
| Activation | Expand only if pilot activation is at least 3.0 percentage points above baseline. |
| Support | Roll back if support contacts rise more than 1.0 point. |
| Performance | Roll back if p95 load time rises more than 200 ms. |
| Readiness | Hold if instrumentation or rollback is unverified, or pilot sample is below 1,000 accounts. |

A guardrail breach overrides activation gain. These thresholds are product-design examples, **not a statistical significance test**. A real decision would also inspect randomization, sample ratio, confidence intervals, segments, accessibility, privacy, and incident readiness.

## Product judgment shown

The key choice is to make release readiness part of the decision, not just a checklist after the metrics look good. The tool also distinguishes a **hold** from a **rollback**: insufficient evidence calls for more learning, while a measured guardrail breach calls for stopping exposure.

## Run locally

Open `index.html` in a browser. The app uses plain HTML, CSS, and JavaScript; it does not need a build step, API key, or backend. Data stays in the browser and is not submitted anywhere.

## Repository map

- `index.html` — accessible interface and scenario context
- `styles.css` — responsive visual design
- `app.js` — input validation, decision logic, and receipt generation
- `PRD.md` — problem, scope, requirements, criteria, and measurement plan

Built by [Pooja Hegde](https://github.com/Poojaahegde) as an independent product management portfolio project.
