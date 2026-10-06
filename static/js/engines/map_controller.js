/**
 * NEGARIT ET - PAN-AFRICAN LEAFLET MAP CONTROLLER
 * Integrates spatial GIS layers, multi-country African city markers,
 * USGS seismic epicenter feeds, and country-specific multi-hazard risk zones.
 */

window.MapController = {
  map: null,
  earthquakeLayerGroup: null,
  riskZoneLayerGroup: null,
  cityMarkers: [],
  selectedMarker: null,
  onSelectCallback: null,
  currentCountryCode: 'ethiopia',

  init(containerId, onSelectCallback) {
    if (this.map) {
      this.map.remove();
      this.map = null;
    }

    const activeCountry = window.WeatherAPI.getActiveCountry();
    this.currentCountryCode = activeCountry.code;
    this.onSelectCallback = onSelectCallback;

    const mapElement = document.getElementById(containerId);
    if (!mapElement) return;

    const cfg = window.WeatherAPI.CONFIG.MAP;

    this.map = L.map(containerId, {
      zoomControl: true,
      minZoom: 4,
      maxZoom: 14
    }).setView(activeCountry.center, activeCountry.zoom);

    L.tileLayer(cfg.TILE_LAYER, {
      attribution: cfg.ATTRIBUTION,
      maxZoom: 19
    }).addTo(this.map);

    this.earthquakeLayerGroup = L.layerGroup().addTo(this.map);
    this.riskZoneLayerGroup = L.layerGroup().addTo(this.map);

    this.renderRiskZones(this.currentCountryCode);
    this.renderCityMarkers(activeCountry.cities);

    this.map.on('click', (e) => {
      this.handleCustomMapClick(e.latlng.lat, e.latlng.lng);
    });

    // Invalidate size after layout stabilization
    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 300);
  },

  switchCountry(countryCode) {
    const country = window.WeatherAPI.COUNTRIES[countryCode] || window.WeatherAPI.COUNTRIES.ethiopia;
    this.currentCountryCode = country.code;

    if (!this.map) return;

    if (this.selectedMarker) {
      this.map.removeLayer(this.selectedMarker);
      this.selectedMarker = null;
    }

    // Smoothly fly to the country's center and zoom
    this.map.flyTo(country.center, country.zoom, { duration: 1.2 });

    // Update risk zones and city markers
    this.renderRiskZones(country.code);
    this.renderCityMarkers(country.cities);

    setTimeout(() => {
      if (this.map) this.map.invalidateSize();
    }, 300);
  },

  renderRiskZones(countryCode) {
    if (!this.riskZoneLayerGroup) return;
    this.riskZoneLayerGroup.clearLayers();

    const zones = window.WeatherAPI.getHazardZones(countryCode);
    if (!zones || !zones.length) return;

    zones.forEach(z => {
      const circle = L.circle([z.lat, z.lon], {
        color: z.color,
        fillColor: z.fill,
        fillOpacity: 0.18,
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

  renderCityMarkers(citiesList) {
    if (!this.map) return;
    this.cityMarkers.forEach(m => this.map.removeLayer(m));
    this.cityMarkers = [];

    const cities = citiesList || window.WeatherAPI.getCities(this.currentCountryCode);
    const country = window.WeatherAPI.COUNTRIES[this.currentCountryCode] || window.WeatherAPI.COUNTRIES.ethiopia;
    const isRedTheme = country.theme === 'red';
    const pinColorClass = isRedTheme ? 'border-red-500' : 'border-[#2CB34A]';
    const dotColorClass = isRedTheme ? 'bg-red-500' : 'bg-[#2CB34A]';

    cities.forEach(city => {
      const iconHtml = `
        <div class="relative flex items-center justify-center w-6 h-6 rounded-full bg-slate-900 border-2 ${pinColorClass} shadow-lg hover:scale-125 transition-transform cursor-pointer">
          <div class="w-2 h-2 rounded-full ${dotColorClass} animate-pulse"></div>
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
      const timeStr = new Date(f.properties.time).toLocaleString('en-US');

      const eqIconHtml = `
        <div class="flex items-center justify-center w-7 h-7 rounded-full bg-purple-600/30 border border-purple-400 animate-ping absolute"></div>
        <div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-purple-600 border border-white text-white font-bold text-[10px] shadow-lg">
          ${mag}
        </div>
      `;

      const eqIcon = L.divIcon({
        html: eqIconHtml,
        className: 'eq-pin-icon',
        iconSize: [28, 28],
        iconAnchor: [14, 14]
      });

      const marker = L.marker([lat, lon], { icon: eqIcon });

      marker.bindTooltip(`
        <div class="p-1.5 font-sans">
          <div class="font-bold text-purple-400 text-xs">Magnitude ${mag} Earthquake</div>
          <div class="text-[10px] text-slate-200">${title}</div>
          <div class="text-[9px] text-slate-400 mt-0.5">${timeStr} &bull; Depth: ${coords[2]}km</div>
        </div>
      `, {
        direction: 'top',
        offset: [0, -12]
      });

      this.earthquakeLayerGroup.addLayer(marker);
    });
  },

  handleCustomMapClick(lat, lon) {
    if (!this.map) return;

    if (this.selectedMarker) {
      this.map.removeLayer(this.selectedMarker);
    }

    const country = window.WeatherAPI.COUNTRIES[this.currentCountryCode] || window.WeatherAPI.COUNTRIES.ethiopia;
    const isRedTheme = country.theme === 'red';
    const clickBorder = isRedTheme ? 'border-red-400' : 'border-[#2CB34A]';
    const clickBg = isRedTheme ? 'bg-red-500' : 'bg-[#2CB34A]';

    const clickIcon = L.divIcon({
      html: `
        <div class="relative flex items-center justify-center w-7 h-7 rounded-full bg-slate-900 border-2 ${clickBorder} shadow-2xl animate-bounce">
          <div class="w-3 h-3 rounded-full ${clickBg}"></div>
        </div>
      `,
      className: 'custom-pin-icon',
      iconSize: [28, 28],
      iconAnchor: [14, 14]
    });

    this.selectedMarker = L.marker([lat, lon], { icon: clickIcon }).addTo(this.map);

    const customCity = {
      id: 'custom',
      name: `Pin (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
      region: `${country.name} GIS Telemetry`,
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
    const country = window.WeatherAPI.COUNTRIES[this.currentCountryCode] || window.WeatherAPI.COUNTRIES.ethiopia;
    this.map.flyTo(country.center, country.zoom, { duration: 1.0 });
  },

  invalidateSize() {
    if (this.map) this.map.invalidateSize();
  }
};
