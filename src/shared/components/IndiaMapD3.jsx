import React, { useEffect, useRef } from 'react';

const INDIA_ID = 356;
const NEIGHBOUR_IDS = new Set([586, 156, 524, 64, 50, 104, 144]);

const PLACES = [
  { id: 'goa',      lat: 15.2993, lon: 74.1240 },
  { id: 'srinagar', lat: 34.0836, lon: 74.7973 },
];

export const IndiaMapD3 = () => {
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

        // Background
        svg.append('rect')
          .attr('x', 0).attr('y', cropTop)
          .attr('width', newW).attr('height', newH)
          .attr('fill', '#fdf5ec');

        // Clip path
        svg.append('defs')
          .append('clipPath').attr('id', 'indiaMapClip')
          .append('rect')
            .attr('x', 0).attr('y', cropTop)
            .attr('width', newW).attr('height', newH);

        const g = svg.append('g').attr('clip-path', 'url(#indiaMapClip)');

        // Neighbours
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

        // India
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

        // Markers
        const mk = g.append('g');
        PLACES.forEach(p => {
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
            // Deactivate previous
            if (prev && prev !== p.id) {
              const prevDot  = d3.select(`#imk-${prev} circle:nth-child(2)`);
              const prevRing = d3.select(`#imk-${prev} circle:nth-child(1)`);
              prevDot.attr('fill', '#e84030').style('filter', 'drop-shadow(0 1px 4px rgba(210,50,30,0.5))');
              prevRing.attr('r', 10).attr('fill', 'rgba(210,50,30,0.15)');
            }
            if (activeRef.current === p.id) {
              // Deactivate self
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
  }, []);

  return (
    <svg
      ref={svgRef}
      style={{ display: 'block', width: '100%', height: 'auto', background: '#fdf5ec' }}
    />
  );
};
