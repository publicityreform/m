var url = 'http://api.metro.net/agencies/lametro/vehicles/'
var dots = [];



function setup() {
  createCanvas(1000, 600);
  vehicles = loadJSON(url,drawData,'jsonp');
  setInterval(callMetro, 1000);

}

function callMetro(){
vehicles = loadJSON(url,drawData,'jsonp');
}

function drawData() {

  // Get the loaded JSON data
  // console.log(vehicles); // inspect the loaded JSON
  clear()
  var len = vehicles.items.length;
  document.getElementById("text").innerHTML = len;

  for (var i=0; i<len; i++) {

    lat = vehicles.items[i].latitude;
    lon = vehicles.items[i].longitude;
    x = map(lon, -119, -117.5, 0, width);
    y = map(lat, 33.7, 34.3, 0, height);
    diameter = 10;

    noFill();
    stroke(0,0,255);
    ellipse(x, y, diameter, diameter);
  }

}

var map;
function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: 34.0, lng: -118.25},
    mapTypeId: 'roadmap'
  });

  // Create a <script> tag and set the USGS URL as the source.
  var script = document.createElement('script');

  // This example uses a local copy of the GeoJSON stored at
  // http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/2.5_week.geojsonp
  script.src = 'https://developers.google.com/maps/documentation/javascript/examples/json/earthquake_GeoJSONP.js';
  document.getElementsByTagName('head')[0].appendChild(script);

  map.data.setStyle(function(feature) {
    var magnitude = feature.getProperty('mag');
    return {
      icon: getCircle(magnitude)
    };
  });
}

function getCircle(magnitude) {
  return {
    path: google.maps.SymbolPath.CIRCLE,
    fillColor: 'red',
    fillOpacity: .2,
    scale: Math.pow(2, magnitude) / 2,
    strokeColor: 'white',
    strokeWeight: .5
  };
}

function eqfeed_callback(results) {
  map.data.addGeoJson(results);
}
