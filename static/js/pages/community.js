/**
 * NEGARIT ET - COMMUNITY VOLUNTEER ROSTER CONTROLLER
 * Manages registered Negarit Community members across Ethiopia who volunteer
 * to verify ground truth, host displaced citizens, and guide relief agencies.
 */

window.CommunityPage = {
  volunteers: [
    {
      id: "NGR-VOL-1001",
      name: "Kedir Mohammed",
      woreda: "Asayita, Afar",
      skills: "Water Logistics & Pastoral Tanker Guiding",
      hospitalityRole: "Coordinates oasis hydration and forage camps",
      status: "Active Responding",
      accuracy: "98.5%",
      contact: "+251 91 145 2389"
    },
    {
      id: "NGR-VOL-1002",
      name: "Bethlehem Tadesse",
      woreda: "Sawla, South Ethiopia (Gofa)",
      skills: "Mountain Search & Rescue, Slope Scouting",
      hospitalityRole: "Hosts 12 displaced highland families",
      status: "Active Responding",
      accuracy: "99.2%",
      contact: "+251 92 278 9123"
    },
    {
      id: "NGR-VOL-1003",
      name: "Robel Desta",
      woreda: "Adama / Awash Basin, Oromia",
      skills: "River Basin Gauge Telemetry & Hospitality",
      hospitalityRole: "Community hall shelter logistics coordinator",
      status: "Active Ready",
      accuracy: "97.8%",
      contact: "+251 93 345 1290"
    },
    {
      id: "NGR-VOL-1004",
      name: "Filsan Omar",
      woreda: "Jijiga / Degehabur, Somali",
      skills: "Pastoral Drought Eyewitness & Food Distribution",
      hospitalityRole: "Directs food aid convoys to isolated pastoralists",
      status: "Active Ready",
      accuracy: "96.4%",
      contact: "+251 94 489 0123"
    },
    {
      id: "NGR-VOL-1005",
      name: "Yared Hailu",
      woreda: "Hawassa, Sidama",
      skills: "Rift Valley Tectonic Safety & First Aid",
      hospitalityRole: "Community emergency lodging coordinator",
      status: "Active Ready",
      accuracy: "98.1%",
      contact: "+251 95 567 8901"
    },
    {
      id: "NGR-VOL-1006",
      name: "Genet Wolde",
      woreda: "Dessie, Amhara",
      skills: "Field Telemetry & Telegram Mesh Trainer",
      hospitalityRole: "Coordinates student volunteer response unit",
      status: "Active Ready",
      accuracy: "99.0%",
      contact: "+251 96 612 3456"
    }
  ],

  async init() {
    const container = document.getElementById('view-community');
    if (!container) return;

    let rows = '';
    this.volunteers.forEach(v => {
      rows += `
        <tr class="hover:bg-slate-800/40 transition-colors border-b border-border/40 text-xs">
          <td class="px-4 py-3 font-mono font-bold text-brand-cyan">${v.id}</td>
          <td class="px-4 py-3">
            <div class="font-bold text-white flex items-center gap-2">
              <div class="w-6 h-6 rounded-full bg-brand-cyan/20 text-brand-cyan flex items-center justify-center font-bold text-[10px]">
                ${v.name.split(' ').map(n=>n[0]).join('')}
              </div>
              ${v.name}
            </div>
            <div class="text-[11px] text-slate-400 mt-0.5">${v.woreda}</div>
          </td>
          <td class="px-4 py-3 text-slate-200">
            <div class="font-medium">${v.skills}</div>
            <div class="text-[11px] text-amber-400 mt-0.5 flex items-center gap-1">
              <i data-lucide="heart" class="w-3 h-3"></i> ${v.hospitalityRole}
            </div>
          </td>
          <td class="px-4 py-3 font-mono text-emerald-400 font-bold">${v.accuracy}</td>
          <td class="px-4 py-3 font-mono text-slate-300">${v.contact}</td>
          <td class="px-4 py-3">
            <span class="px-2 py-0.5 rounded text-[10px] font-bold ${v.status.includes('Responding') ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-brand-blue/20 text-brand-blue border border-brand-blue/30'}">
              ${v.status}
            </span>
          </td>
        </tr>
      `;
    });

    container.innerHTML = `
      <div class="flex flex-col gap-6">
        <div class="acrylic-card p-5 rounded-2xl border border-white/10 bg-gradient-to-r from-slate-900 to-brand-navy flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div>
            <div class="flex items-center gap-2 mb-1">
              <span class="badge-subtle px-2 py-0.5 rounded text-[10px] font-mono font-bold">COMMUNITY SOLIDARITY</span>
              <span class="text-xs text-slate-400">&bull; 14,850+ Registered Members Nationwide</span>
            </div>
            <h1 class="text-2xl font-extrabold text-white tracking-tight">Negarit Volunteer Community Network</h1>
            <p class="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              These are local citizens who registered as members to protect their woredas. When a crisis occurs, they are the trusted eyewitnesses who verify weather reports, provide hospitality to displaced neighbors, and guide arriving humanitarian relief agencies.
            </p>
          </div>
          <button onclick="window.ReportsPage?.showNewReportModal()" class="px-4 py-2 bg-gradient-to-r from-brand-blue to-brand-cyan text-slate-950 font-bold text-xs rounded-xl shadow-lg transition-all flex items-center gap-2 shrink-0">
            <i data-lucide="user-plus" class="w-4 h-4"></i> Register New Volunteer
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div class="glass-card p-4 rounded-xl border border-border">
            <div class="text-xs text-slate-400">Total Registered Members</div>
            <div class="text-2xl font-bold font-mono text-brand-cyan mt-1">14,850+</div>
            <div class="text-[10px] text-slate-500 mt-0.5">Across all 12 regions</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-border">
            <div class="text-xs text-slate-400">Hospitality Units Ready</div>
            <div class="text-2xl font-bold font-mono text-amber-400 mt-1">1,840 Beds</div>
            <div class="text-[10px] text-slate-500 mt-0.5">Community host homes & halls</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-border">
            <div class="text-xs text-slate-400">Verification Consensus</div>
            <div class="text-2xl font-bold font-mono text-emerald-400 mt-1">98.2%</div>
            <div class="text-[10px] text-slate-500 mt-0.5">Ground-truth accuracy</div>
          </div>
          <div class="glass-card p-4 rounded-xl border border-border">
            <div class="text-xs text-slate-400">Response Readiness</div>
            <div class="text-2xl font-bold font-mono text-purple-400 mt-1">&lt; 15 min</div>
            <div class="text-[10px] text-slate-500 mt-0.5">SMS & Telegram mesh</div>
          </div>
        </div>

        <div class="glass-card rounded-xl border border-border overflow-hidden">
          <div class="p-4 border-b border-border bg-card/50 flex justify-between items-center">
            <h2 class="font-semibold text-sm text-white">Registered Regional Volunteer Leaders</h2>
            <span class="text-xs text-slate-400 font-mono">Active Mesh Roster</span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-sm text-left">
              <thead class="text-xs text-slate-400 uppercase bg-card/30 border-b border-border">
                <tr>
                  <th class="px-4 py-3">Member ID</th>
                  <th class="px-4 py-3">Volunteer & Location</th>
                  <th class="px-4 py-3">Skill Specialization & Hospitality Role</th>
                  <th class="px-4 py-3">Accuracy</th>
                  <th class="px-4 py-3">Emergency Contact</th>
                  <th class="px-4 py-3">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-border">${rows}</tbody>
            </table>
          </div>
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
};
