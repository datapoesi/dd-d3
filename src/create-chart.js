import './textures.js';
import { initial_names } from "./index.js";

export const max_bars_shown = 20
const bar_height = 25
const margin = {top: 25, right: 15, bottom: 30, left: 10}
let width = parseInt(d3.select('#d3_chart').style('width'), 10) - margin.left - margin.right
let height = max_bars_shown * bar_height
const y = d3.scaleBand().domain(d3.range(0, max_bars_shown)).range([0, max_bars_shown * bar_height]);
export const x = d3.scaleLinear().domain([0, 100]).range([0, width]);
export let x_axis
export let svg


export function create_chart() {
	svg = d3.select('#d3_chart')
		.append('svg')
		.style('width', (width + margin.left + margin.right) + 'px')
		.style('height', (height + margin.top + margin.bottom) + 'px')
		.append('g').attr('transform', 'translate(' + [margin.left, margin.top] + ')');
		
	x_axis = d3.axisTop(x)
    	.tickFormat(d => d + '%')
		.tickSize(8)
		.tickPadding(5);
	svg.append('g')
		.attr('class', 'x axis top')
		.call(x_axis);
		
	const texture = textures.lines() // of textures.js
		.size(7)
		.strokeWidth(2)
		.stroke("#fff")
		.background("#f0f0f0");
	svg.call(texture);

	let bars = svg.selectAll('.bar')
		.data(initial_names.slice(0, max_bars_shown))
		.enter().append('g')
		.attr('class', 'bar')
    	.attr('transform', (d,i) => 'translate(0,'  + y(i) + ')');
	bars.append('rect')
		.attr('class', 'background')
		.style('fill', texture.url())
    	.attr('height', y.bandwidth())
    	.attr('width', width);
	bars.append('rect')
		.attr('class', 'percent')
		.attr('height', y.bandwidth())
		.attr('width', d => x(d.pct))
	bars.append('text')
		.text(d => d.name)
		.attr('class', 'name')
		.attr('y', y.bandwidth() - 8)
		.attr('x', 10);	
}


window.addEventListener('resize', d3_resize);
function d3_resize() {
	    width = parseInt(d3.select('#d3_chart').style('width'), 10);
	    width = width - margin.left - margin.right;
	    x.range([0, width]);
	    d3.select(svg.node().parentNode)
	        .style('width', (width + margin.left + margin.right) + 'px');
	    svg.selectAll('rect.background')
	        .attr('width', width);
		svg.select('.x.axis.top')
			.call(x_axis);
	    svg.selectAll('rect.percent')
	        .attr('width', data => x(data.pct_adj || data.pct));
}
