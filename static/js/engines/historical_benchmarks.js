/**
 * ETHIOPIA CLIMATE & WEATHER MONITOR - HISTORICAL DISASTER BENCHMARK DATASETS
 * Location: models/historical_benchmarks.js
 * 
 * Ground-truth real-world disaster benchmarks for testing model accuracy
 */

window.HISTORICAL_BENCHMARKS = [
  {
    id: 'gofa_landslide_2024',
    name: '2024 Gofa Highland Landslide (South Ethiopia)',
    disasterCategory: 'landslide',
    expectedRiskLevel: 'CRITICAL',
    expectedRiskScoreMin: 85,
    location: 'Gofa Zone, South Ethiopia',
    description: 'Catastrophic highland slope failure in July 2024 following 3 days of torrential downpours exceeding 110mm on saturated mountain soils.',
    telemetry: {
      locationName: 'Gofa Highlands Benchmark',
      current: {
        temperature_2m: 17.8,
        relative_humidity_2m: 94,
        precipitation: 28.5,
        soil_moisture_0_to_7cm: 0.465
      },
      daily: {
        time: ["2024-07-18","2024-07-19","2024-07-20","2024-07-21","2024-07-22","2024-07-23","2024-07-24","2024-07-25","2024-07-26","2024-07-27","2024-07-28","2024-07-29","2024-07-30","2024-07-31","2024-08-01","2024-08-02"],
        temperature_2m_max: [19.2, 18.5, 17.8, 17.2, 18.0, 18.8, 19.5, 20.1, 19.8, 19.0, 18.4, 17.9, 18.2, 18.6, 19.0, 19.3],
        temperature_2m_min: [13.1, 12.8, 12.4, 12.0, 12.5, 13.0, 13.2, 13.5, 13.0, 12.6, 12.3, 12.1, 12.4, 12.7, 13.0, 13.1],
        precipitation_sum: [12.4, 34.8, 42.5, 28.5, 15.2, 6.8, 2.1, 0.4, 1.2, 8.5, 14.2, 19.0, 11.5, 5.2, 1.8, 0.5],
        relative_humidity_2m_mean: [88, 95, 98, 94, 90, 84, 78, 72, 75, 82, 88, 92, 86, 80, 75, 71]
      },
      seismic: { features: [] }
    }
  },
  {
    id: 'afar_drought_2022',
    name: '2021-2022 Afar & Somali Pastoral Mega-Drought',
    disasterCategory: 'drought',
    expectedRiskLevel: 'CRITICAL',
    expectedRiskScoreMin: 85,
    location: 'Afar & Somali Pastoral Zones',
    description: 'Severe multi-season drought with topsoil moisture dropping below 0.12 m³/m³ and consecutive 16-day rainfall accumulators under 4mm.',
    telemetry: {
      locationName: 'Afar Pastoral Lowlands Benchmark',
      current: {
        temperature_2m: 36.4,
        relative_humidity_2m: 22,
        precipitation: 0.0,
        soil_moisture_0_to_7cm: 0.115
      },
      daily: {
        time: ["2022-03-01","2022-03-02","2022-03-03","2022-03-04","2022-03-05","2022-03-06","2022-03-07","2022-03-08","2022-03-09","2022-03-10","2022-03-11","2022-03-12","2022-03-13","2022-03-14","2022-03-15","2022-03-16"],
        temperature_2m_max: [37.2, 38.0, 38.5, 39.1, 38.8, 37.9, 38.2, 39.0, 39.5, 40.1, 39.8, 38.9, 38.4, 39.2, 39.7, 40.0],
        temperature_2m_min: [24.5, 25.1, 25.8, 26.2, 25.9, 25.0, 25.4, 26.0, 26.5, 27.0, 26.8, 25.9, 25.3, 26.1, 26.7, 27.2],
        precipitation_sum: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.2, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        relative_humidity_2m_mean: [21, 19, 18, 17, 19, 22, 20, 18, 17, 19, 18, 20, 21, 19, 18, 16]
      },
      seismic: { features: [] }
    }
  },
  {
    id: 'awash_flood_2020',
    name: '2020 Awash River Basin Catastrophic Inundation',
    disasterCategory: 'flood',
    expectedRiskLevel: 'CRITICAL',
    expectedRiskScoreMin: 85,
    location: 'Awash River Catchment',
    description: 'Extreme river channel breach triggered by 16-day rainfall accumulation exceeding 120mm in highland headwaters.',
    telemetry: {
      locationName: 'Awash Basin Benchmark',
      current: {
        temperature_2m: 23.5,
        relative_humidity_2m: 89,
        precipitation: 32.0,
        soil_moisture_0_to_7cm: 0.440
      },
      daily: {
        time: ["2020-08-10","2020-08-11","2020-08-12","2020-08-13","2020-08-14","2020-08-15","2020-08-16","2020-08-17","2020-08-18","2020-08-19","2020-08-20","2020-08-21","2020-08-22","2020-08-23","2020-08-24","2020-08-25"],
        temperature_2m_max: [24.0, 23.2, 22.8, 23.5, 24.1, 24.8, 25.0, 24.2, 23.6, 22.9, 23.4, 24.0, 24.5, 23.8, 23.1, 22.5],
        temperature_2m_min: [16.2, 15.8, 15.4, 15.9, 16.3, 16.8, 17.0, 16.4, 15.9, 15.3, 15.8, 16.2, 16.7, 16.0, 15.5, 15.0],
        precipitation_sum: [18.5, 36.2, 48.0, 32.0, 14.8, 5.2, 2.0, 11.4, 22.8, 38.5, 25.0, 12.1, 4.5, 1.2, 0.8, 0.2],
        relative_humidity_2m_mean: [85, 92, 96, 90, 84, 78, 74, 82, 89, 95, 88, 82, 76, 72, 70, 68]
      },
      seismic: { features: [] }
    }
  },
  {
    id: 'metahara_quake_2024',
    name: '2024 Metahara Rift M4.9 Earthquake Swarm',
    disasterCategory: 'earthquake',
    expectedRiskLevel: 'HIGH / CRITICAL',
    expectedRiskScoreMin: 65,
    location: 'Metahara / East African Rift Zone',
    description: 'Moderate tectonic tremor swarm along the Main Ethiopian Rift line recorded by USGS at M4.9 magnitude.',
    telemetry: {
      locationName: 'Metahara Rift Benchmark',
      current: {
        temperature_2m: 29.2,
        relative_humidity_2m: 45,
        precipitation: 0.0,
        soil_moisture_0_to_7cm: 0.250
      },
      daily: {
        time: ["2024-09-01","2024-09-02","2024-09-03","2024-09-04","2024-09-05","2024-09-06","2024-09-07","2024-09-08","2024-09-09","2024-09-10","2024-09-11","2024-09-12","2024-09-13","2024-09-14","2024-09-15","2024-09-16"],
        temperature_2m_max: [30.0, 30.5, 31.0, 30.8, 29.5, 29.0, 29.8, 30.2, 30.9, 31.2, 30.5, 29.8, 29.2, 30.0, 30.4, 31.0],
        temperature_2m_min: [19.0, 19.5, 20.0, 19.8, 18.9, 18.5, 19.2, 19.6, 20.1, 20.4, 19.8, 19.1, 18.7, 19.3, 19.7, 20.2],
        precipitation_sum: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
        relative_humidity_2m_mean: [45, 42, 40, 43, 48, 50, 46, 44, 41, 39, 44, 47, 49, 45, 43, 40]
      },
      seismic: {
        features: [
          {
            type: "Feature",
            properties: {
              mag: 4.9,
              place: "19 km ESE of Metahāra, Ethiopia",
              time: 1786295502151,
              title: "M 4.9 - 19 km ESE of Metahāra, Ethiopia"
            },
            geometry: { type: "Point", coordinates: [40.0706, 8.8103, 10] }
          }
        ]
      }
    }
  }
];
