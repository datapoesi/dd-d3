
import { update_chart } from "./update-chart.js";

export let selected_decade = 1920
export let selected_sex = "F"
export let text_input = ''

export function create_input_handlers() {
	// BUTTONS for selecting SEX (MALE/FEMALE)
	d3.selectAll(".sex-selection button").on("click", function() {
		selected_sex = d3.select(this).attr("data-val");
		d3.select(".sex-selection .selected-button").classed("selected-button", false);
		d3.select(this).classed("selected-button", true);
		d3.select("#pronoun01").text(selected_sex === "F" ? "She" : "He")
		d3.select("#pronoun02").text(selected_sex === "F" ? "her" : "his")
		d3.select(".d3-wrapper").attr('class', "d3-wrapper " + (selected_sex === "F" ? "female-data" : "male-data"));
		update_chart();
	});
	// RANGE SLIDER for selecting DECADE
	d3.select(".decade-selection input").on("input", function() {
		selected_decade = this.value;
		d3.select(".decade-selection #decade-value").text(selected_decade + 's')
		update_chart();
	})
	// TEXT INPUT for selecting FIRST LETTERS OF NAME
	d3.select(".text-selection input").on("input", function() {
		text_input = this.value.toLowerCase();
		update_chart();
	});
}

