// Initialize the array to store mouse positions
let mousePositions = [];
const maxPositions = 1000;

// Initialize arrays to store the state for each animated circle
let currentIndices = [];
let direction = [];
let animationSpeed = 0.007;
let t = [];

function setup() {
  // Create the canvas and set the frame rate
  createCanvas(windowWidth, windowHeight);
  frameRate(30);
}

function draw() {
  // Set the background color to white
  background(255);

  // Store the mouse positions when the mouse is pressed
  if (mouseIsPressed) {
    // Add the current mouse position to the array
    mousePositions.push(createVector(mouseX, mouseY));

    // If the array size exceeds maxPositions, remove the oldest position
    if (mousePositions.length > maxPositions) {
      mousePositions.shift();
    }
  }

  // Draw the polyline
  stroke(230); // Set polyline color to black
  strokeWeight(15); // Set polyline stroke weight
  noFill(); // Do not fill the polyline
  beginShape(); // Start drawing the polyline
  for (const pos of mousePositions) {
    vertex(pos.x, pos.y); // Add vertex for each mouse position
  }
  endShape(); // Finish drawing the polyline

  // Animate the ellipses along the path
  for (let i = 0; i < currentIndices.length; i++) {
    // Update the parameter 't' based on the direction and animation speed
    t[i] += direction[i] * animationSpeed;

    // If the ellipse reaches the end of the path, change its direction
    if (t[i] >= 1) {
      t[i] = 1;
      direction[i] = -1;
    } else if (t[i] <= 0) { // If the ellipse reaches the start, change its direction
      t[i] = 0;
      direction[i] = 1;
    }

    // Calculate the ellipse position along the path based on the parameter 't'
    const ellipsePos = getPointOnPath(t[i]);

    // Set the ellipse color to red and remove the stroke
    fill(0);
    noStroke();

    // Draw the ellipse at the calculated position
    ellipse(ellipsePos.x, ellipsePos.y, 15, 15);

    // Draw lines between ellipses if they are farther than 100 pixels apart
    if (i > 0) {
      const prevEllipsePos = getPointOnPath(t[i - 1]);
      const distanceBetweenEllipses = dist(
        ellipsePos.x, ellipsePos.y, prevEllipsePos.x, prevEllipsePos.y
      );
      if (distanceBetweenEllipses > 100) {
        strokeWeight(1); // Set polyline stroke weight
        stroke(0); // Set line color to black
        line(
          ellipsePos.x, ellipsePos.y, prevEllipsePos.x, prevEllipsePos.y
        );
      }
    }
  }
}

// Function to get the point on the path based on parameter 't'
function getPointOnPath(t) {
  // Calculate the index of the first point for interpolation
  const index = floor(t * (mousePositions.length - 1));

  // Get the two points for interpolation
  const pos1 = mousePositions[index];
  const pos2 = mousePositions[index + 1];

  // Calculate the interpolation amount between the two points
  const lerpAmount = (t * (mousePositions.length - 1)) % 
// Return the interpolated point
1;
return p5.Vector.lerp(pos1, pos2, lerpAmount);
}

// Function to handle key presses
function keyPressed() {
if (keyCode === UP_ARROW) {
// Add an animated ellipse when the up arrow key is pressed
addAnimatedEllipse();
} else if (keyCode === DOWN_ARROW) {
// Remove an animated ellipse when the down arrow key is pressed
removeAnimatedEllipse();
} else if (keyCode === 32) { // Space bar key code
// Reset the canvas when the space bar is pressed
resetCanvas();
}
}

// Function to add an animated ellipse
function addAnimatedEllipse() {
// Add initial values for the new animated ellipse
currentIndices.push(0);
direction.push(1);
t.push(0);
}

// Function to remove an animated ellipse
function removeAnimatedEllipse() {
// Remove the last animated ellipse's values if there are any ellipses
if (currentIndices.length > 0) {
currentIndices.pop();
direction.pop();
t.pop();
}
}

// Function to reset the canvas
function resetCanvas() {
// Clear the mouse positions array
mousePositions = [];

// Clear the animated circles' state arrays
currentIndices = [];
direction = [];
t = [];
}