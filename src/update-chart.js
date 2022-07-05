/*
	1. The user makes an input change,
	2. the update_chart function is called,
	3. the D3 bar chart is updated to reflect the user's selections.
*/

import { NAMES_MALE, NAMES_FEMALE} from "./index.js";
import { selected_decade, selected_sex, text_input } from "./input-handlers.js";
import { x, svg, x_axis, max_bars_shown } from "./create-chart.js";


export function update_chart() {
	let selected_names = (selected_sex === "M" ? NAMES_MALE : NAMES_FEMALE)
		.filter(d => d.decade == selected_decade)
		.sort((a, b) => b.pct - a.pct)
	let total_pct
	
	if (text_input) {
		selected_names = selected_names.filter(d => d.name
			.toLowerCase()
			.substring(0, text_input.length) == text_input);
		if (selected_names.length) {
			total_pct = d3.sum(selected_names, d => d.pct);
			selected_names.map(d => d.pct_adj = 100 * d.pct / total_pct);
		}
		if (max_bars_shown > selected_names.length) {
			let emptyBars = max_bars_shown - selected_names.length;
			for (let i = 0; i < emptyBars; i++) {
				selected_names.push({ 'name': null, 'pct_adj': 0 })
			}
		} else {
			selected_names = selected_names.slice(0, max_bars_shown)
		}
	} else { 
		total_pct = d3.sum(selected_names, d => d.pct);
		selected_names = selected_names.slice(0, max_bars_shown);
		selected_names.map(d => d.pct_adj = 100 * d.pct / total_pct);
	}

	svg.select('x.axis.top')
		.transition()
		.duration(700)
		.call(x_axis);
	svg.selectAll('.bar')
		.data(selected_names)
		.select(".percent")
		.transition()
		.duration(700)
    	.attr('width', d => x(d.pct_adj));
	svg.selectAll('.bar')
		.select('text')
		.text(d => d.name);
}