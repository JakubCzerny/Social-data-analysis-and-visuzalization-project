//Width and height
			//Width and height
			var margin = {top: 20, right: 80, bottom: 45, left: 60},
				w = 957 - margin.left - margin.right,
				h = 547 - margin.top - margin.bottom;
				
			var padding = 40;
			var dataset;
			d3.csv("hours.csv", function(error, data) {

				if (error) {  //If error is not null, something went wrong.
					console.log(error);  //Log the error.
				} 
				else {      //If no error, the file loaded correctly. Yay!
					//console.log(data);   //Log the data.

				dataset = data.map(function(d){
						return +d.Count ;
					});
				}
			
				
			// add the tooltip area to the webpage
			var tooltip = d3.select("#testplot").append("div")
							.attr("class", "tooltip")
							.style("opacity", 0);
			
			var xScale = d3.scale.ordinal()
							.domain(d3.range(dataset.length))
							.rangeRoundBands([0, w], 0.05);

			var yScale = d3.scale.linear()
							.domain([0, d3.max(dataset)])
							.range([h, 0]);
							
			//Define X axis
			var xAxis = d3.svg.axis()
							  .scale(xScale)
							  .orient("bottom")
							  .tickFormat(function(d) { return d + ":00"; })
							  .ticks(24,"%");

			//Define Y axis
			var yAxis = d3.svg.axis()
							  .scale(yScale)
							  .orient("left")
							  .ticks(15);
			
			//Create SVG element
			var plot_svg = d3.select("#testplot")
						.append("svg")
							.attr("viewBox", "0 0 947 400")
							.attr("preserveAspectRatio", "xMinYMin meet")
						.append("g")
							.attr("transform", "translate(" + margin.left + "," + margin.top + ")");;

			//Create bars
			plot_svg.selectAll(".bar")
			   .data(dataset)
			   .enter()
			   .append("rect")
			   .attr("class", "bar")
			   .transition()
			   .duration(500)
			   .delay(function(d, i) {
					return i / dataset.length * 1000;
				})
			   .attr("x", function(d, i) {
			   		return xScale(i);
			   })
			   .attr("y", function(d) {
			   		return yScale(d);
			   })
			   .attr("width", xScale.rangeBand())
			   .attr("height", function(d) {
			   		return (yScale(0)-yScale(d));
			   })
			   .attr("fill", function(d) {
					return "rgb(0, 0, " + d/170 + ")";
			   });
			   
			plot_svg.append("g")
					.attr("class", "x axis")
					.attr("transform", "translate(0," + h + ")")
					.call(xAxis)
				.append("text")
					.attr("class", "label")
					.attr("x", w/2)
					.attr("y", 35)
					.style("text-anchor", "middle")
					.text("Hour of the Day");

			plot_svg.append("g")
					.attr("class", "y axis")
					.call(yAxis)
				.append("text")
				.attr("class", "label")
				.attr("transform", "rotate(-90)")
				.attr("y", 6)
				.attr("dy", ".71em")
				.style("text-anchor", "end")
				.text("#Accidents");

			d3.selectAll(".bar")
				.on("mouseover", function(d) {
					d3.select(this)
						.attr("fill", "orange");
						
					tooltip.transition()
							.duration(200)
							.style("opacity", 1)
							.style("color", "white")
							.style("font-weight", "bold")
							.style("text-shadow", "-1px -1px 0 #000, 1px -1px 0 #000,-1px 1px 0 #000, 1px 1px 0 #000")
							.attr("font-size", "11px");
					tooltip.html(d)
							.style("left", (d3.event.pageX + 1) + "px")
							.style("top", (d3.event.pageY - 58) + "px");
				})
				.on("mouseout", function(d) {
				
					d3.select(this)
						.transition()
						.duration(250)
						.attr("fill", "rgb(0, 0, " + (d/170) + ")");
	  
					tooltip.transition()
							.duration(500)
							.style("opacity", 0);
				});
	
		//}
		});