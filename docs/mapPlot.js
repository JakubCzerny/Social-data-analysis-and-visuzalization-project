var padding = 50;
var el = document.getElementById('map')
var width = map.offsetWidth
var height = 880;
var width_hour = (window.innerWidth-120)/24

var path = d3.geoPath();
var directory_dataset = "data/accidents_loc_time2.csv"
var directory_map = 'data/uk-map-countries.geojson'

dataset = {}
for(var i=0; i<24; i++){
  dataset[i] = []
}
map  = null
hour = 7
total_accidents = 0
interval = 1000

d3.json(directory_map, function (error, json) {
  if (error) {
    console.log("Error while loading the map:\n"+error)
  } else {
    console.log("Map has been loaded.")
    map = json

    d3.csv(directory_dataset, function (error, csv) {

      for(var i=0; i<csv.length;i++){
        var hour = parseInt(Number(csv[i]['hour']))
        dataset[hour].push({
          'count': parseInt(csv[i]['count']),
          'lat': parseFloat(csv[i]['lat']),
          'lon': parseFloat(csv[i]['lon'])
        })
        total_accidents = total_accidents + parseInt(csv[i]['count'])
      }

      if (error) {
        console.log("Error while loading the data:\n"+error)
      } else {
        console.log("Data has been loaded.")
        plotMap()
        window.setInterval(updateMap, interval);
      }
    })
  }
});


var plotMap = function(){
  projection = d3.geoMercator().fitSize([width, height], map)
  data = dataset[hour]

  path.projection(projection)

  svgContainer = d3.select("#map").append("svg")
                   .attr("width", width)
                   .attr("height", height + padding);

  svgContainerRectangle = d3.select('#bar').append('svg')
                                           .attr('x',0)
                                           .attr('y',100)
                                           .attr("width", window.innerWidth-70)
                                           .attr("height", 25)
                                           .style('fill', '#b8dced')

   svgContainerRectangle.append("rect")
                         .attr("x", 50)
                         .attr("y", 0)
                         .attr("width", window.innerWidth-120)
                         .attr("height", 25)
                         .attr('stroke-width', '1')
                         .attr('stroke', 'black')
                         .attr('rx', 8)
                         .attr('ry', 8)
                         .style('fill', 'white')

  svgContainerRectangle.append("rect")
                         .attr("x", width_hour*hour)
                         .attr("y", 0)
                         .attr("width", width_hour)
                         .attr("height", 25)
                         .attr('stroke-width', '1')
                         .attr('stroke', 'black')
                         .attr("id", "hour-rect")
                         .attr('rx', 8)
                         .attr('ry', 8)
                         .style("fill", "steelblue")

  svgContainerRectangle.append("text")
                         .attr("x", width_hour*hour+width_hour/2)
                         .attr("y", 20)
                         .attr("width", width_hour)
                         .attr("height", 25)
                         .attr("class", "hour")
                         .style('fill', 'white')
                         .style("font-size","20px")
                         .style('font-weight', 900)
                         .style("text-anchor", "middle")
                         .text(hour)
                         .attr("id", "hour-text")

  svgContainer.selectAll("path")
              .data(map.features)
              .enter()
              .append("path")
              .attr("d", path)
              .style('fill', 'white')


  circlesGeo = svgContainer.selectAll("circle")
                        .data(data)
                        .enter()
                        .append("circle")
                        .attr("cx", function(d) {
                          return projection([d['lon'],d['lat']])[0]
                         })
                        .attr("cy", function(d) {
                          return projection([d['lon'],d['lat']])[1]
                        })
                        .attr("r", function(d) {
                          return d['count']/total_accidents*24*365*10;
                        })
                        .attr("fill", "steelblue")
                        .attr('stroke-width', '0.2')
                        .attr('stroke', 'black')
}

function updateMap(){
  hour = (hour + 1) % 24
  data = dataset[hour]

  circlesGeo = svgContainer.selectAll("circle").remove()
                          .data(data)
                          .enter()
                          .append('circle')
                          .attr("cx", function(d) {
                            return projection([d['lon'],d['lat']])[0]
                           })
                          .attr("cy", function(d) {
                            return projection([d['lon'],d['lat']])[1]
                          })
                          .attr("r", function(d) {
                            return d['count']/total_accidents*24*365*10;
                          })
                          .attr('fill', 'steelblue')
                          .attr('stroke-width', '0.2')
                          .attr('stroke', 'black')

  svgContainerRectangle.selectAll('#hour-rect')
                       .transition()
                       .duration(interval/2)
                       .attr("x", (width_hour*hour+50))
                       .style("fill", "steelblue")

   svgContainerRectangle.selectAll('#hour-text')
                        .transition()
                        .duration(interval/2)
                        .attr("x", width_hour*hour+width_hour/2+50)
                        .text(hour)
}
