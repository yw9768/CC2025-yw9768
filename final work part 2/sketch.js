let santaX = 0;
let santaY = 0;

// Global variables to store Santa's current emotion state and how strong that emotion is
let currentEmotion = "neutral";
let currentIntensity = 0;

// ML5 variables for face tracking
let video;
let faceMesh;
let faces = [];
let options = { maxFaces: 1, refineLandmarks: false, flipped: true };

function preload() {
  faceMesh = ml5.faceMesh(options);
}

function setup() {
  createCanvas(windowWidth, windowHeight);
  rectMode(CENTER);
  textAlign(CENTER, CENTER);
  noStroke();

  video = createCapture(VIDEO);
  video.size(640, 480);
  video.hide();

  faceMesh.detectStart(video, gotFaces);

  // Initialize Santa's position to the center of the canvas
  santaX = width / 2;
  santaY = height / 2;
}

function gotFaces(results) {
  faces = results;
}

function draw() {
  drawBackground(); // Draw the colorful background
  updateSantaLogic();//Calculate Santa's position and emotion based on face location
  drawSanta(currentEmotion, currentIntensity);//Draw Santa with the current emotion and intensity
}

// Update Santa's emotion and position based on face tracking
function updateSantaLogic() {
  // Reset to default values
  currentEmotion = "neutral";
  currentIntensity = 0; 
  
  let cx = width / 2;
  let cy = height / 2;

  // Check if we detected any faces
  if (faces.length > 0) {
    let face = faces[0];// Get the first detected face
    
    // Use the nose tip position to control Santa's movement
    let nose = face.keypoints[4]; 

    // Map the video coordinates to canvas coordinates (scale up to fit the whole screen)
    let targetX = map(nose.x, 0, video.width, 0, width);
    let targetY = map(nose.y, 0, video.height, 0, height);
    
    //Here i use lerp to smooth out the movement to reduce shaking 
    santaX = lerp(santaX, targetX, 0.1);
    santaY = lerp(santaY, targetY, 0.1);

    // Calculate how far Santa is from the center
    let d = dist(santaX, santaY, cx, cy);

    //Define the neutral zone radius=100
    let center = 100;

    // Decide emotion based on position
    if (d < center) {
      currentEmotion = "neutral";// Face is in the center area - show neutral expression
      currentIntensity = 0;// And here no change in expression
    } else {
      // Determine which quadrant the face is in
      if (santaX < cx && santaY < cy) currentEmotion = "angry"; // Top left quadrant: angry
      else if (santaX >= cx && santaY < cy) currentEmotion = "happy"; // Top right quadrant: happy
      else if (santaX < cx && santaY >= cy) currentEmotion = "sad";   // Bottom left quadrant: sad
      else currentEmotion = "calm";  // Bottom right quadrant: calm
      
      // Calculate emotion intensity (farther from center = stronger emotion)
      currentIntensity = map(d, center, width/2, 0, 1, true);
    }
  }
}

// Draw the colorful background with 4 different colors
function drawBackground() {
  noStroke();
  let cx = width / 2;
  let cy = height / 2;

  fill(220, 210, 230); rect(cx/2, cy/2, cx, cy); // Top left corner (Angry zone)        
  fill(255, 245, 200); rect(cx + cx/2, cy/2, cx, cy); // Top right corner (Happy zone)   
  fill(200, 220, 240); rect(cx/2, cy + cy/2, cx, cy); // Bottom left corner (Sad zone)   
  fill(215, 235, 215); rect(cx + cx/2, cy + cy/2, cx, cy); // Bottom right corner (Calm zone)

  // Draw emotion labels in each quadrant
  fill(0, 50); 
   textSize(48); 
   text("ANGRY", cx / 2, cy / 2); // Top left center
   text("HAPPY", cx + cx / 2, cy / 2); // Top right center
   text("SAD", cx / 2, cy + cy / 2);  // Bottom left center
   text("CALM", cx + cx / 2, cy + cy / 2); // Bottom right center

  // Draw the white cross lines in the middle
  stroke(255, 150);
  strokeWeight(4);
  line(cx, 0, cx, height);// Vertical line
  line(0, cy, width, cy);// Horizontal line
}

 // Start drawing Santa with different emotions
 function drawSanta(emotion, intensity) {
  push();
  
  // Add shaking effect when angry
  let shakeX = 0;
  let shakeY = 0;
  if (emotion == "angry") {
    let shakeAmount = intensity * 10; // Calculate shake strength based on intensity（more intense = more shaking）
    // Randomly shake within this range
    shakeX = random(-shakeAmount, shakeAmount);
    shakeY = random(-shakeAmount, shakeAmount);
  }

   // Move the entire coordinate system to Santa's position
  translate(santaX + shakeX, santaY + shakeY); 
  scale(1.2); // Make Santa a bit bigger

  //draw the hat
  fill(220, 40, 40);
  noStroke();
  
  beginShape();
  curveVertex(60, -40); 
  curveVertex(60, -40);  // the starting point at the lower right corner
  curveVertex(40, -90);  // turn up on the right
  curveVertex(0, -110);  // The highest point of the hat
  curveVertex(-50, -90); // Bend upwards on the left
  curveVertex(-90, -40); // last point at the lower left corner
  curveVertex(-90, -40); 
  endShape();

  // The ball on the hat
  fill(255);
  ellipse(-90, -40, 28, 28);

  // draw the face
  fill(255, 220, 200);
  noStroke();
  ellipse(0, 0, 120, 120);

  //draw the full beard beneath the face
  fill(245, 245, 250);
  noStroke();
  beginShape();
  curveVertex(-60, 0);
  curveVertex(-60, 0);  
  curveVertex(-65, 50); // Left side curves outward
  curveVertex(-40, 90); // Left bottom
  curveVertex(0, 105); // Bottom center (lowest point)
  curveVertex(40, 90); // Right bottom
  curveVertex(65, 50); // Right side curves outward
  curveVertex(60, 0);   
  curveVertex(60, 0);     
  endShape();

  //The small whiskers on both sides of the nose
  fill(255);
  arc(-20, 20, 40, 30, PI + 0.5, 0); //left one
  arc(20, 20, 40, 30, PI, -0.5); //right one  


  // Draw eyebrows (shape changes based on emotion)
  noFill();
  stroke(240);// Light gray color
  strokeWeight(6);
  
  if (emotion == "happy") { // Happy eyebrows: curved upward, stronger curve when more intense
    let arch = 35 + intensity * 15; // Base curve is 35
    arc(-25, -35, 30, arch, PI, 0); 
    arc(25, -35, 30, arch, PI, 0);
  
  } 
  else if (emotion == "angry") { // Angry eyebrows: angled downward toward center (V shape)
    let slope = 12 + intensity * 15;
    line(-40, -35 - slope, -5, -25);// -35 is the base eyebrow height
    line(5, -25, 40, -35 - slope);

  } else if (emotion == "sad") {
  // Sad eyebrows: drooping downward (upside-down V)
  line(-40, -30, -5, -35); // Left brow (lower outside, higher inside)
  line(5, -35, 40, -30);   // Right brow (higher inside, lower outside)
  } 
  else {
    // Neutral eyebrows: straight lines
    line(-40, -35, -10, -35); 
    line(10, -35, 40, -35); 
  }

  // Draw eyes and cheeks
  if (emotion == "calm") { // Add pink blush when calm
    noStroke();
    fill(255, 150, 180, 100); //pink color
    ellipse(-35, -5, 25, 15); // Left blush
    ellipse(35, -5, 25, 15);  // Right blush
  }

  if (emotion == "happy") {// Happy eyes: curved upward smiling eyes
    noFill();
    stroke(0);
    strokeWeight(4);
    let curve = 12 + intensity * 10; // Curve gets stronger with intensity
    arc(-25, -15, 20, curve, PI, 0); // Left eye
    arc(25, -15, 20, curve, PI, 0);  // Right eye
   
  } 
  else if (emotion == "sad") { // Sad eyes: drooping downward
    noFill();
    stroke(0);
    strokeWeight(4);
    let droop = intensity * 6;
    line(-32, -12 + droop, -18, -18 + droop); // Left eye drooping
    line(18, -18 + droop, 32, -12 + droop); // Right eye drooping
    noStroke();
    fill(150, 200, 255); // Light blue color
    // Draw little tears
    ellipse(-32, -12 + droop + 3, 5, 5); // Left tear
    ellipse(32, -12 + droop + 3, 5, 5); // Right tear

  }
  else if (emotion == "angry") { // Angry eyes: wide open with small pupils
    noStroke();
    fill(255);// White part of eyes
    let eyeSize = 18 + intensity * 8;// Eye size gets bigger with intensity
    ellipse(-25, -15, eyeSize, eyeSize);// Left eye
    ellipse(25, -15, eyeSize, eyeSize);// Right eye
    fill(0);

    // Black pupils (fixed size)
    let pupilSize = 5; 
    ellipse(-25, -15, pupilSize, pupilSize);// Left pupil
    ellipse(25, -15, pupilSize, pupilSize);// Right pupil

    // Add eyelid effect (skin-colored rectangle covering top of eyes)
    fill(255, 220, 200); // Skin color
    rect(-25, -25, 25, 10);// Left eyelid
    rect(25, -25, 25, 10);// Right eyelid

  }
  else if (emotion == "calm") { // Calm eyes: gradually change from straight line to gentle downward curve
    noFill();
    stroke(0);
    strokeWeight(4);
    let curveHeight = intensity * 12; // Starts as straight line, then curves downward
    arc(-25, -15, 18, curveHeight, 0, PI); // Left eye
    arc(25, -15, 18, curveHeight, 0, PI); // Right eye
  }

  else { // Neutral: simple black dot eyes
    noStroke();
    fill(0);
    ellipse(-25, -15, 12, 15);// Left eye
    ellipse(25, -15, 12, 15);// Right eye
    // Tiny white dots to make eyes shiny
    fill(255);
    ellipse(-23, -17, 4, 4);// Left eye highlight
    ellipse(27, -17, 4, 4);// Right eye highlight
  }


  // Draw mouth (shape changes based on emotion)
  stroke(180, 100, 100);
  strokeWeight(3);
  noFill();

  if (emotion == "happy") {// Happy mouth: upward curved smile
    let curve = 20 + intensity * 30;// Curve gets stronger with intensity
    arc(0, 30, 30, curve, 0, PI);

  } else if (emotion == "sad") {// Sad mouth: downward curved frown
    let curve = 20 + intensity * 30;
    arc(0, 45, 30, curve, PI, 0);

  } else if (emotion == "angry") {// Angry mouth: jagged shaking line
    beginShape();
    let shake = intensity * 5;// Shake amount
    vertex(-15, 40); // Left corner of mouth
    // Middle vertices shake randomly to create jagged appearance
    vertex(-5, 35 + random(-shake, shake)); // Left-middle 
    vertex(5, 45 + random(-shake, shake)); // Right-middle 
    vertex(15, 40);// Right corner of mouth
    endShape();

  } else if (emotion == "calm") {// Calm mouth: gradually changes from straight line to gentle smile
    let curve = intensity * 15; // Curve strength increases with distance
    arc(0, 35, 20, curve, 0, PI);

  } else {// Neutral mouth: simple straight line
    line(-15, 35, 15, 35);
  }

  // White fuzzy part at bottom of hat
  fill(255);
  noStroke();
  rect(0, -50, 130, 30, 15); 

  // draw nose
  fill(240, 160, 160);
  ellipse(0, 10, 18, 18);

  pop();
}