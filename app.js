const scenarios = {
  promising: {baseline: 42, pilot: 46.2, supportBaseline: 8, supportPilot: 8.4, latencyBaseline: 820, latencyPilot: 900, sample: 2400, exposure: 10, eventsReady: true, rollbackReady: true},
  mixed: {baseline: 42, pilot: 44.1, supportBaseline: 8, supportPilot: 8.6, latencyBaseline: 820, latencyPilot: 940, sample: 1900, exposure: 10, eventsReady: true, rollbackReady: true},
  harm: {baseline: 42, pilot: 46, supportBaseline: 8, supportPilot: 10.2, latencyBaseline: 820, latencyPilot: 1100, sample: 2500, exposure: 10, eventsReady: true, rollbackReady: true}
};

const $ = id => document.getElementById(id);
const numericIds = ['baseline', 'pilot', 'supportBaseline', 'supportPilot', 'latencyBaseline', 'latencyPilot', 'sample', 'exposure'];
const thresholds = {activationLift: 3, supportRise: 1, latencyRise: 200, minSample: 1000};

function evaluate(values) {
  const numbers = numericIds.map(id => Number(values[id]));
  if (numbers.some(n => !Number.isFinite(n)) || numbers.slice(0, 4).some(n => n < 0 || n > 100) || numbers[4] <= 0 || numbers[5] <= 0 || numbers[6] < 0 || numbers[7] <= 0 || numbers[7] > 100) return {status:'invalid', reasons:['Enter valid, nonnegative rates and a valid pilot size.']};
  const lift = values.pilot - values.baseline;
  const supportRise = values.supportPilot - values.supportBaseline;
  const latencyRise = values.latencyPilot - values.latencyBaseline;
  const reasons = [];
  let status, next;
  if (supportRise > thresholds.supportRise || latencyRise > thresholds.latencyRise) {
    status = 'rollback';
    if (supportRise > thresholds.supportRise) reasons.push(`Support contacts rose ${supportRise.toFixed(1)} points, above the +1.0 point guardrail.`);
    if (latencyRise > thresholds.latencyRise) reasons.push(`p95 load time rose ${Math.round(latencyRise)} ms, above the +200 ms guardrail.`);
    if (!values.rollbackReady) reasons.push('Rollback ownership or switch is not confirmed; escalate immediately.');
    next = 'Stop expansion, turn off the pilot with the release owner, and investigate the failing guardrail.';
  } else if (!values.eventsReady || !values.rollbackReady || values.sample < thresholds.minSample || lift < thresholds.activationLift) {
    status = 'hold';
    if (!values.eventsReady) reasons.push('Activation and support events are not verified.');
    if (!values.rollbackReady) reasons.push('Rollback owner and switch are not confirmed.');
    if (values.sample < thresholds.minSample) reasons.push(`Only ${values.sample.toLocaleString()} pilot accounts; the illustrative minimum is 1,000.`);
    if (lift < thresholds.activationLift) reasons.push(`Activation lift is ${lift.toFixed(1)} points, below the +3.0 point expansion bar.`);
    next = 'Keep exposure at its current level; resolve the gaps and review a fresh cohort before deciding again.';
  } else {
    status = 'expand';
    reasons.push(`Activation improved ${lift.toFixed(1)} points and cleared the +3.0 point bar.`);
    reasons.push('Support and latency guardrails are within limits; tracking and rollback are ready.');
    next = 'Expand to 50% in a staged release; monitor the same guardrails daily and pause on any breach.';
  }
  return {status, lift, supportRise, latencyRise, reasons, next};
}

function valuesFromForm() {
  const values = Object.fromEntries(numericIds.map(id => [id, Number($(id).value)]));
  values.eventsReady = $('eventsReady').checked;
  values.rollbackReady = $('rollbackReady').checked;
  return values;
}

function render(result, values) {
  const labels = {expand:'Expand to 50%', hold:'Hold at current exposure', rollback:'Roll back pilot', invalid:'Check the inputs'};
  $('verdict').textContent = labels[result.status];
  $('status-pill').textContent = result.status === 'invalid' ? 'Input needed' : result.status.toUpperCase();
  $('status-pill').className = `pill ${result.status}`;
  $('summary').textContent = result.status === 'expand' ? 'The illustrative pilot clears the success bar without crossing the operating guardrails.' : result.status === 'hold' ? 'The case for expansion is incomplete. Keep the pilot contained while the missing evidence is resolved.' : result.status === 'rollback' ? 'A guardrail is breached. A success metric cannot cancel out customer or operational harm.' : 'Review the fields below.';
  $('activation-result').textContent = Number.isFinite(result.lift) ? `${result.lift >= 0 ? '+' : ''}${result.lift.toFixed(1)} pp` : '—';
  $('support-result').textContent = Number.isFinite(result.supportRise) ? `${result.supportRise >= 0 ? '+' : ''}${result.supportRise.toFixed(1)} pp` : '—';
  $('latency-result').textContent = Number.isFinite(result.latencyRise) ? `${result.latencyRise >= 0 ? '+' : ''}${Math.round(result.latencyRise)} ms` : '—';
  $('reasons').replaceChildren(...result.reasons.map(reason => {const li=document.createElement('li');li.textContent=reason;return li;}));
  $('next-step').textContent = result.next || 'Correct the inputs and evaluate again.';
  $('copy-status').textContent = '';
  window.lastReceipt = `Launch Ledger — illustrative decision receipt\nFeature: guided setup flow; pilot exposure: ${values.exposure}%\nRecommendation: ${labels[result.status]}\nActivation: ${values.baseline}% → ${values.pilot}% (${result.lift?.toFixed(1) ?? '—'} pp)\nSupport contacts: ${values.supportBaseline}% → ${values.supportPilot}%\np95 load time: ${values.latencyBaseline} → ${values.latencyPilot} ms\nPilot accounts: ${values.sample}; events verified: ${values.eventsReady ? 'yes' : 'no'}; rollback ready: ${values.rollbackReady ? 'yes' : 'no'}\nReasons: ${result.reasons.join(' ')}\nNext: ${result.next || 'Correct inputs.'}\nThis is synthetic portfolio data, not a production outcome.`;
}

function update() { const values=valuesFromForm(); render(evaluate(values), values); }
function loadScenario(key) { const scenario=scenarios[key]; for (const id of numericIds) $(id).value=scenario[id]; $('eventsReady').checked=scenario.eventsReady; $('rollbackReady').checked=scenario.rollbackReady; update(); }
$('scenario').addEventListener('change', event => loadScenario(event.target.value));
$('decision-form').addEventListener('submit', event => {event.preventDefault(); update();});
$('decision-form').addEventListener('input', update);
$('copy-receipt').addEventListener('click', async () => { try {await navigator.clipboard.writeText(window.lastReceipt); $('copy-status').textContent='Decision receipt copied.';} catch { $('copy-status').textContent='Clipboard unavailable. Try a secure browser tab.'; }});
loadScenario('promising');
