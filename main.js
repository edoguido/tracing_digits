
var width = window.innerWidth;
var height = window.innerHeight / 1.1;

var cursor = document.getElementById('cursor');
cursor.style.top = height + 'px';

var scrollSpeed = 0,
    scrollMax = 0,
    pos = 0,
    mappedSpeed;

var color;
var stepHeight = 4;     // rectangles height
var steps = 0;

function setup() {
    createCanvas(window.innerWidth, window.innerHeight / 1.1);
    translate(0, pos);
    background(120);
    fill(0);
    noStroke();
}

function draw() {
    // translate(0, pos);
    noLoop();
}

function mouseWheel(event) {
    scrollSpeed = abs(event.delta);
    pos += stepHeight / 2;
    
    mappedSpeed = constrain(scrollSpeed, 1, window.innerWidth / 3);
    // fill(map(mappedSpeed, 1, window.innerWidth / 4, 135, 0));
    // print(mappedSpeed);
    
    for (var i = 0; i < steps; i++) {
        rect(width / 2 - (mappedSpeed / 2), i, mappedSpeed, stepHeight);
    }

    steps += 1 ;
    print(steps);
    loop();
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight/1.1);
}