/**
 * NEGARIT ET - DONATIONS & RELIEF CAMPAIGNS CONTROLLER
 * Tracks emergency crowdfunding campaigns and Safaricom M-PESA mobile donor contributions.
 */

window.DonationsPage = {
  campaigns: [
    { id: "CMP-01", title: "Gambela Baro River Flood Response", target: 5000000, raised: 3750000, donors: 1420, urgency: "CRITICAL", focus: "Emergency boats, clean water tabs, high-energy biscuits" },
    { id: "CMP-02", title: "Borena Pastoralist Drought Resilience", target: 3000000, raised: 1280000, donors: 840, urgency: "HIGH", focus: "Livestock fodder cakes, emergency water trucking" },
    { id: "CMP-03", title: "Gofa Highlands Mudslide Shelter", target: 2500000, raised: 2150000, donors: 1890, urgency: "HIGH", focus: "All-weather family tents, trauma care, medical triage" }
  ],

  init() {
    const container = document.getElementById('view-donations');
    if (!container) return;

    let cardsHtml = '';
    this.campaigns.forEach(c => {
      const pct = Math.round((c.raised / c.target) * 100);
      cardsHtml += `
        <div class="glass-card p-5 rounded-xl border border-border flex flex-col justify-between gap-4">
          <div>
            <div class="flex justify-between items-center mb-2">
              <span class="text-xs font-mono font-bold text-brand-blue">${c.id}</span>
              <span class="px-2 py-0.5 rounded text-[10px] font-bold ${c.urgency === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
                ${c.urgency}
              </span>
            </div>
            <h3 class="font-bold text-white text-base mb-1">${c.title}</h3>
            <p class="text-xs text-slate-400">${c.focus}</p>
          </div>

          <div>
            <div class="flex justify-between text-xs mb-1">
              <span class="text-slate-400">ETB ${c.raised.toLocaleString()} raised</span>
              <span class="font-bold text-white">${pct}% of ETB ${c.target.toLocaleString()}</span>
            </div>
            <div class="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div class="bg-brand-blue h-full rounded-full transition-all duration-500" style="width: ${pct}%"></div>
            </div>
            <div class="flex justify-between items-center text-[11px] text-slate-500 mt-3">
              <span>${c.donors.toLocaleString()} M-PESA Donors</span>
              <button onclick="alert('Simulated M-PESA donation bottom-sheet: Dial *733# or use Safaricom App')" class="px-3 py-1 bg-brand-green hover:bg-emerald-600 text-white rounded text-xs font-semibold transition-colors flex items-center gap-1">
                <i data-lucide="heart" class="w-3 h-3"></i> Donate via M-PESA
              </button>
            </div>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="flex flex-col gap-6">
        <div class="flex flex-col md:flex-row justify-between md:items-center gap-2">
          <div>
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Disaster Relief Crowdfunding & Aid Allocation</h1>
            <p class="text-sm text-slate-400 mt-0.5">Transparent ledger of citizen donations, institutional pledges, and M-PESA relief disbursements.</p>
          </div>
          <div class="text-xs px-3 py-1.5 rounded-lg bg-card border border-border text-slate-300">
            Total Distributed: <span class="font-bold font-mono text-emerald-400">ETB 8,640,000</span>
          </div>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          ${cardsHtml}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
};

