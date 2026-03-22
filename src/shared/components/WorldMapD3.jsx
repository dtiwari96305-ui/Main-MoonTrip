import React, { useEffect, useRef } from 'react';

const W = 640, H = 380;

const BALI = { lat: -8.3405, lon: 115.0920 };

const cropLeft   = W * 0.14;
const cropRight  = W * 0.985;
const cropTop    = H * 0.02;
const cropBottom = H * 0.84;
const clipW = cropRight  - cropLeft;
const clipH = cropBottom - cropTop;

export const WorldMapD3 = () => {
  const svgRef   = useRef(null);
  const activeRef = useRef(false);

  useEffect(() => {
    const svgEl = svgRef.current;
    if (!svgEl) return;

    const d3       = window.d3;
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

        const path     = d3.geoPath().projection(projection);
        const countries = topojson.feature(world, world.objects.countries);

        // Clip path
        svg.append('defs')
          .append('clipPath').attr('id', 'worldClip')
          .append('rect')
            .attr('x', cropLeft).attr('y', cropTop)
            .attr('width', clipW).attr('height', clipH);

        const g = svg.append('g').attr('clip-path', 'url(#worldClip)');

        // Graticule
        const graticule = d3.geoGraticule()();
        g.append('path')
          .datum(graticule)
          .attr('class', 'wm-graticule')
          .attr('d', path);

        // Countries
        g.selectAll('.wm-country')
          .data(countries.features)
          .enter().append('path')
          .attr('class', 'wm-country')
          .attr('d', path)
          .on('mouseenter', function () { d3.select(this).style('fill', '#5a9fd4'); })
          .on('mouseleave', function () { d3.select(this).style('fill', ''); });

        // Bali marker — appended to its own clipped group so it renders above countries
        const [x, y] = projection([BALI.lon, BALI.lat]);
        const mk = svg.append('g').attr('clip-path', 'url(#worldClip)');
        const mg = mk.append('g')
          .attr('class', 'wm-marker')
          .attr('id', 'wm-mk-bali')
          .on('click', () => {
            activeRef.current = !activeRef.current;
            mg.classed('wm-marker--active', activeRef.current);
          });

        mg.append('circle').attr('class', 'wm-ring').attr('cx', x).attr('cy', y).attr('r', 7);
        mg.append('circle').attr('class', 'wm-dot').attr('cx', x).attr('cy', y).attr('r', 4);
      })
      .catch(err => console.error('WorldMapD3: failed to load geo data', err));

    return () => { cancelled = true; };
  }, []);

  return (
    <svg
      ref={svgRef}
      style={{ display: 'block', width: '100%', height: 'auto', background: '#ffffff' }}
    />
  );
};
