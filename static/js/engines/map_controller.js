/**
 * NEGARIT ET - LEAFLET MAP CONTROLLER
 * Integrates spatial GIS layers, Ethiopian city markers,
 * USGS seismic epicenter indicators, and multi-hazard risk zones.
 */

window.MapController = {
  map: null,
  earthquakeLayerGroup: null,
  riskZoneLayerGroup: null,
  cityMarkers: [],
  selectedMarker: null,
  onSelectCallback: null,

  init(containerId, onSelectCallback) {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    const cfg = window.WeatherAPI.CONFIG.MAP;
    this.onSelectCallback = onSelectCallback;

    const mapElement = document.getElementById(containerId);
    if (!mapElement) return;

    this.map = L.map(containerId, {
      zoomControl: true,
      minZoom: 5,
      maxZoom: 13
    }).setView([cfg.INITIAL_LAT, cfg.INITIAL_LON], cfg.INITIAL_ZOOM);

    L.tileLayer(cfg.TILE_LAYER, {
      attribution: cfg.ATTRIBUTION,
      maxZoom: 19
    }).addTo(this.map);

    this.earthquakeLayerGroup = L.layerGroup().addTo(this.map);
    this.riskZoneLayerGroup = L.layerGroup().addTo(this.map);

    this.renderRiskZones();
    this.renderCityMarkers(window.WeatherAPI.CONFIG.CITIES);

    this.map.on('click', (e) => {
      this.handleCustomMapClick(e.latlng.lat, e.latlng.lng);
    });

    // Invalidate size after layout stabilization
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 300);
  },

  renderRiskZones() {
    this.riskZoneLayerGroup.clearLayers();

    // Critical Hazard Zones in Ethiopia
    const zones = [
      { name: "Tigray Fault Zone", lat: 13.50, lon: 39.47, radius: 85000, color: "#e73b45", fill: "#e73b45", type: "Seismic & Drought Alert" },
      { name: "Afar Aridity Depression", lat: 11.79, lon: 41.01, radius: 95000, color: "#e59a15", fill: "#e59a15", type: "Severe Aridity Zone" },
      { name: "Gofa Highlands Slope Watch", lat: 6.30, lon: 36.88, radius: 75000, color: "#e73b45", fill: "#e73b45", type: "Landslide Risk Zone" },
      { name: "Awash Basin Inundation Corridor", lat: 8.98, lon: 40.15, radius: 80000, color: "#2563eb", fill: "#2563eb", type: "Flash Flood Watch" }
    ];

    zones.forEach(z => {
      const circle = L.circle([z.lat, z.lon], {
        color: z.color,
        fillColor: z.fill,
        fillOpacity: 0.15,
        weight: 1.5,
        dashArray: '4, 6',
        radius: z.radius
      });

      circle.bindTooltip(`<b>${z.name}</b><br><span style="font-size:11px; color:#cbd5e1">${z.type}</span>`, {
        direction: 'top',
        className: 'glass-tooltip'
      });

      this.riskZoneLayerGroup.addLayer(circle);
    });
  },

  renderCityMarkers(cities) {
    this.cityMarkers.forEach(m => this.map.removeLayer(m));
    this.cityMarkers = [];

    cities.forEach(city => {
      const iconHtml = `
        <div class="relative flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 border-2 border-brand-blue shadow-lg hover:scale-125 transition-transform cursor-pointer">
          <div class="w-2 h-2 rounded-full bg-brand-blue animate-pulse"></div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'city-pin-icon',
        iconSize: [24, 24],
        iconAnchor: [12, 12]
      });

      const marker = L.marker([city.lat, city.lon], { icon: customIcon }).addTo(this.map);

      marker.bindTooltip(`
        <div class="p-1 font-sans">
          <div class="font-bold text-white text-xs">${city.name}</div>
          <div class="text-[10px] text-slate-300">${city.region} &bull; ${city.elevation}</div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -10]
      });

      marker.on('click', (e) => {
        L.DomEvent.stopPropagation(e);
        this.focusCity(city);
        if (this.onSelectCallback) this.onSelectCallback(city);
      });

      this.cityMarkers.push(marker);
    });
  },

  renderEarthquakeMarkers(seismicData) {
    if (!this.earthquakeLayerGroup) return;
    this.earthquakeLayerGroup.clearLayers();

    if (!seismicData || !seismicData.features || !seismicData.features.length) return;

    seismicData.features.forEach(f => {
      const coords = f.geometry.coordinates; // [lon, lat, depth]
      const lon = coords[0];
      const lat = coords[1];
      const mag = f.properties.mag ? f.properties.mag.toFixed(1) : "?.?";
      const title = f.properties.title || "Tectonic Event";
      const timeStr = new Date(f.properties.time).toLocaleString('en-US', { timeZone: 'Africa/Addis_Ababa' });

      const eqIconHtml = `
        <div class="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600/30 border border-purple-400 animate-ping absolute"></div>
        <div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 border border-white text-white font-bold text-[10px] shadow-lg">
          ${mag}
        </div>
      `;

      const eqIcon = L.divIcon({
        html: eqIconHtml,
        className: 'earthquake-pin-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([lat, lon], { icon: eqIcon }).addTo(this.earthquakeLayerGroup);

      marker.bindPopup(`
        <div class="p-2 font-sans min-w-[200px]">
          <div class="flex items-center justify-between gap-2 mb-1">
            <span class="px-1.5 py-0.5 rounded text-[10px] font-bold bg-purple-600/30 text-purple-300 border border-purple-500">M${mag} Earthquake</span>
            <span class="text-[10px] text-slate-400">${coords[2]} km depth</span>
          </div>
          <div class="font-semibold text-xs text-white mb-1">${title}</div>
          <div class="text-[10px] text-slate-400">EAT: ${timeStr}</div>
        </div>
      `);
    });
  },

  handleCustomMapClick(lat, lon) {
    if (this.selectedMarker) {
      this.map.removeLayer(this.selectedMarker);
    }

    const clickIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-6 h-6 rounded-full bg-emerald-500 border-2 border-white shadow-xl">
          <div class="w-1.5 h-1.5 rounded-full bg-white"></div>
        </div>
      `,
      className: 'custom-pin-icon',
      iconSize: [24, 24],
      iconAnchor: [12, 12]
    });

    this.selectedMarker = L.marker([lat, lon], { icon: clickIcon }).addTo(this.map);

    const customCity = {
      id: 'custom',
      name: `Coordinates (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
      region: 'Custom Map Pin',
      lat: parseFloat(lat.toFixed(4)),
      lon: parseFloat(lon.toFixed(4)),
      elevation: '~ Regional Elevation'
    };

    if (this.onSelectCallback) this.onSelectCallback(customCity);
  },

  focusCity(city) {
    if (!this.map) return;
    this.map.flyTo([city.lat, city.lon], 9, { duration: 1.2 });
  },

  recenter() {
    if (!this.map) return;
    const cfg = window.WeatherAPI.CONFIG.MAP;
    this.map.flyTo([cfg.INITIAL_LAT, cfg.INITIAL_LON], cfg.INITIAL_ZOOM, { duration: 1.0 });
  },

  invalidateSize() {
    if (this.map) this.map.invalidateSize();
  }
};

