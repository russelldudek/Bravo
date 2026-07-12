const panels = {
  read: {
    number: '01',
    kicker: 'Chapter 01 · Read the System',
    title: 'Build a shared picture before prescribing a fix.',
    mapDescription: 'Understand the business, data, constraints, and decision rights before prescribing.',
    body: 'Map the operating system as it actually works: demand signals, production commitments, inventory locations, partner dependencies, cash exposure, decision rights, data quality, and recurring fire drills.',
    artifacts: [
      ['Operating map', 'Demand → buy → make → move → sell → cash, with owners and failure points.'],
      ['Decision inventory', 'Which decisions recur, who owns them, what inputs are missing, and what happens when they are late.'],
      ['Risk ledger', 'Service, cash, margin, quality, and partner risks ranked by consequence and reversibility.'],
      ['30-day learning agenda', 'Explicit questions, evidence sources, and validation checkpoints for the client team.']
    ]
  },
  stabilize: {
    number: '02',
    kicker: 'Chapter 02 · Stabilize the Flow',
    title: 'Protect the customer and the cash while the deeper system is repaired.',
    mapDescription: 'Improve service, cash, and reliability around the most consequential constraints.',
    body: 'Create immediate operating control around the current constraints. The goal is fewer surprises, faster escalation, and explicit tradeoffs—not a burst of heroics that cannot be sustained.',
    artifacts: [
      ['Exception cadence', 'A short cross-functional review for shortages, late production, inventory discrepancies, OTIF risk, and cash-critical buys.'],
      ['Constraint board', 'One owner, next action, decision deadline, and consequence for each critical constraint.'],
      ['Partner recovery plans', 'SLAs, issue aging, escalation paths, and recovery commitments for 3PLs, co-mans, and suppliers.'],
      ['Cash-aware prioritization', 'Make service and inventory decisions with working-capital consequences visible.']
    ]
  },
  build: {
    number: '03',
    kicker: 'Chapter 03 · Build the Mechanism',
    title: 'Turn repeated judgment into a repeatable operating mechanism.',
    mapDescription: 'Design stage-appropriate systems, tools, scorecards, and operating rhythms.',
    body: 'Codify only what is stable enough to standardize. Install the minimum viable forecasting, S&OP, partner management, inventory control, cost visibility, and systems discipline the brand needs at its current stage.',
    artifacts: [
      ['S&OP decision cadence', 'A monthly rhythm linking commercial demand, supply realities, inventory, cash, and executive tradeoffs.'],
      ['COGS truth set', 'Shared definitions and variance visibility for materials, conversion, packaging, freight, and fulfillment.'],
      ['Partner scorecards', 'Service, quality, responsiveness, economics, and corrective-action follow-through.'],
      ['System fit plan', 'A staged ERP/IMS/WMS approach tied to decision needs and data ownership, not software enthusiasm.']
    ]
  },
  transfer: {
    number: '04',
    kicker: 'Chapter 04 · Transfer the Capability',
    title: 'A successful engagement should leave the client stronger, not more dependent.',
    mapDescription: 'Document, coach, empower, and verify that the client can sustain the gains.',
    body: 'Document the mechanism, coach the people who will run it, define escalation rules, and make the management system visible enough that it survives the handoff.',
    artifacts: [
      ['Role clarity', 'Named owners, decision rights, operating cadences, and escalation thresholds.'],
      ['Standard work', 'Usable checklists, templates, and exception logic embedded into the client’s actual tools.'],
      ['Manager coaching', 'Observation-based feedback and capability building for the people inheriting day-to-day execution.'],
      ['Exit scorecard', 'Evidence that the system is producing better behavior and outcomes before Bravo steps back.']
    ]
  }
};

function renderPanel(key) {
  const panelData = panels[key];
  const panel = document.querySelector('#model-panel');
  if (!panel || !panelData) return;

  panel.innerHTML = `
    <div class="model-copy">
      <div class="panel-kicker">${panelData.kicker}</div>
      <h3>${panelData.title}</h3>
      <p>${panelData.body}</p>
    </div>
    <div class="panel-grid">
      ${panelData.artifacts.map(([title, description]) => `<div class="artifact"><b>${title}</b><p>${description}</p></div>`).join('')}
    </div>`;

  const wheel = document.querySelector('#runbook-wheel');
  if (wheel) wheel.dataset.stage = key;

  document.querySelectorAll('[data-map-node]').forEach(node => {
    node.classList.toggle('is-active', node.dataset.mapNode === key);
  });

  const number = document.querySelector('#map-stage-number');
  const title = document.querySelector('#map-stage-title');
  const description = document.querySelector('#map-stage-description');
  if (number) number.textContent = panelData.number;
  if (title) title.textContent = panelData.kicker.replace(/^Chapter \d+ · /, '');
  if (description) description.textContent = panelData.mapDescription;
}

const tabButtons = [...document.querySelectorAll('[data-panel]')];
tabButtons.forEach((button, index) => {
  button.addEventListener('click', () => {
    tabButtons.forEach(item => item.setAttribute('aria-selected', 'false'));
    button.setAttribute('aria-selected', 'true');
    renderPanel(button.dataset.panel);
  });

  button.addEventListener('keydown', event => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    let nextIndex = index;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') nextIndex = (index + 1) % tabButtons.length;
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') nextIndex = (index - 1 + tabButtons.length) % tabButtons.length;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = tabButtons.length - 1;
    tabButtons[nextIndex].focus();
    tabButtons[nextIndex].click();
  });
});
renderPanel('read');

function initSimulator() {
  const root = document.querySelector('#simulator');
  if (!root) return;
  const cards = [...root.querySelectorAll('.client-card')];
  const recalc = () => {
    const rows = cards.map(card => {
      const inputs = [...card.querySelectorAll('input[type="range"]')];
      const values = inputs.map(input => Number(input.value));
      inputs.forEach(input => {
        const valueLabel = input.closest('.metric-row')?.querySelector('label span');
        if (valueLabel) valueLabel.textContent = input.value;
      });
      const score = Math.round(values[0] * .35 + values[1] * .30 + values[2] * .20 + values[3] * .15);
      const scoreNode = card.querySelector('.score');
      if (scoreNode) scoreNode.textContent = score;
      return { card, score };
    });
    const total = rows.reduce((sum, row) => sum + row.score, 0) || 1;
    rows.forEach(row => {
      const hours = (20 * row.score / total).toFixed(1);
      const allocation = row.card.querySelector('.allocation');
      if (allocation) allocation.textContent = `Suggested weekly attention: ${hours} hrs`;
    });
    const sorted = rows.sort((a, b) => b.score - a.score);
    const summary = root.querySelector('.sim-summary');
    if (summary && sorted.length > 1) {
      summary.innerHTML = `<strong>Portfolio read:</strong> ${sorted[0].card.dataset.name} deserves the next senior decision block. ${sorted[1].card.dataset.name} is second. This is a prioritization hypothesis, not a substitute for client context or SOW commitments.`;
    }
  };
  root.querySelectorAll('input').forEach(input => input.addEventListener('input', recalc));
  recalc();
}
initSimulator();
