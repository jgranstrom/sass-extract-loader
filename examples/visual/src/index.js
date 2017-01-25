// NOTE: replace '../../../index.js' with 'sass-vars-loader' in your projects
const styleVariables = require('../../../index.js!./style.scss');
const d3 = require('d3');

const vis = d3.select('#vis');
let visualisationWidth = vis.node().getBoundingClientRect().width;
let visualisationHeight = vis.node().getBoundingClientRect().height;

const singleRect = vis.selectAll('rect.single').data([styleVariables]);
const singleGradient = vis.select('defs linearGradient#singleGradient');
const singleGradientStops = singleGradient.selectAll('stop').data(styleVariables.global.$singleGradient.value);

// Add gradient stops for each of the colors specified in the sass
singleGradientStops
  .enter()
    .append('stop')
    .merge(singleGradientStops)
    .transition()
      .attr('offset', (d, idx, stops) => ((idx * 1 / (stops.length - 1)) * 100) + '%')
      .attr('stop-color', d => d.value.hex)
      .attr('stop-opacity', d => d.value.a);

singleGradientStops.exit().transition().remove();

// Update rectangle to sizes specified in sass
singleRect
.enter()
  .append('rect')
    .classed('single', true)
    .attr('x', 10)
    .attr('y', 10)
  .merge(singleRect)
    .transition()
      .attr('width', d => d.global.$singleWidth.value)
      .attr('height', d => d.global.$singleHeight.value)
      .attr('rx', d => d.global.$singleRadius.value)
      .attr('ry', d => d.global.$singleRadius.value)
      .attr('fill-opacity', d => d.global.$singleOpacity.value)
      .attr('fill', 'url(#singleGradient)');

singleRect.exit().remove();

const circlesXScale = d3.scaleBand()
.domain(d3.range(styleVariables.global.$circles.value.length))
.range([0, visualisationWidth])
.padding(1);

const circlesFillScale = d3.scaleSequential(d3.interpolateWarm)
.domain([0, styleVariables.global.$circles.value.length - 1]);

const circlesGradient = vis.select('defs linearGradient#circlesGradient');
const circlesGradientStops = circlesGradient.selectAll('stop').data(styleVariables.global.$circles.value);

// Add gradient stops for each of the colors specified in the sass
circlesGradientStops
  .enter()
    .append('stop')
    .merge(circlesGradientStops)
    .transition()
      .attr('offset', (d, idx, stops) => ((idx * 1 / (stops.length - 1)) * 100) + '%')
      .attr('stop-color', (d, i) => circlesFillScale(i))
      .attr('stop-opacity', 1);

circlesGradientStops.exit().transition().remove();

const circleLine = vis.selectAll('rect.circles').data([styleVariables.global.$circles.value]);

circleLine
.enter()
  .append('rect')
    .classed('circles', true)
    .attr('y', styleVariables.global.$singleHeight.value + 100 - 1)
    .attr('x', d => circlesXScale(0))
    .attr('width', d => circlesXScale(d.length - 1) - circlesXScale(0))
    .attr('height', 2)
    .attr('fill-opacity', 0.5)
    .attr('fill', 'url(#circlesGradient)')
  .merge(circleLine)
    .transition()
      .attr('y', styleVariables.global.$singleHeight.value + 100 - 1)
      .attr('x', d => circlesXScale(0))
      .attr('width', d => circlesXScale(d.length - 1) - circlesXScale(0))

circleLine.exit().remove();

const circles = vis.selectAll('circle.static').data(styleVariables.global.$circles.value);

circles
.enter()
  .append('circle')
    .classed('static', true)
    .attr('cy', styleVariables.global.$singleHeight.value + 100)
    .attr('cx', (d, i) => circlesXScale(i) + circlesXScale.bandwidth() / 2)
  .merge(circles)
    .transition()
      .attr('cx', (d, i) => circlesXScale(i) + circlesXScale.bandwidth() / 2)
      .attr('cy', styleVariables.global.$singleHeight.value + 100)
      .attr('r', d => d.value.radius.value)
      .attr('stroke-width', d => d.value.radius.value / 20)
      .attr('fill-opacity', 0.5)
      .attr('stroke-opacity', 0.8)
      .attr('fill', (d, i) => circlesFillScale(i))
      .attr('stroke', (d, i) => circlesFillScale(i))

circles.exit().transition()
  .attr('r', 0)
  .remove();

const spinnerGroup = vis.select('g.spinner');
const spinner = spinnerGroup.selectAll('circle.spinner').data(styleVariables.global.$spinners.value);
const spinnerRadius = styleVariables.global.$spinnerRadius.value;
const spinnerFillScale = d3.scaleSequential(d3.interpolateCool)
.domain([0, 3]);

let spinnerCenter = [visualisationWidth / 2, visualisationHeight * 0.6];

spinnerGroup
  .attr('transform-origin', spinnerCenter[0] + 'px ' + spinnerCenter[1] + 'px ' + '0px')
  .style('transform', 'rotate(0deg)')
  .style('animation', 'rotation 6s linear 0s infinite normal none');

spinner
.enter()
  .append('circle')
    .classed('spinner', true)
    .attr('cx', spinnerCenter[0] + spinnerRadius)
    .attr('cy', spinnerCenter[1])
    .attr('fill', 'none')
    .attr('transform-origin', spinnerCenter[0] + 'px ' + spinnerCenter[1] + 'px ' + '0px')
  .merge(spinner)
    .transition()
      .style('transform', (d, i, spinners) => 'rotate(' + i * (360 / spinners.length) + 'deg)')
      .attr('stroke', (d, i) => spinnerFillScale(i))
      .attr('cx', d => spinnerCenter[0] + spinnerRadius)
      .attr('r', d => d.value.radius.value)
      .attr('stroke-width', d => d.value.radius.value / 10);

spinner.exit().transition()
  .attr('r', 0)
  .remove();

window.onresize = function() {
  visualisationWidth = vis.node().getBoundingClientRect().width;
  visualisationHeight = vis.node().getBoundingClientRect().height;
  circlesXScale.range([0, visualisationWidth]);
  
  vis.selectAll('circle.static')
  .attr('cx', (d, i) => circlesXScale(i) + circlesXScale.bandwidth() / 2);

  vis.selectAll('rect.circles')
  .attr('x', d => circlesXScale(0))
  .attr('width', d => circlesXScale(d.length - 1) - circlesXScale(0))

  let spinnerCenter = [visualisationWidth / 2, visualisationHeight * 0.6];
  spinnerGroup
  .attr('transform-origin', spinnerCenter[0] + 'px ' + spinnerCenter[1] + 'px ' + '0px');

  spinnerGroup.selectAll('circle.spinner') 
  .attr('cx', spinnerCenter[0] + spinnerRadius)
  .attr('cy', spinnerCenter[1])
  .attr('transform-origin', spinnerCenter[0] + 'px ' + spinnerCenter[1] + 'px ' + '0px');
}

if(module.hot) {
  module.hot.accept();
}