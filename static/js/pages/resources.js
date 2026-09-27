/**
 * NEGARIT ET - RESOURCES & INVENTORY CONTROLLER
 * Tracks emergency relief stock, warehouse inventory, and medical aid caches across regional depots.
 */

window.ResourcesPage = {
  warehouses: [
    { depot: "Addis Ababa Central Hub", capacity: "88%", waterPurification: "120,000 tabs", grainPacks: "450 tons", medKits: "2,400 units", shelters: "850 tents" },
    { depot: "Hawassa Southern Depot", capacity: "72%", waterPurification: "85,000 tabs", grainPacks: "180 tons", medKits: "1,100 units", shelters: "620 tents" },
    { depot: "Dire Dawa Eastern Cache", capacity: "65%", waterPurification: "95,000 tabs", grainPacks: "210 tons", medKits: "850 units", shelters: "410 tents" },
    { depot: "Bahir Dar Northern Depot", capacity: "54%", waterPurification: "60,000 tabs", grainPacks: "140 tons", medKits: "900 units", shelters: "350 tents" }
  ],

  init() {
    const container = document.getElementById('view-resources');
    if (!container) return;

    let cardsHtml = '';
    this.warehouses.forEach(w => {
      cardsHtml += `
        <div class="glass-card p-5 rounded-xl border border-border flex flex-col gap-3">
          <div class="flex justify-between items-center border-b border-border/50 pb-2">
            <h3 class="font-bold text-white text-base">${w.depot}</h3>
            <span class="px-2 py-0.5 rounded text-xs font-bold bg-brand-blue/20 text-brand-blue border border-brand-blue/30">${w.capacity} Full</span>
          </div>
          <div class="grid grid-cols-2 gap-2 text-xs">
            <div class="bg-card/40 p-2.5 rounded border border-border/40">
              <div class="text-slate-400">Water Purification</div>
              <div class="font-bold font-mono text-white text-sm mt-0.5">${w.waterPurification}</div>
            </div>
            <div class="bg-card/40 p-2.5 rounded border border-border/40">
              <div class="text-slate-400">Grain / Food Rations</div>
              <div class="font-bold font-mono text-emerald-400 text-sm mt-0.5">${w.grainPacks}</div>
            </div>
            <div class="bg-card/40 p-2.5 rounded border border-border/40">
              <div class="text-slate-400">Trauma & Med Kits</div>
              <div class="font-bold font-mono text-brand-red text-sm mt-0.5">${w.medKits}</div>
            </div>
            <div class="bg-card/40 p-2.5 rounded border border-border/40">
              <div class="text-slate-400">Family Tents</div>
              <div class="font-bold font-mono text-amber-400 text-sm mt-0.5">${w.shelters}</div>
            </div>
          </div>
          <div class="flex justify-end pt-1">
            <button class="text-xs text-brand-blue hover:underline font-medium">Requisition Supplies &rarr;</button>
          </div>
        </div>
      `;
    });

    container.innerHTML = `
      <div class="flex flex-col gap-6">
        <div>
          <h1 class="text-2xl font-extrabold text-white tracking-tight">National Relief Inventory & Depots</h1>
          <p class="text-sm text-slate-400 mt-0.5">Physical tracking of food reserves, emergency shelter, medicine, and clean water logistical caches.</p>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${cardsHtml}
        </div>
      </div>
    `;

    if (window.lucide) window.lucide.createIcons();
  }
};

