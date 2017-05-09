var padding = 50;
var el = document.getElementById('gauge')
var width = el.offsetWidth
var height = 350
var directory_dataset = "data/gauge.csv"
dataset = []
max_score = 100
max_capacity_band = 0
sections = 1500
min_score = 13

d3.csv(directory_dataset, function (error, csv) {
  for(var i=0; i<csv.length;i++){
    dataset.push({
      'age_band': parseInt(csv[i]['age_band']),
      'sex': parseInt(csv[i]['sex']),
      'vehicle_age': parseInt(csv[i]['vehicle_age']),
      'engine_capacity': parseInt(csv[i]['engine_capacity']),
      'score': parseFloat(csv[i]['score'])
    })

    if(dataset[i]['engine_capacity'] > max_capacity_band)
      max_capacity_band = dataset[i]['engine_capacity']

  }

  if (error) {
    console.log("Error while loading the data:\n"+error)
  } else {
    console.log("Data has been loaded.")
    displayGauge()
  }
})

function displayGauge(){
  data = dataset[50]

  quarters = Math.ceil( sections * data['score'] / max_score )
  arcGenerator = d3.arc();
  svgContainer = d3.select("#gauge").append("svg")
                   .attr("width", width)
                   .attr("height", height + padding);


  pathData = []
  pathData.push(arcGenerator({
    startAngle: -0.5 * Math.PI,
    endAngle: 0.5 * Math.PI,
    innerRadius: width/5.8,
    outerRadius: width/4.7,
  }))

  for(var i=0; i<quarters; i++){
    var tmp = data['score'] / max_score
    var end = -0.5
    if(tmp > 1/sections*(i+1))
      end = (-0.5+1/sections*(i+1))
    else{
      end = (-0.5+1/sections*i+1/sections*(tmp-i*1/sections))
    }
    pathData.push(arcGenerator({
      startAngle: (-0.5+1/sections*i) * Math.PI,
      endAngle: end * Math.PI,
      innerRadius: width/5.8,
      outerRadius: width/4.7,
    }))
  }

  svgContainer.selectAll('path')
              .data(pathData)
              .enter()
              .append('path')
            	.attr('d', function(d){
                return d
              })
              .attr("transform", "translate("+width/2+","+width/4+")")
              .style('fill', function(d,i){
                if(i == 0){
                  return 'transparent'
                } else {
                  return getColor(i/sections)
                }
              })
              .attr('stroke-width', function(d,i){
                if(i == 0){
                  return '0.25'
                } else {
                  return '0'
                }
              })
              .attr('stroke', function(d,i){
                if(i == 0){
                  return 'black'
                } else {
                  return 'transparent'
                }
              })
}

function getAgeBandGauge(age){
// # Bins
// # "0 - 15",
// # "16 - 20",
// # "21 - 25",
// # "26 - 35",
// # "36 - 45",
// # "46 - 55",
// # "56 - 65",
// # "66 - 75",
// # "Over 75"]

  if(age<15)
    return -1
  else if(age<21)
    return 4
  else if(age<26)
    return 5
  else if(age<36)
    return 6
  else if(age<46)
    return 7
  else if(age<56)
    return 8
  else if(age<66)
    return 9
  else if(age<76)
    return 10
  else
    return 11
}

function getVehicleAgeBandGauge(age){
  // if v_age == -1:
  //     pass
  // elif v_age <= 5:
  //     v_age = 1
  // elif v_age <=10:
  //     v_age = 2
  // elif v_age <=15:
  //     v_age = 3
  // elif v_age <=20:
  //     v_age = 4
  // else:
  //     v_age = 5

  if(age<5)
    return 1
  else if(age<10)
    return 2
  else if(age<15)
    return 3
  else if(age<20)
    return 4
  else
    return 5
}

function getCapacityBandGauge(capacity){
  var capacities = [500,1000,1200,1500,1800,2000,2200,2500,2700,3000,3500]
  console.log(capacity);
  for(var i=0; i<capacities.length; i++){
    c = capacities[i]

    if(capacity < c){
      return (i)
    }
  }

  return capacities.length - 1
}

function updateGauge(age, gender, vehicle_age, engine_capacity){
  data = {'age_band':getAgeBandGauge(age), 'sex':parseInt(gender), 'vehicle_age':getVehicleAgeBandGauge(vehicle_age), 'engine_capacity':getCapacityBand(engine_capacity), 'score':min_score}

  if(data['age_band'] < 4){
    alert('You must be at least 16 to drive a car!')
  } else {
    if(data['vehicle_age'] < 0){
      alert("The vehicle can't have negative age!")
    } else {
      if(engine_capacity < 50){
        alert("What's your ride? lawn mower!?")
      } else {

      }
    }
  }

  for(var i=0; i<dataset.length; i++){
    d = dataset[i]

    if(d['age_band'] == data['age_band'] && d['sex'] == data['sex'] && d['vehicle_age'] == data['vehicle_age'] && d['engine_capacity'] == data['engine_capacity']){
      data['score'] = d['score']
      break;
    }
  }

  svgContainer.data([]).exit().remove()

  quarters = Math.ceil( sections * data['score'] / max_score )
  arcGenerator = d3.arc();
  svgContainer = d3.select("#gauge").append("svg")
                   .attr("width", width)
                   .attr("height", height + padding);


  pathData = []
  pathData.push(arcGenerator({
    startAngle: -0.5 * Math.PI,
    endAngle: 0.5 * Math.PI,
    innerRadius: width/5.8,
    outerRadius: width/4.7,
  }))

  for(var i=0; i<quarters; i++){
    var tmp = data['score'] / max_score
    var end = -0.5
    if(tmp > 1/sections*(i+1))
      end = (-0.5+1/sections*(i+1))
    else{
      end = (-0.5+1/sections*i+1/sections*(tmp-i*1/sections))
    }
    pathData.push(arcGenerator({
      startAngle: (-0.5+1/sections*i) * Math.PI,
      endAngle: end * Math.PI,
      innerRadius: width/5.8,
      outerRadius: width/4.7,
    }))
  }

  svgContainer.selectAll('path')
              .data(pathData)
              .enter()
              .append('path')
            	.attr('d', function(d){
                return d
              })
              .attr("transform", "translate("+width/2+","+width/4+")")
              .style('fill', function(d,i){
                if(i == 0){
                  return 'transparent'
                } else {
                  return getColor(i/sections)
                }
              })
              .attr('stroke-width', function(d,i){
                if(i == 0){
                  return '0.25'
                } else {
                  return '0'
                }
              })
              .attr('stroke', function(d,i){
                if(i == 0){
                  return 'black'
                } else {
                  return 'transparent'
                }
              })
}

function calcuateRating(){
  var age = document.getElementById('age').value;
  var vehicle_age = document.getElementById('vehicle_age').value;
  var engine_capacity = document.getElementById('engine_capacity').value;
  var dropdown = document.getElementById("gender")
  var gender = dropdown.options[dropdown.selectedIndex].value;

  if(gender != '' && age != '' && vehicle_age != '' && engine_capacity != '' )
    updateGauge(age, gender, vehicle_age, engine_capacity)
  else
    alert("Invalid input, please fill all the fields")
}

function getColor(value){
  var shift = 32
  var hue=((1-value)*120).toString(10);

  if(hue <= shift)
    hue = 0
  else
    hue = hue - shift

  return ["hsl(",hue,",100%,50%)"].join("");
}


// height: 55px;
// width: 150px;
// text-align: center;
// display: inline-block;
