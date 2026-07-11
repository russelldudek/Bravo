const panels = {
  read: {
    kicker: 'Chapter 01 - Read the System',
    title: 'Build a shared picture before prescribing a fix.',
    body: 'Map the operating system as it actually works: demand signals, production commitments, inventory locations, partner dependencies, cash exposure, decision rights, data quality, and recurring fire drills.',
    artifacts: [
      ['Operating map', 'Demand → buy → make → move → sell → cash, with owners and failure points.'],
      ['Decision inventory', 'Which decisions recur, who owns them, what inputs are missing, and what happens when they are late.'],
      ['Risk ledger', 'Service, cash, margin, quality, and partner risks ranked by consequence and reversibility.'],
      ['30-day learning agenda', 'Explicit questions, evidence sources, and validation checkpoints for the client team.']
    ]
  },
  stabilize: {
    kicker: 'Chapter 02 - Stabilize the Flow',
    title: 'Protect the customer and the cash while the deeper system is repaired.',
    body: 'Create immediate operating control around the current constraints. The goal is fewer surprises, faster escalation, and explicit tradeoffs - not a burst of heroics that cannot be sustained.',
    artifacts: [
      ['Exception cadence', 'A short cross-functional review for shortages, late production, inventory discrepancies, OTIF risk, and cash-critical buys.'],
      ['Constraint board', 'One owner, next action, decision deadline, and consequence for each critical constraint.'],
      ['Partner recovery plans', 'SLAs, issue aging, escalation paths, and recovery commitments for 3PLs, co-mans, and suppliers.'],
      ['Cash-aware prioritization', 'Make service and inventory decisions with working-capital consequences visible.']
    ]
  },
  build: {
    kicker: 'Chapter 03 - Build the Mechanism',
    title: 'Turn repeated judgment into a repeatable operating mechanism.',
    body: 'Codify only what is stable enough to standardize. Install the minimum viable forecasting, S&OP, partner management, inventory control, cost visibility, and systems discipline the brand needs at its current stage.',
    artifacts: [
      ['S&OP spine', 'A monthly decision cadence linking commercial demand, supply realities, inventory, cash, and executive tradeoffs.'],
      ['COGS truth set', 'Shared definitions and variance visibility for materials, conversion, packaging, freight, and fulfillment.'],
      ['Partner scorecards', 'Service, quality, responsiveness, economics, and corrective-action follow-through.'],
      ['System fit plan', 'A staged ERP/IMS/WMS approach tied to decision needs and data ownership, not software enthusiasm.']
    ]
  },
  transfer: {
    kicker: 'Chapter 04 - Transfer the Capability',
    title: 'A successful engagement should leave the client stronger, not more dependent.',
    body: 'Document the mechanism, coach the people who will run it, define escalation rules, and make the management system visible enough that it survives the handoff.',
    artifacts: [
      ['Role clarity', 'Named owners, decision rights, operating cadences, and escalation thresholds.'],
      ['Standard work', 'Usable checklists, templates, and exception logic embedded into the client’s actual tools.'],
      ['Manager coaching', 'Observation-based feedback and capability building for the people inheriting day-to-day execution.'],
      ['Exit scorecard', 'Evidence that the system is producing better behavior and outcomes before Bravo steps back.']
    ]
  }
};

function renderPanel(key){
  const p = panels[key];
  const panel = document.querySelector('#model-panel');
  if(!panel || !p) return;
  panel.innerHTML = `
    <div class="panel-kicker">${p.kicker}</div>
    <h3 style="font-size:2.25rem;margin-top:8px">${p.title}</h3>
    <p style="font-size:1.06rem;color:var(--muted);max-width:72ch">${p.body}</p>
    <div class="panel-grid">${p.artifacts.map(([t,d]) => `<div class="artifact"><b>${t}</b><p>${d}</p></div>`).join('')}</div>`;
}

document.querySelectorAll('[data-panel]').forEach(btn=>{
  btn.addEventListener('click',()=>{
    document.querySelectorAll('[data-panel]').forEach(b=>b.setAttribute('aria-selected','false'));
    btn.setAttribute('aria-selected','true');
    renderPanel(btn.dataset.panel);
  });
});
renderPanel('read');

function initSimulator(){
  const root = document.querySelector('#simulator');
  if(!root) return;
  const cards = [...root.querySelectorAll('.client-card')];
  const recalc = ()=>{
    const rows = cards.map(card=>{
      const inputs = [...card.querySelectorAll('input[type="range"]')];
      const vals = inputs.map(i=>Number(i.value));
      inputs.forEach(input=>{
        const valueLabel = input.closest('.metric-row')?.querySelector('label span');
        if(valueLabel) valueLabel.textContent = input.value;
      });
      const score = Math.round(vals[0]*.35 + vals[1]*.30 + vals[2]*.20 + vals[3]*.15);
      card.querySelector('.score').textContent = score;
      return {card,score};
    });
    const total = rows.reduce((s,r)=>s+r.score,0) || 1;
    rows.forEach(r=>{
      const hours = (20*r.score/total).toFixed(1);
      r.card.querySelector('.allocation').textContent = `Suggested weekly attention: ${hours} hrs`;
    });
    const sorted = rows.sort((a,b)=>b.score-a.score);
    const summary = root.querySelector('.sim-summary');
    summary.innerHTML = `<strong>Portfolio read:</strong> ${sorted[0].card.dataset.name} deserves the next senior decision block. ${sorted[1].card.dataset.name} is second. This is a prioritization hypothesis, not a substitute for client context or SOW commitments.`;
  };
  root.querySelectorAll('input').forEach(i=>i.addEventListener('input',recalc));
  recalc();
}
initSimulator();
