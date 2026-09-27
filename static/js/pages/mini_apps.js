/**
 * NEGARIT ET - MINI APPS & MULTI-CHANNEL HUB CONTROLLER
 * Minimalist cards with a fixed, full-screen simulator:
 * - Mobile mini-apps (Telegram & M-PESA) fit vertically in an authentic phone chassis (9:19.5 aspect ratio),
 *   locking the background and confining scrolling strictly to the phone screen.
 * - Emulators (USSD *444# & Voice 444) expand into a wide full-stage layout.
 */

window.MiniAppsPage = {
  currentApp: null,

  apps: {
    telegram: {
      id: 'telegram',
      title: 'Telegram Mini App',
      subtitle: 'Field Reporter & Digital Volunteer ID',
      tag: 'Telegram WebApp',
      tagColor: 'bg-sky-500/10 text-sky-400 border-sky-500/20',
      icon: 'send',
      iconBg: 'bg-sky-500/20 text-sky-400',
      url: '/static/mini-apps/telegram/index.html',
      isMobile: true
    },
    mpesa: {
      id: 'mpesa',
      title: 'Safaricom M-PESA',
      subtitle: 'Emergency Relief & Smart Box Drops',
      tag: 'M-PESA Daraja',
      tagColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
      icon: 'smartphone',
      iconBg: 'bg-emerald-500/20 text-emerald-400',
      url: '/static/mini-apps/mpesa/index.html',
      isMobile: true
    },
    ussd: {
      id: 'ussd',
      title: 'USSD *444#',
      subtitle: '2G Feature Phone Offline Channel',
      tag: 'GSM 03.38',
      tagColor: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      icon: 'hash',
      iconBg: 'bg-amber-500/20 text-amber-400',
      url: '/static/mini-apps/ussd/index.html',
      isMobile: false
    },
    voice: {
      id: 'voice',
      title: 'Voice 444 Hotline',
      subtitle: 'Toll-Free Spoken Language IVR',
      tag: 'Voice IVR',
      tagColor: 'bg-red-500/10 text-red-400 border-red-500/20',
      icon: 'phone-call',
      iconBg: 'bg-red-500/20 text-red-400',
      url: '/static/mini-apps/voice/index.html',
      isMobile: false
    }
  },

  init() {
    const container = document.getElementById('view-mini-apps');
    if (!container) return;

    container.innerHTML = `
      <div class="flex flex-col gap-6">
        <!-- Header -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div class="flex items-center gap-2">
              <h1 class="text-2xl font-extrabold text-white tracking-tight">Mini Apps Hub</h1>
              <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full bg-brand-green/20 text-brand-green border border-brand-green/30">
                4 Live Channels
              </span>
            </div>
            <p class="text-sm text-slate-400 mt-1">
              Multi-channel ingestion network for citizen field reporting, 2G USSD dialers, and emergency mobile relief.
            </p>
          </div>
        </div>

        <!-- 4 Minimal Channel Cards Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          ${this.renderCard('telegram')}
          ${this.renderCard('mpesa')}
          ${this.renderCard('ussd')}
          ${this.renderCard('voice')}
        </div>
      </div>

      <!-- Full-Screen Interactive Device Simulator Modal -->
      <div id="mini-app-modal" class="fixed inset-0 w-screen h-screen z-[100] bg-[#060c18] flex flex-col m-0 p-0 hidden overflow-hidden select-none">
        
        <!-- Full-Screen Top Control Bar -->
        <div class="h-13 py-2 px-4 sm:px-6 bg-[#0a1122] border-b border-border flex items-center justify-between gap-3 shrink-0 z-10">
          
          <!-- Left: App Identity -->
          <div class="flex items-center gap-3 min-w-0">
            <button onclick="MiniAppsPage.closeModal()" class="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 shrink-0 border border-border">
              <i data-lucide="arrow-left" class="w-4 h-4"></i>
              <span>Exit Fullscreen</span>
            </button>
            <div class="h-5 w-px bg-border shrink-0 hidden sm:block"></div>
            <div class="flex items-center gap-2.5 min-w-0">
              <div id="modal-app-icon" class="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"></div>
              <div class="min-w-0">
                <div class="flex items-center gap-2">
                  <h3 id="modal-app-title" class="font-bold text-white text-sm truncate"></h3>
                  <span id="modal-app-tag" class="px-2 py-0.5 text-[10px] font-semibold rounded-full border shrink-0 hidden sm:inline-block"></span>
                </div>
              </div>
            </div>
          </div>

          <!-- Center: Quick Channel Switcher -->
          <div class="flex items-center gap-1 bg-slate-900 border border-border p-1 rounded-lg">
            <button onclick="MiniAppsPage.openApp('telegram')" id="modal-tab-telegram" class="px-3 py-1 text-xs rounded transition-colors text-slate-400 hover:text-white">Telegram</button>
            <button onclick="MiniAppsPage.openApp('mpesa')" id="modal-tab-mpesa" class="px-3 py-1 text-xs rounded transition-colors text-slate-400 hover:text-white">M-PESA</button>
            <button onclick="MiniAppsPage.openApp('ussd')" id="modal-tab-ussd" class="px-3 py-1 text-xs rounded transition-colors text-slate-400 hover:text-white">USSD *444#</button>
            <button onclick="MiniAppsPage.openApp('voice')" id="modal-tab-voice" class="px-3 py-1 text-xs rounded transition-colors text-slate-400 hover:text-white">Voice 444</button>
          </div>

          <!-- Right: Actions & Dismiss -->
          <div class="flex items-center gap-2 shrink-0">
            <button onclick="MiniAppsPage.reloadCurrentApp()" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors" title="Reload Simulator">
              <i data-lucide="refresh-cw" class="w-4 h-4"></i>
            </button>
            <a id="modal-open-tab-btn" href="#" target="_blank" class="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors flex items-center" title="Open in New Tab">
              <i data-lucide="external-link" class="w-4 h-4"></i>
            </a>
            <button onclick="MiniAppsPage.closeModal()" class="p-2 text-slate-400 hover:text-white hover:bg-red-500/20 hover:text-red-400 rounded-lg transition-colors" title="Close (Esc)">
              <i data-lucide="x" class="w-5 h-5"></i>
            </button>
          </div>
        </div>

        <!-- Fixed Center Stage Viewport (Never Scrolls, Background Fixed) -->
        <div id="simulator-viewport" class="flex-1 w-full h-[calc(100vh-52px)] overflow-hidden bg-[#060c18] relative flex items-center justify-center p-2.5">
          
          <!-- Dynamic Device Shell -->
          <div id="simulator-frame-shell" class="relative flex flex-col items-center transition-all duration-200">
            <!-- Dynamic Island / Speaker Notch for Mobile Apps -->
            <div id="simulator-notch" class="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-3.5 bg-black rounded-full z-30 pointer-events-none flex items-center justify-end pr-2 shadow-sm hidden">
              <span class="w-1.5 h-1.5 rounded-full bg-slate-950 border border-slate-700/60"></span>
            </div>

            <!-- Home indicator bar for Mobile Apps -->
            <div id="simulator-homebar" class="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-400/40 rounded-full z-30 pointer-events-none hidden"></div>

            <!-- Embedded Interactive IFrame -->
            <iframe id="mini-app-iframe" src="" class="w-full h-full border-0" allow="geolocation; microphone; camera"></iframe>
          </div>

        </div>

      </div>
    `;

    // Keyboard listener for Escape
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeModal();
    });

    if (window.lucide) window.lucide.createIcons();
  },

  renderCard(appId) {
    const app = this.apps[appId];
    return `
      <div class="glass-card p-5 rounded-xl border border-border flex flex-col justify-between hover:border-brand-blue/50 transition-all group">
        <div>
          <!-- Icon & Protocol Tag -->
          <div class="flex items-center justify-between mb-4">
            <div class="w-11 h-11 rounded-xl ${app.iconBg} flex items-center justify-center shadow-inner">
              <i data-lucide="${app.icon}" class="w-5 h-5"></i>
            </div>
            <span class="px-2.5 py-0.5 text-[10px] font-semibold rounded-full border ${app.tagColor}">
              ${app.tag}
            </span>
          </div>

          <!-- Title & Subtitle -->
          <h3 class="font-bold text-white text-base tracking-tight">${app.title}</h3>
          <p class="text-xs text-slate-400 mt-1">${app.subtitle}</p>
        </div>

        <!-- Clean Action Buttons -->
        <div class="mt-6 pt-4 border-t border-border/60 flex flex-col gap-2">
          <button onclick="MiniAppsPage.openApp('${app.id}')" class="w-full py-2.5 bg-brand-blue hover:bg-brand-blueDark text-white rounded-lg text-xs font-semibold transition-all flex items-center justify-center gap-2 shadow-md shadow-brand-blue/20">
            <i data-lucide="play" class="w-3.5 h-3.5 fill-current"></i> Launch Simulator
          </button>
          <a href="${app.url}" target="_blank" class="w-full py-1.5 bg-slate-900/60 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg text-[11px] font-medium transition-colors flex items-center justify-center gap-1.5 border border-border/60">
            <i data-lucide="external-link" class="w-3 h-3"></i> Open in New Tab
          </a>
        </div>
      </div>
    `;
  },

  openApp(appId) {
    const app = this.apps[appId];
    if (!app) return;

    this.currentApp = appId;

    const modal = document.getElementById('mini-app-modal');
    const icon = document.getElementById('modal-app-icon');
    const title = document.getElementById('modal-app-title');
    const tag = document.getElementById('modal-app-tag');
    const iframe = document.getElementById('mini-app-iframe');
    const tabLink = document.getElementById('modal-open-tab-btn');
    const shell = document.getElementById('simulator-frame-shell');
    const notch = document.getElementById('simulator-notch');
    const homebar = document.getElementById('simulator-homebar');

    if (!modal) return;

    // Update active tab buttons
    ['telegram', 'mpesa', 'ussd', 'voice'].forEach(id => {
      const tabBtn = document.getElementById(`modal-tab-${id}`);
      if (tabBtn) {
        if (id === appId) {
          tabBtn.className = 'px-3 py-1 text-xs rounded font-semibold bg-brand-blue text-white shadow-sm';
        } else {
          tabBtn.className = 'px-3 py-1 text-xs rounded transition-colors text-slate-400 hover:text-white';
        }
      }
    });

    // Populate header details
    icon.className = `w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${app.iconBg}`;
    icon.innerHTML = `<i data-lucide="${app.icon}" class="w-4 h-4"></i>`;
    title.textContent = app.title;
    tag.textContent = app.tag;
    tag.className = `px-2 py-0.5 text-[10px] font-semibold rounded-full border shrink-0 hidden sm:inline-block ${app.tagColor}`;

    // Configure device viewport based on whether it is a mobile mini-app or wide emulator
    if (app.isMobile) {
      // Fits VERTICALLY to screen height with authentic phone aspect ratio (9:19.5).
      // Background is fixed outside, only content inside the phone screen scrolls.
      shell.className = 'h-[calc(100vh-74px)] max-h-[880px] w-auto aspect-[9/19.5] max-w-[420px] rounded-[46px] p-2 bg-[#1b2537] border-[6px] border-[#334155] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] relative flex flex-col items-center shrink-0 transition-all duration-200';
      iframe.className = 'w-full h-full border-0 rounded-[38px] bg-[#f8faf8] overflow-hidden';
      if (notch) notch.classList.remove('hidden');
      if (homebar) homebar.classList.remove('hidden');
    } else {
      // Wide desktop console for USSD keypad & Voice hotline emulators
      shell.className = 'w-full h-full max-w-6xl rounded-xl border border-border/50 shadow-2xl overflow-hidden bg-[#080f1e] flex flex-col transition-all duration-200';
      iframe.className = 'w-full h-full border-0 rounded-none bg-[#080f1e] overflow-auto';
      if (notch) notch.classList.add('hidden');
      if (homebar) homebar.classList.add('hidden');
    }

    // Set iframe source
    iframe.src = app.url;
    tabLink.href = app.url;

    // Show full screen modal & lock document body scroll
    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';

    if (window.lucide) window.lucide.createIcons();
  },

  reloadCurrentApp() {
    const iframe = document.getElementById('mini-app-iframe');
    if (iframe && this.currentApp && this.apps[this.currentApp]) {
      iframe.src = this.apps[this.currentApp].url;
    }
  },

  closeModal() {
    const modal = document.getElementById('mini-app-modal');
    const iframe = document.getElementById('mini-app-iframe');
    if (modal) {
      modal.classList.add('hidden');
      document.body.style.overflow = '';
      if (iframe) iframe.src = '';
    }
    this.currentApp = null;
  }
};
