var width = window.innerWidth / 3;
var height = window.innerHeight / 1.1;

var cursor = document.getElementById('cursor');
cursor.style.top = height + 'px';

var scrollSpeed,
    mappedSpeed;

// var color;
var speed = 4;
var scrollHistory = [];
var cnv;

function setup() {
    cnv = createCanvas(window.innerWidth / 3, window.innerHeight / 1.1);
}

var toSave = false;
var saved = false;

function draw() {

    // this is before everything so that we can draw with a transparent background
    if (scrollHistory.length > height / speed) {
        clear();
        scrollHistory.splice(0, 1);
        if (saved == false) {
            toSave = true;
        }
    }

    translate(width / 2, 0);

    noFill();
    // fill(color);
    for (var i = 0; i < scrollHistory.length; i++) {
        var x = scrollHistory[i];
        stroke(0);
        strokeWeight(12);
        line(-x, i * speed, x, i * speed);
    }

    noLoop();
}

function mouseWheel(e) {
    updateScroll(e);
    if (toSave == true && saved == false) {
        print(toSave);
        toSave = false;
        saved = true;
        // save(cnv, 'it-werks.png');
        saveToServer();
    } else return;
}

function touchMoved(e) {
    updateScroll(e);
}

function updateScroll(e) {
    scrollSpeed = abs(e.delta);
    mappedSpeed = constrain(scrollSpeed, 1, width);
    scrollHistory.push(mappedSpeed);

    // color = map(mappedSpeed, 1, window.innerWidth / 4, 135, 0);
    loop();
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight / 1.1);
}

function saveToServer() {
    var mycanvas = document.getElementById("defaultCanvas0");   //get your canvas
    var image    = mycanvas.toDataURL("image/png");             //Convert the canvas to image, currently converting to .png
}