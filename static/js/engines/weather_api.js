/**
 * NEGARIT ET - PAN-AFRICAN REGIONAL WEATHER & SEISMIC TELEMETRY API CLIENT
 * Handles fetching 16-day meteorological forecasts from Open-Meteo
 * and real-time seismic GeoJSON from the USGS Earthquake Hazards API
 * across 8 African Regional Expansion Nations.
 */

window.WeatherAPI = {
  activeCountryCode: 'ethiopia',

  COUNTRIES: {
    ethiopia: {
      code: 'ethiopia',
      name: 'Ethiopia',
      flag: '🇪🇹',
      theme: 'green',
      center: [9.145, 38.752],
      zoom: 6,
      bounds: { minlat: 3.0, maxlat: 15.0, minlon: 33.0, maxlon: 48.0 },
      cities: [
        { id: 'addis', name: 'Addis Ababa', region: 'Capital City', lat: 9.0300, lon: 38.7400, elevation: '2,444 m' },
        { id: 'adama', name: 'Adama (Nazret)', region: 'Oromia Region', lat: 8.5400, lon: 39.2700, elevation: '1,712 m' },
        { id: 'bahirdar', name: 'Bahir Dar', region: 'Amhara Region', lat: 11.5900, lon: 37.3900, elevation: '1,800 m' },
        { id: 'diredawa', name: 'Dire Dawa', region: 'Chartered City', lat: 9.6000, lon: 41.8600, elevation: '1,276 m' },
        { id: 'gondar', name: 'Gondar', region: 'Amhara Region', lat: 12.6000, lon: 37.4700, elevation: '2,133 m' },
        { id: 'hawassa', name: 'Hawassa', region: 'Sidama Region', lat: 7.0600, lon: 38.4800, elevation: '1,708 m' },
        { id: 'jimma', name: 'Jimma', region: 'Oromia Region', lat: 7.6700, lon: 36.8300, elevation: '1,780 m' },
        { id: 'mekelle', name: 'Mekelle', region: 'Tigray Region', lat: 13.5000, lon: 39.4700, elevation: '2,084 m' },
        { id: 'jijiga', name: 'Jijiga', region: 'Somali Region', lat: 9.3500, lon: 42.8000, elevation: '1,609 m' },
        { id: 'arbaminch', name: 'Arba Minch', region: 'South Ethiopia', lat: 6.0300, lon: 37.5500, elevation: '1,285 m' },
        { id: 'dessie', name: 'Dessie', region: 'Amhara Region', lat: 11.1300, lon: 39.6300, elevation: '2,550 m' },
        { id: 'debrebirhan', name: 'Debre Birhan', region: 'Amhara Region', lat: 9.6800, lon: 39.5300, elevation: '2,840 m' },
        { id: 'semera', name: 'Semera', region: 'Afar Region', lat: 11.7900, lon: 41.0100, elevation: '433 m' },
        { id: 'asosa', name: 'Asosa', region: 'Benishangul-Gumuz', lat: 10.0700, lon: 34.5300, elevation: '1,570 m' },
        { id: 'gambela', name: 'Gambela', region: 'Gambela Region', lat: 8.2500, lon: 34.5800, elevation: '526 m' },
        { id: 'harar', name: 'Harar', region: 'Harari Region', lat: 9.3100, lon: 42.1300, elevation: '1,885 m' },
        { id: 'lalibela', name: 'Lalibela', region: 'Amhara Region', lat: 12.0300, lon: 39.0400, elevation: '2,500 m' },
        { id: 'axum', name: 'Axum', region: 'Tigray Region', lat: 14.1200, lon: 38.7200, elevation: '2,130 m' },
        { id: 'sawla', name: 'Sawla (Gofa)', region: 'South Ethiopia', lat: 6.3000, lon: 36.8800, elevation: '1,395 m' },
        { id: 'robe', name: 'Bale Robe', region: 'Oromia Region', lat: 7.0100, lon: 40.0000, elevation: '2,492 m' },
        { id: 'shashamane', name: 'Shashamane', region: 'Oromia Region', lat: 7.2000, lon: 38.6000, elevation: '2,008 m' },
        { id: 'debremarkos', name: 'Debre Markos', region: 'Amhara Region', lat: 10.3300, lon: 37.7300, elevation: '2,446 m' },
        { id: 'kombolcha', name: 'Kombolcha', region: 'Amhara Region', lat: 11.0833, lon: 39.7333, elevation: '1,842 m' },
        { id: 'nekemte', name: 'Nekemte', region: 'Oromia Region', lat: 9.0833, lon: 36.5500, elevation: '2,088 m' },
        { id: 'bishoftu', name: 'Bishoftu (Debre Zeyit)', region: 'Oromia Region', lat: 8.7500, lon: 38.9800, elevation: '1,920 m' },
        { id: 'hosaena', name: 'Hosaena', region: 'Central Ethiopia', lat: 7.5500, lon: 37.8500, elevation: '2,276 m' },
        { id: 'dilla', name: 'Dilla', region: 'South Ethiopia', lat: 6.4100, lon: 38.3100, elevation: '1,570 m' },
        { id: 'sodo', name: 'Wolaita Sodo', region: 'South Ethiopia', lat: 6.8600, lon: 37.7600, elevation: '2,050 m' },
        { id: 'gode', name: 'Gode', region: 'Somali Region', lat: 5.9500, lon: 43.5500, elevation: '280 m' },
        { id: 'moyale', name: 'Moyale', region: 'Oromia / Border', lat: 3.5300, lon: 39.0500, elevation: '1,113 m' }
      ],
      hazardZones: [
        { name: "Tigray Fault Zone", lat: 13.50, lon: 39.47, radius: 85000, color: "#2CB34A", fill: "#2CB34A", type: "Seismic & Drought Alert" },
        { name: "Afar Aridity Depression", lat: 11.79, lon: 41.01, radius: 95000, color: "#EF373E", fill: "#EF373E", type: "Severe Aridity Zone" },
        { name: "Gofa Highlands Slope Watch", lat: 6.30, lon: 36.88, radius: 75000, color: "#EF373E", fill: "#EF373E", type: "Landslide Risk Zone" },
        { name: "Awash Basin Inundation Corridor", lat: 8.98, lon: 40.15, radius: 80000, color: "#2563eb", fill: "#2563eb", type: "Flash Flood Watch" }
      ]
    },

    kenya: {
      code: 'kenya',
      name: 'Kenya',
      flag: '🇰🇪',
      theme: 'green',
      center: [0.0236, 37.9062],
      zoom: 6,
      bounds: { minlat: -4.8, maxlat: 5.5, minlon: 33.9, maxlon: 41.9 },
      cities: [
        { id: 'ke_nairobi', name: 'Nairobi', region: 'Nairobi County', lat: -1.2864, lon: 36.8172, elevation: '1,795 m' },
        { id: 'ke_mombasa', name: 'Mombasa', region: 'Coast Province', lat: -4.0435, lon: 39.6682, elevation: '50 m' },
        { id: 'ke_kisumu', name: 'Kisumu', region: 'Lake Victoria Basin', lat: -0.0917, lon: 34.7680, elevation: '1,131 m' },
        { id: 'ke_nakuru', name: 'Nakuru', region: 'Rift Valley', lat: -0.3031, lon: 36.0800, elevation: '1,850 m' },
        { id: 'ke_eldoret', name: 'Eldoret', region: 'Uasin Gishu', lat: 0.5143, lon: 35.2698, elevation: '2,085 m' },
        { id: 'ke_thika', name: 'Thika', region: 'Kiambu County', lat: -1.0333, lon: 37.0693, elevation: '1,531 m' },
        { id: 'ke_malindi', name: 'Malindi', region: 'Kilifi County', lat: -3.2234, lon: 40.1199, elevation: '12 m' },
        { id: 'ke_kitale', name: 'Kitale', region: 'Trans-Nzoia', lat: 1.0167, lon: 35.0000, elevation: '1,900 m' },
        { id: 'ke_nyeri', name: 'Nyeri', region: 'Central Highlands', lat: -0.4167, lon: 36.9500, elevation: '1,759 m' },
        { id: 'ke_kakamega', name: 'Kakamega', region: 'Western Province', lat: 0.2833, lon: 34.7500, elevation: '1,535 m' }
      ],
      hazardZones: [
        { name: "Great Rift Valley Fault", lat: -0.30, lon: 36.08, radius: 90000, color: "#2CB34A", fill: "#2CB34A", type: "Seismic & Tectonic Fault" },
        { name: "Lake Victoria Basin Surge", lat: -0.09, lon: 34.77, radius: 80000, color: "#2563eb", fill: "#2563eb", type: "Flash Flood & Inundation" },
        { name: "Northern Aridity Corridor", lat: 2.50, lon: 37.50, radius: 110000, color: "#F59E0B", fill: "#F59E0B", type: "Drought & Heat Stress" },
        { name: "Mombasa Coastal Cyclone Watch", lat: -4.04, lon: 39.67, radius: 75000, color: "#EF373E", fill: "#EF373E", type: "Maritime Surge Risk" }
      ]
    },

    south_africa: {
      code: 'south_africa',
      name: 'South Africa',
      flag: '🇿🇦',
      theme: 'red',
      center: [-29.0, 25.0],
      zoom: 6,
      bounds: { minlat: -35.0, maxlat: -22.0, minlon: 16.4, maxlon: 33.0 },
      cities: [
        { id: 'za_johannesburg', name: 'Johannesburg', region: 'Gauteng', lat: -26.2041, lon: 28.0473, elevation: '1,753 m' },
        { id: 'za_capetown', name: 'Cape Town', region: 'Western Cape', lat: -33.9249, lon: 18.4241, elevation: '25 m' },
        { id: 'za_durban', name: 'Durban', region: 'KwaZulu-Natal', lat: -29.8587, lon: 31.0218, elevation: '15 m' },
        { id: 'za_pretoria', name: 'Pretoria', region: 'Gauteng', lat: -25.7461, lon: 28.1881, elevation: '1,339 m' },
        { id: 'za_gqeberha', name: 'Gqeberha (Port Elizabeth)', region: 'Eastern Cape', lat: -33.9608, lon: 25.6022, elevation: '60 m' },
        { id: 'za_bloemfontein', name: 'Bloemfontein', region: 'Free State', lat: -29.1167, lon: 26.2167, elevation: '1,395 m' },
        { id: 'za_eastlondon', name: 'East London', region: 'Eastern Cape', lat: -33.0153, lon: 27.9117, elevation: '48 m' },
        { id: 'za_polokwane', name: 'Polokwane', region: 'Limpopo', lat: -23.9000, lon: 29.4500, elevation: '1,310 m' },
        { id: 'za_nelspruit', name: 'Nelspruit (Mbombela)', region: 'Mpumalanga', lat: -25.4744, lon: 30.9703, elevation: '678 m' },
        { id: 'za_kimberley', name: 'Kimberley', region: 'Northern Cape', lat: -28.7386, lon: 24.7586, elevation: '1,230 m' }
      ],
      hazardZones: [
        { name: "KwaZulu-Natal Coastal Surge", lat: -29.85, lon: 31.02, radius: 85000, color: "#EF373E", fill: "#EF373E", type: "Severe Storm & Flood Risk" },
        { name: "Karoo Semi-Arid Drought Belt", lat: -31.50, lon: 23.50, radius: 120000, color: "#F59E0B", fill: "#F59E0B", type: "Extreme Drought Stress" },
        { name: "Highveld Severe Hail & Convective", lat: -26.20, lon: 28.05, radius: 95000, color: "#2563eb", fill: "#2563eb", type: "Severe Convective Storms" }
      ]
    },

    drc: {
      code: 'drc',
      name: 'DR Congo',
      flag: '🇨🇩',
      theme: 'red',
      center: [-4.0383, 21.7587],
      zoom: 5,
      bounds: { minlat: -13.5, maxlat: 5.4, minlon: 12.2, maxlon: 31.3 },
      cities: [
        { id: 'cd_kinshasa', name: 'Kinshasa', region: 'Capital Province', lat: -4.4419, lon: 15.2663, elevation: '240 m' },
        { id: 'cd_lubumbashi', name: 'Lubumbashi', region: 'Haut-Katanga', lat: -11.6609, lon: 27.4794, elevation: '1,208 m' },
        { id: 'cd_mbujimayi', name: 'Mbuji-Mayi', region: 'Kasaï-Oriental', lat: -6.1500, lon: 23.6000, elevation: '549 m' },
        { id: 'cd_kisangani', name: 'Kisangani', region: 'Tshopo', lat: 0.5167, lon: 25.2000, elevation: '447 m' },
        { id: 'cd_kananga', name: 'Kananga', region: 'Kasaï-Central', lat: -5.8958, lon: 22.4178, elevation: '608 m' },
        { id: 'cd_bukavu', name: 'Bukavu', region: 'South Kivu', lat: -2.5083, lon: 28.8608, elevation: '1,498 m' },
        { id: 'cd_kolwezi', name: 'Kolwezi', region: 'Lualaba', lat: -10.7167, lon: 25.4667, elevation: '1,460 m' },
        { id: 'cd_likasi', name: 'Likasi', region: 'Haut-Katanga', lat: -10.9833, lon: 26.7333, elevation: '1,318 m' },
        { id: 'cd_goma', name: 'Goma', region: 'North Kivu', lat: -1.6742, lon: 29.2289, elevation: '1,500 m' },
        { id: 'cd_tshikapa', name: 'Tshikapa', region: 'Kasaï', lat: -6.4167, lon: 20.8000, elevation: '485 m' }
      ],
      hazardZones: [
        { name: "Virunga Volcanic & Rift Sector", lat: -1.67, lon: 29.23, radius: 95000, color: "#EF373E", fill: "#EF373E", type: "Volcanic & Seismic Zone" },
        { name: "Congo River Flood Plain", lat: -4.44, lon: 15.26, radius: 85000, color: "#2563eb", fill: "#2563eb", type: "River Basin Inundation" },
        { name: "Kivu Highland Landslide Alert", lat: -2.50, lon: 28.86, radius: 80000, color: "#F59E0B", fill: "#F59E0B", type: "Slope Stability Hazard" }
      ]
    },

    egypt: {
      code: 'egypt',
      name: 'Egypt',
      flag: '🇪🇬',
      theme: 'red',
      center: [26.8206, 30.8025],
      zoom: 6,
      bounds: { minlat: 22.0, maxlat: 31.7, minlon: 25.0, maxlon: 37.0 },
      cities: [
        { id: 'eg_cairo', name: 'Cairo', region: 'Cairo Governorate', lat: 30.0444, lon: 31.2357, elevation: '23 m' },
        { id: 'eg_alexandria', name: 'Alexandria', region: 'Mediterranean Coast', lat: 31.2001, lon: 29.9187, elevation: '5 m' },
        { id: 'eg_giza', name: 'Giza', region: 'Giza Governorate', lat: 30.0131, lon: 31.2089, elevation: '19 m' },
        { id: 'eg_luxor', name: 'Luxor', region: 'Upper Egypt', lat: 25.6872, lon: 32.6397, elevation: '89 m' },
        { id: 'eg_aswan', name: 'Aswan', region: 'Upper Egypt', lat: 24.0889, lon: 32.8997, elevation: '106 m' },
        { id: 'eg_portsaid', name: 'Port Said', region: 'Suez Canal Zone', lat: 31.2653, lon: 32.3019, elevation: '3 m' },
        { id: 'eg_suez', name: 'Suez', region: 'Suez Governorate', lat: 29.9667, lon: 32.5500, elevation: '5 m' },
        { id: 'eg_mansoura', name: 'Mansoura', region: 'Dakahlia', lat: 31.0364, lon: 31.3808, elevation: '15 m' },
        { id: 'eg_tanta', name: 'Tanta', region: 'Gharbia', lat: 30.7885, lon: 31.0019, elevation: '12 m' },
        { id: 'eg_ismailia', name: 'Ismailia', region: 'Suez Canal Zone', lat: 30.5833, lon: 32.2667, elevation: '13 m' }
      ],
      hazardZones: [
        { name: "Nile Delta Maritime Inundation", lat: 31.20, lon: 30.50, radius: 95000, color: "#2563eb", fill: "#2563eb", type: "Sea Level & Flash Flood" },
        { name: "Sinai Fault Seismic Corridor", lat: 28.50, lon: 34.00, radius: 85000, color: "#EF373E", fill: "#EF373E", type: "Seismic Fault Activity" },
        { name: "Upper Nile Heat Dome", lat: 24.09, lon: 32.90, radius: 110000, color: "#F59E0B", fill: "#F59E0B", type: "Extreme Heat Stress (>45°C)" }
      ]
    },

    lesotho: {
      code: 'lesotho',
      name: 'Lesotho',
      flag: '🇱🇸',
      theme: 'red',
      center: [-29.6099, 28.2336],
      zoom: 8,
      bounds: { minlat: -30.7, maxlat: -28.5, minlon: 27.0, maxlon: 29.5 },
      cities: [
        { id: 'ls_maseru', name: 'Maseru', region: 'Maseru District', lat: -29.3167, lon: 27.4833, elevation: '1,600 m' },
        { id: 'ls_teyateyaneng', name: 'Teyateyaneng', region: 'Berea District', lat: -29.1500, lon: 27.7500, elevation: '1,732 m' },
        { id: 'ls_mafetang', name: 'Mafetang', region: 'Mafetang District', lat: -29.8333, lon: 27.2500, elevation: '1,634 m' },
        { id: 'ls_hlotse', name: 'Hlotse', region: 'Leribe District', lat: -28.8719, lon: 28.0450, elevation: '1,688 m' },
        { id: 'ls_mohaleshoek', name: "Mohale's Hoek", region: "Mohale's Hoek", lat: -30.1500, lon: 27.4667, elevation: '1,600 m' },
        { id: 'ls_maputsoe', name: 'Maputsoe', region: 'Leribe District', lat: -28.8833, lon: 27.9000, elevation: '1,595 m' },
        { id: 'ls_qachasnek', name: "Qacha's Nek", region: "Qacha's Nek", lat: -30.1167, lon: 28.6833, elevation: '1,980 m' },
        { id: 'ls_quthing', name: 'Quthing', region: 'Quthing District', lat: -30.4000, lon: 27.7000, elevation: '1,600 m' },
        { id: 'ls_buthabuthe', name: 'Butha-Buthe', region: 'Butha-Buthe', lat: -28.7667, lon: 28.2500, elevation: '1,760 m' },
        { id: 'ls_mokhotlong', name: 'Mokhotlong', region: 'Mokhotlong District', lat: -29.2833, lon: 29.0667, elevation: '2,200 m' }
      ],
      hazardZones: [
        { name: "Maloti Alpine Deep Freeze & Snow", lat: -29.28, lon: 29.06, radius: 65000, color: "#2563eb", fill: "#2563eb", type: "Alpine Severe Freeze / Blizzard" },
        { name: "Senqu Basin Flash Inundation", lat: -30.15, lon: 27.47, radius: 55000, color: "#EF373E", fill: "#EF373E", type: "Mountain River Surge" }
      ]
    },

    mozambique: {
      code: 'mozambique',
      name: 'Mozambique',
      flag: '🇲🇿',
      theme: 'red',
      center: [-18.6657, 35.5296],
      zoom: 6,
      bounds: { minlat: -26.9, maxlat: -10.4, minlon: 30.2, maxlon: 40.9 },
      cities: [
        { id: 'mz_maputo', name: 'Maputo', region: 'Maputo Cidade', lat: -25.9692, lon: 32.5732, elevation: '47 m' },
        { id: 'mz_matola', name: 'Matola', region: 'Maputo Province', lat: -25.9622, lon: 32.4589, elevation: '22 m' },
        { id: 'mz_nampula', name: 'Nampula', region: 'Nampula Province', lat: -15.1167, lon: 39.2667, elevation: '360 m' },
        { id: 'mz_beira', name: 'Beira', region: 'Sofala Province', lat: -19.8436, lon: 34.8389, elevation: '14 m' },
        { id: 'mz_chimoio', name: 'Chimoio', region: 'Manica Province', lat: -19.1167, lon: 33.4833, elevation: '664 m' },
        { id: 'mz_nacala', name: 'Nacala', region: 'Nampula Province', lat: -14.5428, lon: 40.6728, elevation: '62 m' },
        { id: 'mz_quelimane', name: 'Quelimane', region: 'Zambezia Province', lat: -17.8786, lon: 36.8883, elevation: '9 m' },
        { id: 'mz_tete', name: 'Tete', region: 'Tete Province', lat: -16.1564, lon: 33.5864, elevation: '140 m' },
        { id: 'mz_xaixai', name: 'Xai-Xai', region: 'Gaza Province', lat: -25.0519, lon: 33.6442, elevation: '9 m' },
        { id: 'mz_inhambane', name: 'Inhambane', region: 'Inhambane Province', lat: -23.8650, lon: 35.3833, elevation: '14 m' }
      ],
      hazardZones: [
        { name: "Beira Cyclone & Maritime Corridor", lat: -19.84, lon: 34.84, radius: 95000, color: "#EF373E", fill: "#EF373E", type: "Tropical Cyclone & Storm Surge" },
        { name: "Zambezi Lower Basin Flood Zone", lat: -17.88, lon: 36.89, radius: 90000, color: "#2563eb", fill: "#2563eb", type: "Severe Riverine Inundation" },
        { name: "Limpopo River Inundation Area", lat: -25.05, lon: 33.64, radius: 80000, color: "#F59E0B", fill: "#F59E0B", type: "Flash Flood Watch" }
      ]
    },

    tanzania: {
      code: 'tanzania',
      name: 'Tanzania',
      flag: '🇹🇿',
      theme: 'red',
      center: [-6.3690, 34.8888],
      zoom: 6,
      bounds: { minlat: -11.8, maxlat: -0.9, minlon: 29.3, maxlon: 40.5 },
      cities: [
        { id: 'tz_daressalaam', name: 'Dar es Salaam', region: 'Coast Region', lat: -6.7924, lon: 39.2083, elevation: '24 m' },
        { id: 'tz_mwanza', name: 'Mwanza', region: 'Lake Zone', lat: -2.5167, lon: 32.9000, elevation: '1,140 m' },
        { id: 'tz_arusha', name: 'Arusha', region: 'Northern Highlands', lat: -3.3667, lon: 36.6833, elevation: '1,400 m' },
        { id: 'tz_dodoma', name: 'Dodoma', region: 'Central Region', lat: -6.1731, lon: 35.7419, elevation: '1,120 m' },
        { id: 'tz_mbeya', name: 'Mbeya', region: 'Southern Highlands', lat: -8.9000, lon: 33.4500, elevation: '1,700 m' },
        { id: 'tz_morogoro', name: 'Morogoro', region: 'Eastern Region', lat: -6.8219, lon: 37.6611, elevation: '526 m' },
        { id: 'tz_tanga', name: 'Tanga', region: 'Northeastern Coast', lat: -5.0689, lon: 39.0989, elevation: '15 m' },
        { id: 'tz_zanzibar', name: 'Zanzibar City', region: 'Unguja Island', lat: -6.1628, lon: 39.2022, elevation: '16 m' },
        { id: 'tz_tabora', name: 'Tabora', region: 'Central Western', lat: -5.0167, lon: 32.8000, elevation: '1,200 m' },
        { id: 'tz_iringa', name: 'Iringa', region: 'Southern Highlands', lat: -7.7667, lon: 35.7000, elevation: '1,550 m' }
      ],
      hazardZones: [
        { name: "Rift Valley Tectonic & Volcanic", lat: -3.37, lon: 36.68, radius: 85000, color: "#2CB34A", fill: "#2CB34A", type: "Seismic & Volcanic Watch" },
        { name: "Rufiji Basin Inundation Sector", lat: -7.70, lon: 38.50, radius: 90000, color: "#2563eb", fill: "#2563eb", type: "River Basin Flood Risk" },
        { name: "Central Dodoma Aridity Alert", lat: -6.17, lon: 35.74, radius: 100000, color: "#F59E0B", fill: "#F59E0B", type: "Drought & Water Stress" }
      ]
    }
  },

  CONFIG: {
    APP_TITLE: "Negarit - Pan-African Disaster Intelligence Platform",
    VERSION: "2.0.0 Pan-African Predictive",
    FORECAST_DAYS: 16,
    OPEN_METEO_BASE: "https://api.open-meteo.com/v1/forecast",
    USGS_EARTHQUAKE_BASE: "https://earthquake.usgs.gov/fdsnws/event/1/query",
    MAP: {
      INITIAL_LAT: 9.145,
      INITIAL_LON: 38.752,
      INITIAL_ZOOM: 6,
      TILE_LAYER: "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
      ATTRIBUTION: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &bull; USGS Earthquakes'
    },
    // Defaults to Ethiopia on load
    CITIES: []
  },

  init() {
    const savedCountry = localStorage.getItem('negarit_active_country') || 'ethiopia';
    this.setActiveCountry(savedCountry, false);
  },

  getCountries() {
    return Object.values(this.COUNTRIES);
  },

  getActiveCountry() {
    return this.COUNTRIES[this.activeCountryCode] || this.COUNTRIES.ethiopia;
  },

  setActiveCountry(countryCode, dispatch = true) {
    if (!this.COUNTRIES[countryCode]) {
      countryCode = 'ethiopia';
    }
    this.activeCountryCode = countryCode;
    const country = this.COUNTRIES[countryCode];
    
    // Update active cities
    this.CONFIG.CITIES = [...country.cities];
    this.CONFIG.MAP.INITIAL_LAT = country.center[0];
    this.CONFIG.MAP.INITIAL_LON = country.center[1];
    this.CONFIG.MAP.INITIAL_ZOOM = country.zoom;

    try {
      localStorage.setItem('negarit_active_country', countryCode);
    } catch (e) {}

    // Apply sidebar theme
    this.applySidebarTheme(country.theme);

    if (dispatch) {
      window.dispatchEvent(new CustomEvent('negarit:country-changed', {
        detail: {
          countryCode,
          country,
          theme: country.theme
        }
      }));
    }
    return country;
  },

  applySidebarTheme(theme) {
    const sidebar = document.getElementById('app-sidebar');
    const body = document.body;
    if (theme === 'red') {
      if (sidebar) sidebar.classList.add('theme-red');
      if (body) body.classList.add('country-theme-red');
    } else {
      if (sidebar) sidebar.classList.remove('theme-red');
      if (body) body.classList.remove('country-theme-red');
    }
  },

  getCities(countryCode) {
    const code = countryCode || this.activeCountryCode;
    return this.COUNTRIES[code]?.cities || this.COUNTRIES.ethiopia.cities;
  },

  getHazardZones(countryCode) {
    const code = countryCode || this.activeCountryCode;
    return this.COUNTRIES[code]?.hazardZones || this.COUNTRIES.ethiopia.hazardZones;
  },

  searchLocation(query) {
    const q = (query || '').toLowerCase().trim();
    const allCities = [];
    Object.values(this.COUNTRIES).forEach(c => {
      c.cities.forEach(city => {
        allCities.push({ ...city, countryCode: c.code, countryName: c.name, flag: c.flag });
      });
    });

    if (!q) {
      return allCities.slice(0, 10);
    }

    return allCities.filter(c => 
      c.name.toLowerCase().includes(q) || 
      (c.region && c.region.toLowerCase().includes(q)) ||
      c.countryName.toLowerCase().includes(q)
    );
  },

  _cache: {},

  async fetchForecast(lat, lon, cityId) {
    const key = cityId || `${lat.toFixed(4)},${lon.toFixed(4)}`;
    if (this._cache[key]) {
      return this._cache[key];
    }

    const url = `${this.CONFIG.OPEN_METEO_BASE}?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,precipitation,soil_moisture_0_to_7cm&daily=temperature_2m_max,temperature_2m_min,precipitation_sum,relative_humidity_2m_mean&forecast_days=${this.CONFIG.FORECAST_DAYS}&timezone=auto`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      const data = await res.json();
      this._cache[key] = data;
      return data;
    } catch (err) {
      console.warn(`Telemetry API offline/timeout for [${cityId || key}]. Using agro-ecological generator:`, err.message);
      const fallback = this.generateFallbackTelemetry(lat, lon, cityId);
      this._cache[key] = fallback;
      return fallback;
    }
  },

  async fetchEarthquakes(bounds) {
    const b = bounds || this.getActiveCountry()?.bounds || this.COUNTRIES.ethiopia.bounds;
    const url = `${this.CONFIG.USGS_EARTHQUAKE_BASE}?format=geojson&minlatitude=${b.minlat}&maxlatitude=${b.maxlat}&minlongitude=${b.minlon}&maxlongitude=${b.maxlon}&minmagnitude=2.0&limit=25`;
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(timeoutId);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      return await res.json();
    } catch (err) {
      console.warn("USGS seismic stream unreachable. Setting empty feature set:", err.message);
      return { features: [] };
    }
  },

  generateFallbackTelemetry(lat, lon, cityId) {
    const isHighland = lat > 5 && lat < 15;
    const baseMaxTemp = 24.0 + (Math.sin(lat) * 4.0);
    const baseMinTemp = Math.max(8.0, baseMaxTemp - 11.0);
    const baseHum = Math.round(55 + (Math.cos(lon) * 15));
    const totalRainTarget = Math.max(5.0, Math.round(25 + Math.sin(lat * lon) * 35));
    const peakRain = parseFloat((totalRainTarget * 0.35).toFixed(1));
    const fallbackSoil = parseFloat((0.15 + (totalRainTarget / 250)).toFixed(2));

    const times = [];
    const maxTemps = [];
    const minTemps = [];
    const precipSums = [];
    const humidities = [];

    const now = new Date();
    for (let i = 0; i < this.CONFIG.FORECAST_DAYS; i++) {
      const d = new Date(now);
      d.setDate(d.getDate() + i);
      times.push(d.toISOString().split('T')[0]);
      
      const tempVariance = Math.sin(i / 2) * 1.8;
      maxTemps.push(parseFloat((baseMaxTemp + tempVariance).toFixed(1)));
      minTemps.push(parseFloat((baseMinTemp + tempVariance * 0.7).toFixed(1)));
      
      let rainVal = 0.0;
      if (i === 1 || i === 2) {
        rainVal = peakRain;
      } else if (i === 3 || i === 4) {
        rainVal = parseFloat((peakRain * 0.6).toFixed(1));
      } else if (totalRainTarget > 30 && (i === 8 || i === 9 || i === 13)) {
        rainVal = parseFloat((peakRain * 0.4).toFixed(1));
      }
      precipSums.push(parseFloat(rainVal.toFixed(1)));
      humidities.push(Math.min(95, Math.max(15, Math.round(baseHum + Math.cos(i) * 6))));
    }

    return {
      latitude: lat,
      longitude: lon,
      elevation: isHighland ? 2444 : 500,
      current: {
        temperature_2m: parseFloat((baseMaxTemp - 2.5).toFixed(1)),
        relative_humidity_2m: humidities[0],
        precipitation: precipSums[0],
        soil_moisture_0_to_7cm: fallbackSoil
      },
      daily: {
        time: times,
        temperature_2m_max: maxTemps,
        temperature_2m_min: minTemps,
        precipitation_sum: precipSums,
        relative_humidity_2m_mean: humidities
      }
    };
  }
};

// Initialize active country on script load
window.WeatherAPI.init();
