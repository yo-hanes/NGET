/**
 * NEGARIT ET - GOVERNMENT BROADCAST APPROVAL QUEUE
 * Authorizes emergency SMS & USSD broadcasts to affected Ethiopian populations.
 */

window.ApprovalQueuePage = {
  pendingAlerts: [
    {
      id: "NGR-2026-0841",
      region: "Gambela Zone (Baro Catchment)",
      hazard: "Baro River Flash Flood",
      populationAtRisk: 184200,
      confidence: 96,
      channels: ["SMS", "USSD"],
      smsText: "[NEGARIT EMERGENCY] Baro River water levels critical. Evacuate low-lying riverbanks immediately to designated highland shelters.",
      urgency: "CRITICAL"
    },
    {
      id: "NGR-2026-0839",
      region: "Gofa Zone (South Ethiopia)",
      hazard: "Highland Landslide Warning",
      populationAtRisk: 38400,
      confidence: 91,
      channels: ["SMS", "USSD"],
      smsText: "[NEGARIT EMERGENCY] Severe rainfall soil saturation in Gofa hills. Move away from steep slopes. Call 444 for search and rescue.",
      urgency: "HIGH"
    },
    {
      id: "NGR-2026-0836",
      region: "Somali Region (Pastoral Lowlands)",
      hazard: "Severe Drought Alert",
      populationAtRisk: 412000,
      confidence: 88,
      channels: ["SMS"],
      smsText: "[NEGARIT ADVISORY] Aridity index reached critical levels. Emergency water trucking routes open. Dial *444# for distribution points.",
      urgency: "ELEVATED"
    }
  ],

  init() {
    const container = document.getElementById('view-approval');
    if (!container) return;

    this.render();
  },

  render() {
    const container = document.getElementById('view-approval');
    if (!container) return;

    let cardsHtml = '';
    if (this.pendingAlerts.length === 0) {
      cardsHtml = `
        <div class="glass-card p-12 text-center rounded-xl border border-border">
          <i data-lucide="check-circle-2" class="w-12 h-12 text-emerald-400 mx-auto mb-3"></i>
          <h3 class="text-lg font-bold text-white">All Alerts Processed</h3>
          <p class="text-sm text-slate-400 mt-1">No pending emergency broadcasts awaiting federal authorization.</p>
        </div>
      `;
    } else {
      this.pendingAlerts.forEach((alert, idx) => {
        cardsHtml += `
          <div class="glass-card p-5 rounded-xl border border-border hover:border-brand-blue/50 transition-all flex flex-col gap-4" id="alert-card-${alert.id}">
            <div class="flex flex-col sm:flex-row justify-between sm:items-center gap-2 border-b border-border/50 pb-3">
              <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 rounded text-xs font-mono font-bold bg-brand-blue/20 text-brand-blue border border-brand-blue/30">${alert.id}</span>
                <h3 class="font-bold text-white text-base">${alert.hazard} &bull; ${alert.region}</h3>
              </div>
              <span class="px-2.5 py-0.5 rounded text-xs font-bold ${alert.urgency === 'CRITICAL' ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}">
                ${alert.urgency}
              </span>
            </div>

            <div class="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-card/40 p-3 rounded-lg border border-border/40 text-xs">
              <div>
                <div class="text-slate-500">Population at Risk</div>
                <div class="font-bold text-white text-sm font-mono mt-0.5">${alert.populationAtRisk.toLocaleString()}</div>
              </div>
              <div>
                <div class="text-slate-500">Model Confidence</div>
                <div class="font-bold text-brand-blue text-sm font-mono mt-0.5">${alert.confidence}%</div>
              </div>
              <div>
                <div class="text-slate-500">Target Channels</div>
                <div class="font-semibold text-slate-200 mt-0.5">${alert.channels.join(', ')}</div>
              </div>
              <div>
                <div class="text-slate-500">Verification Engine</div>
                <div class="font-semibold text-slate-200 mt-0.5">Automated Multi-Source</div>
              </div>
            </div>

            <div class="bg-slate-900/70 p-3.5 rounded-lg border border-slate-700/60 font-mono text-xs text-slate-200">
              <div class="text-[10px] text-slate-400 uppercase tracking-wider mb-1">Broadcast SMS Payload Preview:</div>
              "${alert.smsText}"
            </div>

            <div class="flex justify-end gap-3 pt-2">
              <button onclick="window.ApprovalQueuePage.rejectAlert('${alert.id}')" class="px-4 py-2 border border-slate-700 hover:bg-slate-800 text-slate-300 rounded-lg text-xs font-semibold transition-colors">
                Reject / Escalate
              </button>
              <button onclick="window.ApprovalQueuePage.approveAlert('${alert.id}')" class="px-4 py-2 bg-brand-red hover:bg-brand-red/80 text-white rounded-lg text-xs font-bold shadow-lg shadow-brand-red/20 transition-all flex items-center gap-1.5">
                <i data-lucide="send" class="w-3.5 h-3.5"></i> Authorize Broadcast
              </button>
            </div>
          </div>
        `;
      });
    }

    container.innerHTML = `
      <div class="flex flex-col gap-6">
        <div class="acrylic-card p-5 rounded-2xl border border-white/10 bg-gradient-to-r from-red-950/40 via-brand-navy to-slate-900 flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-red-500/20 text-red-400 border border-red-500/30">MANDATORY FEDERAL GUARDRAIL</span>
              <span class="text-xs text-slate-400">&bull; Anti-Panic Early Warning Protocol</span>
            </div>
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Federal Broadcast Authorization Queue</h1>
            <p class="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              <strong>All emergency SMS broadcasts must be approved by authorities before release to the public.</strong> Inspect hazard severity, affected woredas, and drafted evacuation messages before releasing to mobile networks.
            </p>
          </div>
          <div class="text-xs px-3 py-2 rounded-xl bg-card border border-border text-slate-300 shrink-0">
            Pending Authorization: <span class="font-bold text-red-400 font-mono text-sm">${this.pendingAlerts.length} Alerts</span>
          </div>
        </div>
        <div class="space-y-4">
          ${cardsHtml}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  },

  approveAlert(alertId) {
    const alert = this.pendingAlerts.find(a => a.id === alertId);
    if (!alert) return;

    this.pendingAlerts = this.pendingAlerts.filter(a => a.id !== alertId);
    this.render();

    if (window.App && window.App.showToast) {
      window.App.showToast(`Emergency broadcast ${alertId} authorized for ${alert.populationAtRisk.toLocaleString()} citizens via ${alert.channels.join('+')}`, 'success');
    }
  },

  rejectAlert(alertId) {
    this.pendingAlerts = this.pendingAlerts.filter(a => a.id !== alertId);
    this.render();

    if (window.App && window.App.showToast) {
      window.App.showToast(`Alert ${alertId} rejected and returned for manual reconnaissance.`, 'info');
    }
  }
};

