import React, { useEffect, useRef } from 'react';

const W = 640, H = 380;

const cropLeft   = W * 0.14;
const cropRight  = W * 0.985;
const cropTop    = H * 0.02;
const cropBottom = H * 0.84;
const clipW = cropRight  - cropLeft;
const clipH = cropBottom - cropTop;

/**
 * Geo-coordinate lookup for international destinations.
 * Keys are lowercase.
 */
const WORLD_GEO = {
  'bali': { lat: -8.3405, lon: 115.0920 },
  'indonesia': { lat: -8.3405, lon: 115.0920 },
  'thailand': { lat: 13.7563, lon: 100.5018 },
  'bangkok': { lat: 13.7563, lon: 100.5018 },
  'phuket': { lat: 7.8804, lon: 98.3923 },
  'singapore': { lat: 1.3521, lon: 103.8198 },
  'malaysia': { lat: 3.1390, lon: 101.6869 },
  'kuala lumpur': { lat: 3.1390, lon: 101.6869 },
  'dubai': { lat: 25.2048, lon: 55.2708 },
  'abu dhabi': { lat: 24.4539, lon: 54.3773 },
  'maldives': { lat: 3.2028, lon: 73.2207 },
  'sri lanka': { lat: 7.8731, lon: 80.7718 },
  'colombo': { lat: 6.9271, lon: 79.8612 },
  'nepal': { lat: 28.3949, lon: 84.1240 },
  'kathmandu': { lat: 27.7172, lon: 85.3240 },
  'bhutan': { lat: 27.5142, lon: 90.4336 },
  'paris': { lat: 48.8566, lon: 2.3522 },
  'france': { lat: 48.8566, lon: 2.3522 },
  'london': { lat: 51.5074, lon: -0.1278 },
  'england': { lat: 51.5074, lon: -0.1278 },
  'uk': { lat: 51.5074, lon: -0.1278 },
  'italy': { lat: 41.9028, lon: 12.4964 },
  'rome': { lat: 41.9028, lon: 12.4964 },
  'venice': { lat: 45.4408, lon: 12.3155 },
  'switzerland': { lat: 46.8182, lon: 8.2275 },
  'zurich': { lat: 47.3769, lon: 8.5417 },
  'spain': { lat: 40.4168, lon: -3.7038 },
  'barcelona': { lat: 41.3874, lon: 2.1686 },
  'greece': { lat: 37.9838, lon: 23.7275 },
  'santorini': { lat: 36.3932, lon: 25.4615 },
  'turkey': { lat: 41.0082, lon: 28.9784 },
  'istanbul': { lat: 41.0082, lon: 28.9784 },
  'egypt': { lat: 30.0444, lon: 31.2357 },
  'cairo': { lat: 30.0444, lon: 31.2357 },
  'japan': { lat: 35.6762, lon: 139.6503 },
  'tokyo': { lat: 35.6762, lon: 139.6503 },
  'south korea': { lat: 37.5665, lon: 126.9780 },
  'seoul': { lat: 37.5665, lon: 126.9780 },
  'vietnam': { lat: 21.0285, lon: 105.8542 },
  'hanoi': { lat: 21.0285, lon: 105.8542 },
  'cambodia': { lat: 13.3633, lon: 103.8564 },
  'australia': { lat: -33.8688, lon: 151.2093 },
  'sydney': { lat: -33.8688, lon: 151.2093 },
  'new zealand': { lat: -36.8485, lon: 174.7633 },
  'usa': { lat: 40.7128, lon: -74.0060 },
  'new york': { lat: 40.7128, lon: -74.0060 },
  'canada': { lat: 43.6532, lon: -79.3832 },
  'mexico': { lat: 19.4326, lon: -99.1332 },
  'brazil': { lat: -22.9068, lon: -43.1729 },
  'kenya': { lat: -1.2921, lon: 36.8219 },
  'south africa': { lat: -33.9249, lon: 18.4241 },
  'mauritius': { lat: -20.3484, lon: 57.5522 },
  'seychelles': { lat: -4.6796, lon: 55.4920 },
  'zanzibar': { lat: -6.1659, lon: 39.1989 },
  'tanzania': { lat: -6.3690, lon: 34.8888 },
  'china': { lat: 39.9042, lon: 116.4074 },
  'beijing': { lat: 39.9042, lon: 116.4074 },
  'hong kong': { lat: 22.3193, lon: 114.1694 },
  'philippines': { lat: 14.5995, lon: 120.9842 },
  'fiji': { lat: -17.7134, lon: 178.0650 },
  'hawaii': { lat: 21.3069, lon: -157.8583 },
  'las vegas': { lat: 36.1699, lon: -115.1398 },
  'europe': { lat: 48.8566, lon: 2.3522 },
};

function findGeoCoords(destName) {
  if (!destName) return null;
  const lower = destName.toLowerCase().trim();
  if (WORLD_GEO[lower]) return WORLD_GEO[lower];
  for (const [key, coords] of Object.entries(WORLD_GEO)) {
    if (lower.includes(key)) return coords;
  }
  return null;
}

export const RealWorldMapD3 = ({ destinations = [] }) => {
  const svgRef = useRef(null);
  const activeRef = useRef(null);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const d3 = window.d3;
    const topojson = window.topojson;
    if (!d3 || !topojson) return;

    let cancelled = false;

    fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json')
      .then(r => r.json())
      .then(world => {
        if (cancelled) return;

        d3.select(svgEl).selectAll('*').remove();

        const svg = d3.select(svgEl)
          .attr('viewBox', `${cropLeft} ${cropTop} ${clipW} ${clipH}`);

        const projection = d3.geoMercator()
          .scale(W / 6.6)
          .translate([W / 2, H / 1.6]);

        const path = d3.geoPath().projection(projection);
        const countries = topojson.feature(world, world.objects.countries);

        svg.append('defs')
          .append('clipPath').attr('id', 'realWorldClip')
          .append('rect')
            .attr('x', cropLeft).attr('y', cropTop)
            .attr('width', clipW).attr('height', clipH);

        const g = svg.append('g').attr('clip-path', 'url(#realWorldClip)');

        const graticule = d3.geoGraticule()();
        g.append('path')
          .datum(graticule)
          .attr('class', 'wm-graticule')
          .attr('d', path);

        g.selectAll('.wm-country')
          .data(countries.features)
          .enter().append('path')
          .attr('class', 'wm-country')
          .attr('d', path)
          .on('mouseenter', function () { d3.select(this).style('fill', '#5a9fd4'); })
          .on('mouseleave', function () { d3.select(this).style('fill', ''); });

        // Dynamic markers
        const places = [];
        const seen = new Set();

        destinations.forEach(dest => {
          const coords = findGeoCoords(dest.name || dest);
          if (!coords) return;
          const key = `${coords.lat},${coords.lon}`;
          if (seen.has(key)) return;
          seen.add(key);
          places.push({ id: (dest.name || dest).toLowerCase().replace(/\s+/g, '-'), ...coords });
        });

        const mk = svg.append('g').attr('clip-path', 'url(#realWorldClip)');

        places.forEach(p => {
          const [x, y] = projection([p.lon, p.lat]);
          const mg = mk.append('g')
            .attr('class', 'wm-marker')
            .attr('id', 'rwm-mk-' + p.id)
            .on('click', () => {
              if (activeRef.current === p.id) {
                mg.classed('wm-marker--active', false);
                activeRef.current = null;
              } else {
                // Deactivate previous
                if (activeRef.current) {
                  d3.select('#rwm-mk-' + activeRef.current).classed('wm-marker--active', false);
                }
                mg.classed('wm-marker--active', true);
                activeRef.current = p.id;
              }
            });

          mg.append('circle').attr('class', 'wm-ring').attr('cx', x).attr('cy', y).attr('r', 7);
          mg.append('circle').attr('class', 'wm-dot').attr('cx', x).attr('cy', y).attr('r', 4);
        });
      })
      .catch(() => {});

    return () => { cancelled = true; };
  }, [destinations]);

  return (
    <svg
      ref={svgRef}
      style={{ display: 'block', width: '100%', height: 'auto', background: '#ffffff' }}
    />
  );
};
