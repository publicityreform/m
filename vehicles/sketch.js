var url = 'https://api.metro.net/agencies/lametro/vehicles/?callback=drawData';
var len, vehicles, canvas, myLat, myLon, myPos, myMap, n,t,c,longitude,latitude,pos,vPos,angle;
var heading;
var True = true;
var vehiclearray=[];
var key = 'AIzaSyBPv8K2ekj5AyY2zaz1bgvfZoPZPezos94';
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
  var tm = 0;
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


function setup() {
  geoLocate();
  canvas = createCanvas(w, h);
  loadJSON(url, "jsonp",drawData);
  strokeWeight(5.0);
 stroke(255, 100);
    // Create a tile map and overlay the canvas on top.
}

function drawData(analysis){
  heading = createVector();
  myMap = mappa.tileMap(options);
  myMap.overlay(canvas);
  // how many vehicles were detected?
  len = analysis.items.length;
  console.log(len);
  vehicles = analysis;
  // for each item...
  for (var i = 0; i < len; i++) {
    vehiclearray.push(new Vehicle(i));
  }
   // Only redraw the vehicles when the map change and not every frame.
  myMap.onChange(drawVehicles);
}

function geoLocate() {
  navigator.geolocation.getCurrentPosition(showPosition);
  function showPosition(position) {
    myLat  = position.coords.latitude;
    myLon = position.coords.longitude;
    drawMe();
  }
}

function drawMe(){
  myPos = myMap.latLngToPixel(myLat, myLon);
  //fill(0);
//  ellipse(myPos.x, myPos.y, 20,20);

drawTarget(myPos.x, myPos.y, 20,100);
}

function drawTarget(xloc, yloc, size, num) {
  var grayvalues = 255/num;
  var steps = size/num;
  for (var i = 0; i < num; i++) {
    fill(i*grayvalues);
    ellipse(xloc, yloc, size - i*steps, size - i*steps);
  }
}

function drawVehicles(){
  clear();
  drawMe();

  for (let i=0;i<len; i++){
  vehiclearray[i].render(i);
  vehiclearray[i].move(i);
  }


}
function draw(){
tm = tm+=1;



    // Clear the canvas everytime the map moves
//  if (vehicles){
  //  drawVehicles();
    /*
    //add a label
    if (dist(mouseX,mouseY,pos.x, pos.y)<=20){
    c=color(0,255,255,255-n);
    fill(c);
    textAlign(RIGHT, CENTER);
  	text(t, pos.x-10, pos.y);
    }
  */
//  }
/*
  else {
    text("collecting buses.... please wait", width/2, height/2);
    return;
    }
    */
}

function Vehicle(i){

  // how many seconds since last report?
  this.n = vehicles.items[i].seconds_since_report;
  // what's the route id?
  //this.t = vehicles.items[i].route_id;
  //map seconds since last report to opacity
  this.c = color(255, 153, 0, 255-this.n);
  // Get the lat/lng of each vehicle
  this.latitude = Number(vehicles.items[i].latitude);
  this.longitude = Number(vehicles.items[i].longitude);

  // method to draw the bus as a dot
  this.render=function(i){

  // Only draw them if the position is inside the current map bounds. We use a
  // Google Map method to check if the lat and lng are contained inside of the current
  // map. This way we draw just what we are going to see and not everything. See
  // getBounds() in https://developers.google.com/maps/documentation/javascript/3.exp/reference
   if (myMap.map.getBounds().contains({lat: this.latitude, lng: this.longitude})) {
     // Transform lat/lng to pixel position
     this.pos = myMap.latLngToPixel(this.latitude, this.longitude);
     this.vPos = createVector(this.pos.x, this.pos.y);
     this.rangle= Number(vehicles.items[i].heading);
     this.angle = radians(Number(vehicles.items[i].heading));
     this.heading = p5.Vector.fromAngle(this.angle);
     this.vPos.add(this.heading);



    //draw ellipses to represent buses
    fill(0,this.n);
    noStroke();
    //ellipse(this.vPos.x, this.vPos.y, 10, 10);
    if (this.vPos.x<myPos.x&&this.vPos.y>myPos.y&&this.rangle<90&&this.rangle>0){
  fill(200,100,0,this.n);
    };
    if (this.vPos.x>myPos.x&&this.vPos.y>myPos.y&&this.rangle>270&&this.rangle<360){
    fill(200,100,0,this.n)
    };
 if (this.vPos.x>myPos.x&&this.vPos.y<myPos.y&&this.rangle>180&&this.rangle<270){
  fill(200,100,0,this.n)
    };
    if (this.vPos.x<myPos.x&&this.vPos.y<myPos.y&&this.rangle>90&&this.rangle<180){
    fill(200,100,0,this.n)
    };

var lineX, lineY;

lineX = this.vPos.x - (cos(this.angle) * 10);
lineY = this.vPos.y - (sin(this.angle) * 10);


//ellipse(lineX, lineY, 20, 20);


//print(this.angle);
push();
translate(lineX, lineY);
rotate(this.angle);
stroke(0,0,255,this.n);
//line(0,0,20,0);


noStroke();
triangle(0, 10, 5, -10, 10, 10);
pop();
}
}


  // method to move the dots in the direction of the bus's heading
  this.move=function(){


    }
}
/*
x,y,angle
x,y

*/
