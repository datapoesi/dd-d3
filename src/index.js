/*
	1. baby-names.tsv is read and initialized,
	2. the input handlers and the d3 chart are created,
	3. and then a few changes to the input controls.
*/

import { create_chart } from "./create-chart.js";
import { create_input_handlers, selected_sex, selected_decade 
} from "./input-handlers.js";

export let NAMES_FEMALE
export let NAMES_MALE
export let initial_names

d3.tsv("src/baby-names.tsv").then(data => {
	data.map(d => d.decade = +d.decade);
	data.map(d => d.pct = +d.pct);
	NAMES_FEMALE = data.filter(d => d.sex === "F")
	NAMES_MALE = data.filter(d => d.sex === "M")
	initial_names = (selected_sex === "F" ? NAMES_FEMALE : NAMES_MALE)
		.filter(d => d.decade == selected_decade)
		.sort((a, b) => b.pct - a.pct)

	create_chart()
	create_input_handlers()

	d3.select("#spinning-loader").remove()
	d3.select(".d3-wrapper").attr('class', "d3-wrapper " + (selected_sex === "F" ? "female-data" : "male-data"))
	d3.select(".decade-selection #decade-value").text(selected_decade + 's')
	d3.select(".decade-selection input").attr('value', selected_decade)
	d3.select("#pronoun01").text(selected_sex === "F" ? "She" : "He")
	d3.select("#pronoun02").text(selected_sex === "F" ? "her" : "his")
	
}).catch(err => console.log(err.message))
