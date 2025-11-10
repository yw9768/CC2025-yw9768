// graphs sensor data from an analog 
// sensor on A0 to the window

let port; // object to hold serial port
let c; // button
let sensorValue = 0;


function setup() {
  createCanvas(windowWidth, windowHeight);
  //colors
  colorMode(HSB);
  // create instance of the lib
  port = createSerial();

  // ports can be opened via a dialog after
  // user interaction (see connectBtnClick below)
  c = createButton('Connect to Arduino');
  c.position(10, 10);
  c.mousePressed(connectBtnClick);
}

function draw() {
  background(220, 100, 50);
  // read serial bufffer
  let str = port.readUntil("\n");// "\n" means new line
  // get rid of whitespace
  str.trim();
  // if there's valid data
  if (str.length > 0) {
    sensorValue = str;
  }
  let circleD = map(sensorValue,0,4095,0,width);
  let hue = map(sensorValue, 0, 4095, 0, 360);

  fill(hue, 100,100);

  circle(width/2,height/2,circleD);

  // changes button label based on connection status
  if (!port.opened()) {
    c.html('Connect to Arduino');
  } else {
    c.html('Disconnect');
  }
}
// if the connect button is clicked and there's
// no connection, look for something named
// "Arduino"
function connectBtnClick() {
  if (!port.opened()) {
    port.open('Arduino', 9600);
    
  } else {
    port.close();
  }
}