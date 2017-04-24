import _ from 'lodash';
import { width, height, radius, maxAges, padding } from './parameters';
import { ma } from './utils';

export const xScale = d3.scaleLinear().domain([0, maxAges]).range([0, width / 2]);
export const yScale = d3.scaleLinear().domain([0, 20]).range([20 * radius * 2, 0]);

export default function init(canvas, data) {
  const text = `
    <h2>A Visual Exploration<h2/>
    <h1>Surviving Titanic</h1><br>
    <span class='hint'>Press ENTER to start...</span>
  `;
  Typed.new('#typed', { strings: [text] });

  /* Axes ----------------------------------------------- */
  const xAxis = d3.axisBottom(xScale).tickValues(_.range(0, 90, 10));

  const yAxis = d3.axisLeft(yScale).tickValues(_.range(5, 25, 5));

  const axes = canvas.append('g')
    .attr('class', 'axes');

  axes.append('g')
    .attr('class', 'axis xAxis')
    .attr('transform', `translate(${radius}, ${height / 2})`)
    .call(xAxis);

  axes.append('g')
    .attr('class', 'axis xAxis')
    .attr('transform', `translate(${width / 2 + radius}, ${height / 2})`)
    .call(xAxis);

  axes.append('g')
    .attr('class', 'axis yAxis')
    .attr('transform', `translate(${width / 2 + radius}, ${height / 2 - radius * 2 * 20})`)
    .call(yAxis);

  axes.append('text')
    .classed('axisLabel', true)
    .text('# Passenger')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(${width / 2}, ${height / 2 - radius * 2 * 20 - 10})`);
  axes.append('text')
    .classed('axisLabel', true)
    .text('Age')
    .attr('text-anchor', 'middle')
    .attr('transform', `translate(${width / 2}, ${height / 2 + 30})`);

  axes.style('opacity', 0);

  /* passenger circles  ----------------------------------------------- */
  canvas.append('g')
    .attr('id', 'passengers')
    .selectAll('circle')
    .data(data)
    .enter()
    .append('circle')
    .classed('passenger', true)
    .attr('r', radius)
    .attr('fill', 'grey')
    .style('fill-opacity', 0.5)
    .attr('cx', () => _.random(0, width))
    .attr('cy', () => _.random(0, height))
    .on('mouseover', (d, i, v) => {
      const cx = v[i].cx.baseVal.value;
      const cy = v[i].cy.baseVal.value;
      canvas.append('text')
        .classed('tooltip', true)
        .text(d.Name)
        .attr('x', cx)
        .attr('y', cy);
    })
    .on('mouseout', () => {
      canvas.selectAll('.tooltip').remove();
    });

  canvas.selectAll('.passenger')
    .filter(d => (d.Sex === 'male'))
    .classed('male', true);

  canvas.selectAll('.passenger')
    .filter(d => (d.Sex === 'female'))
    .classed('female', true);

  canvas.selectAll('.passenger')
    .filter(d => (d.Survived === 'survived'))
    .classed('survived', true);

  canvas.selectAll('.passenger')
    .filter(d => (d.Survived === 'died'))
    .classed('died', true);

  const dance = () => {
    canvas.selectAll('.passenger')
      .transition()
      .duration(5000)
      .ease(d3.easeLinear)
      .attr('cx', () => _.random(0, width))
      .attr('cy', () => _.random(0, height))
  }
  dance();
  window.dance = setInterval(dance, 5000)
}
