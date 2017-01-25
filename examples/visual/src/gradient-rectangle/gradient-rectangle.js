// NOTE: replace '.../../../../index.js' with 'sass-vars-loader' in your projects
const style = require('../../../../index.js!./gradient-rectangle.scss');
const d3 = require('d3');

const vis = d3.select('#vis');
const rect = vis.selectAll('rect.rectangle').data([style]);
const gradient = vis.select('defs linearGradient#rectangleGradient');
const gradientStops = gradient.selectAll('stop').data(style.global.$gradient.value);

gradientStops
  .enter()
    .append('stop')
    .merge(gradientStops)
    .transition()
      .attr('offset', (d, idx, stops) => ((idx * 1 / (stops.length - 1)) * 100) + '%')
      .attr('stop-color', d => d.value.hex)
      .attr('stop-opacity', d => d.value.a);

gradientStops.exit().transition().remove();

rect
.enter()
  .append('rect')
    .classed('rectangle', true)
    .attr('x', 10)
    .attr('y', 10)
  .merge(rect)
    .transition()
      .attr('width', d => d.global.$rectangleWidth.value)
      .attr('height', d => d.global.$rectangleHeight.value)
      .attr('rx', d => d.global.$radius.value)
      .attr('ry', d => d.global.$radius.value)
      .attr('fill-opacity', d => d.global.$opacity.value)
      .attr('fill', 'url(#rectangleGradient)');

rect.exit().remove();

if(module.hot) {
  module.hot.accept();
}