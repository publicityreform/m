
var key = 'AIzaSyBPv8K2ekj5AyY2zaz1bgvfZoPZPezos94'
var url = 'http://api.metro.net/agencies/lametro/vehicles/?callback=callMetro'

var style = [
  {
    "stylers": [
      {
        "saturation": -45
      }
    ]
  },
  {
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative",
    "elementType": "geometry",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.land_parcel",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "administrative.neighborhood",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "landscape.natural.terrain",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "transit.line",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "transit.station.airport",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit.station.bus",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "transit.station.bus",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "weight": 8
      }
    ]
  },
  {
    "featureType": "transit.station.bus",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "transit.station.rail",
    "stylers": [
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "transit.station.rail",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "on"
      },
      {
        "weight": 8
      }
    ]
  }
]

var w = window.innerWidth;
var h = window.innerHeight+20;

// Options for map
var options = {
  lat: 34.021,
  lng: -118.3,
  zoom: 11,
  styles: style,
  maptype: 'terrain',
}

// Create an instance of Google maps
var mappa = new Mappa('Google', key);
var myMap;

var canvas;
var vehicles;
var lati;
var long;

// var srn = false;

function preload() {
  vehicles = loadJSON(url);
  // setInterval(callMetro, 1000);
}
function setup() {
  canvas = createCanvas(w, h);
//  navigator.geolocation.getCurrentPosition(function(position) {
  //      lati = position.coords.latitude;
    //    long = position.coords.longitude;
       //document.getElementById("text").innerHTML = lati+','+long;
       //document.getElementById("myBtn").addEventListener("click", showRouteNums);
//     });
  // Create a tile map and overlay the canvas on top.
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  // Load the data
  vehicles = loadJSON(url);
  // Only redraw the vehicles when the map change and not every frame.
  myMap.onChange(drawVehicles);
  fill(207, 204, 0, 200);
  noStroke();
  }
/*
function showRouteNums(){
     if (srn = true){
       srn = false;
     }
     else {
       srn = true;
     }
   }
*/

function callMetro() {
  vehicles = loadJSON(url, drawVehicles);
}
// The draw loop is fully functional but we are not using it for now.
function draw() {
//  var posMe = myMap.latLngToPixel(lati, long);
//  fill(0,0,0);
//  rect(posMe.x,posMe.y,20,20);
}

function drawVehicles() {
  // Clear the canvas
  clear();
  // Get how many vehicles total
  var len = vehicles.items.length;
  //document.getElementById("text").innerHTML = len;


  for (var i = 0; i < len; i++) {
    // Get the lat/lng of each vehicle
    var latitude = Number(vehicles.items[i].latitude);
    var longitude = Number(vehicles.items[i].longitude);

    // Only draw them if the position is inside the current map bounds. We use a
    // Google Map method to check if the lat and lng are contained inside of the current
    // map. This way we draw just what we are going to see and not everything. See
    // getBounds() in https://developers.google.com/maps/documentation/javascript/3.exp/reference
    if (myMap.map.getBounds().contains({lat: latitude, lng: longitude})) {
      // Transform lat/lng to pixel position
      var pos = myMap.latLngToPixel(latitude, longitude);

      // Get the time since last update of each vehicle and map to alpha
      var age = vehicles.items[i].seconds_since_report;
      age = map(age, 0, 300, 1, 0);
      // Get the orientation of each vehicle and map to color
      var dir = vehicles.items[i].heading;
      var size = 10 + myMap.zoom();
      colorMode(HSB, 360, 100, 100, 1);
      // Draw the vehicle as an ellipse
      fill(dir, age*100, 100, age);
      ellipse(pos.x, pos.y, size, size);

      // display route number
      fill(dir,100,50,age);
      var line = vehicles.items[i].route_id;
      textAlign(CENTER, CENTER);
      //text(line, pos.x, pos.y);

    }
  }
}
