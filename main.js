var width;
var height;
var cursor;

var scrollSpeed,
    mappedSpeed;

// var color;
var speed = 1;
var scrollHistory = [];
var scrolled = 0;
var scrolledcm;
var conversionUnit = 0.0026458333;

// variable to store canvas for later write on image file
var cnv;
var toSave = false;
var saved = false;

function setup() {
    cnv = createCanvas(window.innerWidth / 3, window.innerHeight / 1.1);

    height = cnv.height;
    width = cnv.width;

    cursor = document.getElementById('cursor');
    cursor.style.top = height + 'px';
}


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
        var y = i * speed;
        stroke(0);
        strokeWeight(12);
        line(-x, y, x, y);
    }

    noLoop();
}

function mouseWheel(e) {

    updateScroll(e);

    if (toSave == true && saved == false) {
        toSave = false;
        saved = true;

        // save(cnv, 'it-werks.png');
        // saveToServer();

    } else return;
}

// function touchMoved(e) {
//     updateScroll(e);
// }

// function mouseClicked() {
//     save(cnv, 'it-werks.png');
// }

function updateScroll(e) {

    scrollSpeed = abs(e.delta);
    mappedSpeed = constrain(scrollSpeed, 1, width);
    scrollHistory.push(mappedSpeed);

    // color = map(mappedSpeed, 1, window.innerWidth / 4, 135, 0);

    scrolled += 1;
    scrolledcm = scrolled * conversionUnit;
    print(scrolledcm);

    // switch (true) {
    //     case scrolledcm < 1:
    //         document.getElementById('scroll-counter').innerHTML = `You have scrolled ${(scrolledcm).toFixed(0)} millimeters.`;
    //         break;
    //     case scrolledcm >= 1:
    //         document.getElementById('scroll-counter').innerHTML = `You have scrolled ${scrolledcm.toFixed(2)} centimeters.`
    //         break;
    // }

    document.getElementById('scroll-counter').innerHTML = `You have scrolled ${(scrolledcm * 10).toFixed(0)} centimeters.`

    loop();
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight / 1.1);
}

function saveToServer() {
    var mycanvas = document.getElementById("defaultCanvas0"); //get your canvas
    var image = mycanvas.toDataURL("image/png"); //Convert the canvas to image, currently converting to .png
}