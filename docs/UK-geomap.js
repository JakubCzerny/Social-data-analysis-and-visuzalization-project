var Colors = ["#ff0000", "#00ff00", "#ff9900", "#ffffff", "#990099", "#0099c6", "#ffff4d"]

//Width and height
var width = 350;
var height = 500;
var padding_y = 50;

var scale = 2500;

var index_data;

//Define projection of UK
var projection = d3.geo.albers()
				.center([0, 55.4])
				.rotate([4.4, 0])
				.parallels([50, 60])
				.scale(scale)
				.translate([width / 2, height / 2]);
			   

//Define default path generator
var path = d3.geo.path().projection(projection);

//Create SVG element
var svg = d3.select("body")
			.append("svg")
			.attr("width", width)
			.attr("height", height);
			
//Load in GeoJSON data
d3.json("uk.geojson", function(error, json) {
	if (error) console.log(error);
	
	//Bind data and create one path per GeoJSON feature
	svg.selectAll("path")
	   .data(json.features)
	   .enter()
	   .append("path")
	   .attr("d", path)
	   .style("fill", "#00001a");
	   //.style("fill", "steelblue");
	
	d3.csv("accident_indexed.csv", function(data){
		
		index_data = data;
		
		svg.selectAll("circle.small")
			.data(data)
			.enter()
			.append("circle")
			.attr("class","small")
			.attr("cx", function(d) {
				   return projection([d.lon, d.lat])[0];
			})
			.attr("cy", function(d) {
				   return projection([d.lon, d.lat])[1];
			})
			.attr("r", 0.5)
			.attr("fill", function(d){
				return Colors[d[2]];
			});
			
			update_points(2);
			
			d3.csv("2_kmeans.csv", function(data){
				list_kmean = []
				for (i = 0; i < 7; i++){
					list_kmean.push( [] )
				}
				data.forEach(function(d){
					list_kmean[d.index - 1].push([d.lat, d.lon, d.color_index]);
				});
				draw_centroids(list_kmean[0]);	
			});
	});
		
});

function update_points(index){
	
	svg.selectAll(".small")
			.data(index_data)
			.transition()
			.duration(500)
			.ease("linear")
			.attr("fill", function(d){
				return Colors[d[index]];
			});

	
}

function update_svgs(index){
	
	update_points(index)
	update_centroids(list_kmean[index - 2]);
	
}

function draw_centroids(data){
	
	svg.selectAll("circle.centroid")
			.data(data)
			.enter()
			.append("circle")
			.attr("class", "centroid")
			.attr("cx", function(d) {
				   return projection([d[1], d[0]])[0];
			})
			.attr("cy", function(d) {
				   return projection([d[1], d[0]])[1];
			})
			.attr("r", 7)
			.style("fill", function(d, i){
				//return Colors[i];
				return Colors[d[2]];
			})
			.attr("stroke-width", "2")
			.attr("stroke", "white");
			
}

function update_centroids(data){
	svg.selectAll(".centroid").remove()
	
	svg.selectAll(".centroid")
			.data(data)
			.enter()
			.append("circle")
			.attr("class","centroid")
			.attr("cx", function(d) {
				   return projection([d[1], d[0]])[0];
			})
			.attr("cy", function(d) {
				   return projection([d[1], d[0]])[1];
			})
			.attr("r", 7)
			.style("fill", function(d, i){
				//return Colors[i];
				return Colors[d[2]];
			})
			.attr("stroke-width", "2")
			.attr("stroke", "white");
}