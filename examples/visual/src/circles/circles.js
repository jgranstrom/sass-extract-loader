// NOTE: replace '.../../../../index.js' with 'sass-vars-loader' in your projects
const style = require('../../../../index.js!./circles.scss');
const d3 = require('d3');

const vis = d3.select('#vis');
let visualisationWidth = vis.node().getBoundingClientRect().width;

const circlesXScale = d3.scaleBand()
.domain(d3.range(style.global.$circles.value.length))
.range([0, visualisationWidth])
.padding(1);

const circlesFillScale = d3.scaleSequential(d3.interpolateWarm)
.domain([0, style.global.$circles.value.length - 1]);

const circlesGradient = vis.select('defs linearGradient#circlesGradient');
const circlesGradientStops = circlesGradient.selectAll('stop').data(style.global.$circles.value);
const circlesMargin = style.global.$circlesMargin.value;

circlesGradientStops
  .enter()
    .append('stop')
    .merge(circlesGradientStops)
    .transition()
      .attr('offset', (d, idx, stops) => ((idx * 1 / (stops.length - 1)) * circlesMargin) + '%')
      .attr('stop-color', (d, i) => circlesFillScale(i))
      .attr('stop-opacity', 1);

circlesGradientStops.exit().transition().remove();

const circleLine = vis.selectAll('rect.circles').data([style.global.$circles.value]);

circleLine
.enter()
  .append('rect')
    .classed('circles', true)
    .attr('y', style.global.$rectangleHeight.value + circlesMargin - 1)
    .attr('x', d => circlesXScale(0))
    .attr('width', d => circlesXScale(d.length - 1) - circlesXScale(0))
    .attr('height', 2)
    .attr('fill-opacity', 0.5)
    .attr('fill', 'url(#circlesGradient)')
  .merge(circleLine)
    .transition()
      .attr('y', style.global.$rectangleHeight.value + circlesMargin - 1)
      .attr('x', d => circlesXScale(0))
      .attr('width', d => circlesXScale(d.length - 1) - circlesXScale(0))

circleLine.exit().remove();

const circles = vis.selectAll('circle.static').data(style.global.$circles.value);

circles
.enter()
  .append('circle')
    .classed('static', true)
    .attr('cy', style.global.$rectangleHeight.value + circlesMargin)
    .attr('cx', (d, i) => circlesXScale(i) + circlesXScale.bandwidth() / 2)
  .merge(circles)
    .transition()
      .attr('cx', (d, i) => circlesXScale(i) + circlesXScale.bandwidth() / 2)
      .attr('cy', style.global.$rectangleHeight.value + circlesMargin)
      .attr('r', d => d.value.radius.value)
      .attr('stroke-width', d => d.value.radius.value / 20)
      .attr('fill-opacity', 0.5)
      .attr('stroke-opacity', 0.8)
      .attr('fill', (d, i) => circlesFillScale(i))
      .attr('stroke', (d, i) => circlesFillScale(i))

circles.exit().transition()
  .attr('r', 0)
  .remove();

if(module.hot) {
  module.hot.accept();
}