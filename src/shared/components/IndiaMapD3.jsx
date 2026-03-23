import React, { useEffect, useRef } from 'react';

const INDIA_ID = 356;
const NEIGHBOUR_IDS = new Set([586, 156, 524, 64, 50, 104, 144]);

const INDIA_GEO = {
  'goa': { lat: 15.2993, lon: 74.1240 },
  'srinagar': { lat: 34.0836, lon: 74.7973 },
  'gulmarg': { lat: 34.0484, lon: 74.3805 },
  'manali': { lat: 32.2396, lon: 77.1887 },
  'shimla': { lat: 31.1048, lon: 77.1734 },
  'jaipur': { lat: 26.9124, lon: 75.7873 },
  'udaipur': { lat: 24.5854, lon: 73.7125 },
  'kerala': { lat: 10.8505, lon: 76.2711 },
  'munnar': { lat: 10.0889, lon: 77.0595 },
  'ooty': { lat: 11.4102, lon: 76.6950 },
  'darjeeling': { lat: 27.0360, lon: 88.2627 },
  'rishikesh': { lat: 30.0869, lon: 78.2676 },
  'varanasi': { lat: 25.3176, lon: 83.0064 },
  'agra': { lat: 27.1767, lon: 78.0081 },
  'delhi': { lat: 28.7041, lon: 77.1025 },
  'new delhi': { lat: 28.6139, lon: 77.2090 },
  'mumbai': { lat: 19.0760, lon: 72.8777 },
  'bangalore': { lat: 12.9716, lon: 77.5946 },
  'bengaluru': { lat: 12.9716, lon: 77.5946 },
  'chennai': { lat: 13.0827, lon: 80.2707 },
  'hyderabad': { lat: 17.3850, lon: 78.4867 },
  'kolkata': { lat: 22.5726, lon: 88.3639 },
  'pune': { lat: 18.5204, lon: 73.8567 },
  'leh': { lat: 34.1526, lon: 77.5771 },
  'ladakh': { lat: 34.1526, lon: 77.5771 },
  'andaman': { lat: 11.7401, lon: 92.6586 },
  'coorg': { lat: 12.3375, lon: 75.8069 },
  'kodaikanal': { lat: 10.2381, lon: 77.4892 },
  'alleppey': { lat: 9.4981, lon: 76.3388 },
  'pondicherry': { lat: 11.9416, lon: 79.8083 },
  'jodhpur': { lat: 26.2389, lon: 73.0243 },
  'amritsar': { lat: 31.6340, lon: 74.8723 },
  'mysore': { lat: 12.2958, lon: 76.6394 },
  'mysuru': { lat: 12.2958, lon: 76.6394 },
  'rajasthan': { lat: 27.0238, lon: 74.2179 },
  'kashmir': { lat: 34.0836, lon: 74.7973 },
  'meghalaya': { lat: 25.4670, lon: 91.3662 },
  'shillong': { lat: 25.5788, lon: 91.8933 },
  'gangtok': { lat: 27.3389, lon: 88.6065 },
  'sikkim': { lat: 27.5330, lon: 88.5122 },
  'pahalgam': { lat: 34.0160, lon: 75.3150 },
};

const FALLBACK_PLACES = [
  { id: 'goa',      lat: 15.2993, lon: 74.1240 },
  { id: 'srinagar', lat: 34.0836, lon: 74.7973 },
];

function findGeoCoords(destName) {
  if (!destName) return null;
  const lower = destName.toLowerCase().trim();
  if (INDIA_GEO[lower]) return INDIA_GEO[lower];
  for (const [key, coords] of Object.entries(INDIA_GEO)) {
    if (lower.includes(key)) return coords;
  }
  return null;
}

export const IndiaMapD3 = ({ destinations = [] }) => {
  const svgRef = useRef(null);
  const activeRef = useRef(null);

  const placesToRender = destinations.length > 0
    ? destinations.map((d, i) => {
        const geo = findGeoCoords(d.name || d);
        return geo ? { id: `dest-${i}`, lat: geo.lat, lon: geo.lon } : null;
      }).filter(Boolean)
    : FALLBACK_PLACES;

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

        const W = 520, H = 560;

        const countries = topojson.feature(world, world.objects.countries);
        const showIds   = new Set([INDIA_ID, ...NEIGHBOUR_IDS]);
        const visible   = countries.features.filter(f => showIds.has(+f.id));
        const indiaFeat = visible.filter(f => +f.id === INDIA_ID);
        const neighFeat = visible.filter(f => NEIGHBOUR_IDS.has(+f.id));

        const projection = d3.geoMercator()
          .fitExtent([[10, 10], [W - 10, H - 10]], { type: 'FeatureCollection', features: visible });

        const path = d3.geoPath().projection(projection);

        const indiaBounds = path.bounds(indiaFeat[0]);
        const indiaTop    = indiaBounds[0][1];
        const indiaRight  = indiaBounds[1][0];
        const cropTop     = Math.max(0, indiaTop - 38);
        const cropRight   = indiaRight + 42;
        const newH        = H - cropTop;
        const newW        = cropRight;

        const svg = d3.select(svgEl)
          .attr('viewBox', `0 ${cropTop} ${newW} ${newH}`);

        svg.append('rect')
          .attr('x', 0).attr('y', cropTop)
          .attr('width', newW).attr('height', newH)
          .attr('fill', '#fdf5ec');

        svg.append('defs')
          .append('clipPath').attr('id', 'indiaMapClip')
          .append('rect')
            .attr('x', 0).attr('y', cropTop)
            .attr('width', newW).attr('height', newH);

        const g = svg.append('g').attr('clip-path', 'url(#indiaMapClip)');

        g.selectAll('.neigh')
          .data(neighFeat)
          .enter().append('path')
          .attr('d', path)
          .attr('fill', '#fdf0e6')
          .attr('stroke', '#e8c8a8')
          .attr('stroke-width', 0.65)
          .attr('stroke-linejoin', 'round')
          .style('cursor', 'pointer')
          .style('transition', 'fill 0.18s ease')
          .on('mouseenter', function () { d3.select(this).attr('fill', '#c84e08'); })
          .on('mouseleave', function () { d3.select(this).attr('fill', '#fdf0e6'); });

        g.selectAll('.india')
          .data(indiaFeat)
          .enter().append('path')
          .attr('d', path)
          .attr('fill', '#fde8d5')
          .attr('stroke', '#e8a870')
          .attr('stroke-width', 0.9)
          .attr('stroke-linejoin', 'round')
          .style('cursor', 'pointer')
          .style('transition', 'fill 0.18s ease')
          .on('mouseenter', function () { d3.select(this).attr('fill', '#c84e08'); })
          .on('mouseleave', function () { d3.select(this).attr('fill', '#fde8d5'); });

        const mk = g.append('g');
        placesToRender.forEach(p => {
          const [x, y] = projection([p.lon, p.lat]);

          const mg = mk.append('g')
            .attr('id', 'imk-' + p.id)
            .style('cursor', 'pointer');

          const ring = mg.append('circle')
            .attr('cx', x).attr('cy', y).attr('r', 10)
            .attr('fill', 'rgba(210,50,30,0.15)')
            .style('transition', 'all 0.2s');

          const dot = mg.append('circle')
            .attr('cx', x).attr('cy', y).attr('r', 6)
            .attr('fill', '#e84030')
            .attr('stroke', 'white')
            .attr('stroke-width', 2)
            .style('filter', 'drop-shadow(0 1px 4px rgba(210,50,30,0.5))')
            .style('transition', 'all 0.2s');

          mg.on('mouseenter', function () {
            dot.attr('fill', '#a31808').style('filter', 'drop-shadow(0 2px 8px rgba(210,50,30,0.75))');
            ring.attr('r', 14).attr('fill', 'rgba(210,50,30,0.22)');
          }).on('mouseleave', function () {
            if (activeRef.current !== p.id) {
              dot.attr('fill', '#e84030').style('filter', 'drop-shadow(0 1px 4px rgba(210,50,30,0.5))');
              ring.attr('r', 10).attr('fill', 'rgba(210,50,30,0.15)');
            }
          }).on('click', function () {
            const prev = activeRef.current;
            if (prev && prev !== p.id) {
              const prevDot  = d3.select(`#imk-${prev} circle:nth-child(2)`);
              const prevRing = d3.select(`#imk-${prev} circle:nth-child(1)`);
              prevDot.attr('fill', '#e84030').style('filter', 'drop-shadow(0 1px 4px rgba(210,50,30,0.5))');
              prevRing.attr('r', 10).attr('fill', 'rgba(210,50,30,0.15)');
            }
            if (activeRef.current === p.id) {
              dot.attr('fill', '#e84030').style('filter', 'drop-shadow(0 1px 4px rgba(210,50,30,0.5))');
              ring.attr('r', 10).attr('fill', 'rgba(210,50,30,0.15)');
              activeRef.current = null;
            } else {
              dot.attr('fill', '#a31808').style('filter', 'drop-shadow(0 2px 8px rgba(210,50,30,0.75))');
              ring.attr('r', 14).attr('fill', 'rgba(210,50,30,0.22)');
              activeRef.current = p.id;
            }
          });
        });
      })
      .catch(err => console.error('IndiaMapD3: failed to load geo data', err));

    return () => { cancelled = true; };
  }, [JSON.stringify(placesToRender)]);

  return (
    <svg
      ref={svgRef}
      style={{ display: 'block', width: '100%', height: 'auto', background: '#fdf5ec' }}
    />
  );
};
