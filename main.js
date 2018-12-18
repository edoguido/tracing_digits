var width = window.innerWidth;
var height = window.innerHeight / 1.1;

var cursor = document.getElementById('cursor');
cursor.style.top = height + 'px';

var scrollSpeed,
    mappedSpeed;

// var color;
var speed = 4;

var scrollHistory = [];

function setup() {
    createCanvas(window.innerWidth, window.innerHeight / 1.1);
}

function draw() {
    
    // this is before everything so that we can draw with a transparent background
    if (scrollHistory.length > height / speed) {
        clear();
        scrollHistory.splice(0, 1);
    }

    translate(width / 2, 0);

    noFill();
    // fill(color);
    for (var i = 0; i < scrollHistory.length; i++) {
        var x = scrollHistory[i];
        // beginShape();
        stroke(0);
        strokeWeight(12);
        line(-x, i * speed, x, i * speed);
        // endShape();
    }


    noLoop();
}

function mouseWheel(e) {
    updateScroll(e);
}

function touchMoved(e) {
    updateScroll(e);
}

function updateScroll(e) {
    scrollSpeed = abs(e.delta);
    mappedSpeed = constrain(scrollSpeed, 1, window.innerWidth / 3);
    scrollHistory.push(mappedSpeed);

    // color = map(mappedSpeed, 1, window.innerWidth / 4, 135, 0);
    loop();
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight / 1.1);
}