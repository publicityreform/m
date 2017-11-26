
var mapimg;

var url = 'http://api.metro.net/agencies/lametro/vehicles/'

var clon = -118.25;
var clat = 34;

var ww = 1024;
var hh = 512;

var zoom = 10;
var vehicles;

function preload() {
  mapimg = loadImage('https://api.mapbox.com/styles/v1/mapbox/dark-v9/static/' +
    clon + ',' + clat + ',' + zoom + '/' +
    ww + 'x' + hh +
    '?access_token=pk.eyJ1IjoiY29kaW5ndHJhaW4iLCJhIjoiY2l6MGl4bXhsMDRpNzJxcDh0a2NhNDExbCJ9.awIfnl6ngyHoB3Xztkzarw');
  vehicles = loadJSON(url,drawData);
  setInterval(callMetro, 1000);
}

function callMetro(){
vehicles = loadJSON(url,drawData);
}

function mercX(lon) {
  lon = radians(lon);
  var a = (256 / PI) * pow(2, zoom);
  var b = lon + PI;
  return a * b;
}

function mercY(lat) {
  lat = radians(lat);
  var a = (256 / PI) * pow(2, zoom);
  var b = tan(PI / 4 + lat / 2);
  var c = PI - log(b);
  return a * c;
}


function setup() {
  createCanvas(ww, hh);
  translate(width / 2, height / 2);
  imageMode(CENTER);
  image(mapimg, 0, 0);
  var cx = mercX(clon);
  var cy = mercY(clat);

  for (var i = 1; i < vehicles.items.length; i++) {
    var lat = vehicles.items[i].latitude;
    var lon = vehicles.items[i].longitude;
    var x = mercX(lon) - cx;
    var y = mercY(lat) - cy;
    stroke(255, 0, 255);
    fill(255, 0, 255, 200);
    ellipse(x, y, 10, 10);

  }

}

function drawData() {

}
