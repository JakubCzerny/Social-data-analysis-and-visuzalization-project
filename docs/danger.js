var padding = 0;
var el = document.getElementById('danger')
var width = el.offsetWidth
var height = 600;
var directory_dataset_danger = "data/danger.csv"
dataset_danger = []
max_capacity_band = 0

d3.csv(directory_dataset_danger, function (error, csv) {
  for(var i=0; i<csv.length;i++){
    // console.log(csv[i]);
    dataset_danger.push({
      'age_band': parseInt(csv[i]['age_band']),
      'sex': parseInt(csv[i]['sex']),
      'v_type': parseInt(csv[i]['v_type']),
      'brand': parseInt(csv[i]['brand']),
      'v_age': parseInt(csv[i]['v_age']),
      'road_surf': parseInt(csv[i]['road_surf']),
      'light_cond': parseInt(csv[i]['light_cond']),
      'weather': parseInt(csv[i]['weather']),
      'severity': parseInt(csv[i]['severity']),
      'engine_capacity': parseInt(csv[i]['engine_capacity']),
    })

    if(dataset_danger[i]['engine_capacity'] > max_capacity_band)
      max_capacity_band = dataset_danger[i]['engine_capacity']
  }

  if (error) {
    console.log("Error while loading the data:\n"+error)
  } else {
    console.log("Data has been loaded.")
  }
})

function estimateDanger(){
  var age = getAgeBand(document.getElementById('age_danger').value);
  // var vehicle_age = document.getElementById('vehicle_age').value;
  // var engine_capacity = document.getElementById('engine_capacity').value;
  var vehicle_age = 3
  var engine_capacity = getCapacityBand(1750)
  var dropdownG = document.getElementById("gender_danger")
  var dropdownB = document.getElementById("brand")
  var dropdownW = document.getElementById("weather")
  var dropdownR = document.getElementById("road_surf")
  var dropdownL = document.getElementById("light")
  var dropdownV = document.getElementById("vehicle")
  var gender = dropdownG.options[dropdownG.selectedIndex].value;
  var brand  = dropdownB.options[dropdownB.selectedIndex].value;
  var light  = dropdownL.options[dropdownL.selectedIndex].value;
  var road   = dropdownR.options[dropdownR.selectedIndex].value;
  var weather= dropdownW.options[dropdownW.selectedIndex].value;
  var vehicle= dropdownV.options[dropdownV.selectedIndex].value;

  updateBar(parseInt(age), parseInt(gender), parseInt(vehicle_age), parseInt(engine_capacity), parseInt(brand), parseInt(light), parseInt(road), parseInt(weather), parseInt(vehicle))
}

function updateBar(age, gender, vehicle_age, engine_capacity, brand, light, road, weather, vehicle){
  console.log(age, engine_capacity, brand, vehicle_age, vehicle, gender, road,  light, weather)
  severity = 0
  console.log(dataset_danger[0]);
  for(var i=0; i<dataset_danger.length; i++){
    d = dataset_danger[i]
    if(d['age_band']==age && d['sex']==gender && d['v_age']==vehicle_age && d['engine_capacity']==engine_capacity &&
  d['brand']==brand && d['light_cond']==light && d['road_surf']==road_surf && d['weather']==weather && d['v_type']==vehicle){
      severity = d['severity']
      break;
    }
  }

  console.log(severity);
}


function getAgeBand(age){
  var step = 3

  if(age<16)
    return -1
  else if(age<75)
    return parseInt(age/step)
  else
    return parseInt(75/step)+1
}

function getVehicleAgeBand(age){
  if( age >=0 && age <= 20)
    return parseInt(age%2)
  else
    return 10
}

function getCapacityBand(capacity){
  var capacities = [500,1000,1200,1500,1800,2000,2200,2500,2700,3000,3500]

  for(var i=0; i<capacities.length; i++){
    c = capacities[i]

    if(capacity <= c){
      return (i)
    }
  }
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
