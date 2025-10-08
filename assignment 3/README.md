## Bloom Rings
design:
I envision giving up pointers and numbers and letting time grow into a flower. The outer petals' pulsate 'once per second. The color of the center circle switches every minute, more like an emotional change. The background slowly shifts between day and night according to the hour, echoing the physiological rhythm. I want to express a sense of time flow and life through the entire Bloom Rings.

#### Time Mapping (Functions prepare to used)
second() → Outer Pulse
minute() → Middle Color
hour() + map() → Background


#### Process
1. Sketching 
I drew concentric “rings” of petals, decided that speedy, rhythmic changes should live on the outside (seconds), slower, thematic changes in the middle (minutes), and ambient changes on the background (hours).

-The effect will be presented in the final version

2. outer & middle rings use for loops to place petals evenly on a circle via cos(), sin(), radians().
for rectangle, each rectangle rotates to face outward with rotate(radians(angle)).

3. I drew a triangle at the origin (0,0) and rotated it to form the flower center. The process of how to draw this triangle and find the corresponding coordinates is presented in the following figure.

![inverted triangle](https://github.com/yw9768/CC2025-yw9768/blob/main/assignment%203/regular%20triangle.jpg)


#### New function I've used
sqrt()
I find this function in p5.js reference
https://p5js.org/reference/p5/sqrt/

The use of this function is because I need to calculate the height of a triangle based on its side length (I set the side length triSide = 100 in my assignment), and the formula is h=side * √ 3/2
SQRT() is used to calculate the square root of a number. So I found and used this function

