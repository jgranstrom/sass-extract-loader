const styleVariables = require('sass-extract-loader!./spinner.scss');
const d3 = require('d3');

const vis = d3.select('#vis');
let visualisationWidth = vis.node().getBoundingClientRect().width;
let visualisationHeight = vis.node().getBoundingClientRect().height;

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

if(module.hot) {
  module.hot.accept();
}