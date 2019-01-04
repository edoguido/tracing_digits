var width;
var height;

// var color;
var speed = 2;
var scrollHistory = [];
var scrolled = 0;
var scrolledcm;
var CONVERSION_VALUE = 0.0026458333;
var color;
var stroke;
var strweight = 16;

// variable to store canvas for later write on image file
var cnv, gph;

function setup() {
    if (window.innerWidth > window.innerHeight) {
        cnv = createCanvas(window.innerWidth / 3, window.innerHeight / 1.1);
    } else {
        cnv = createCanvas(window.innerWidth, window.innerHeight / 1.1);
    }

    height = cnv.height;
    width = cnv.width;

    gph = createGraphics(width, height);
    gph.background(255);
}

function draw() {

    // this is before everything so that we can draw with a transparent background
    clear();
    gph.background(255);

    if (scrollHistory.length > height / speed) {
        scrollHistory.splice(0, 1);
    }

    translate(width / 2, 0);

    beginShape();
    noFill();
    for (var i = 0; i < scrollHistory.length; i++) {
        color = map(scrollHistory[i], 1, cnv.width, 80, 0);
        weight = map(scrollHistory[i], 0, cnv.width - (strweight * 10), 2, strweight);

        var x = scrollHistory[i];
        var y = i * speed;

        stroke(color);
        strokeWeight(weight);
        line(-x, y, x, y);

        // writing data to image buffer for later export on white background
        gph.stroke(color);
        gph.strokeWeight(weight);
        // manual translation because translate function seems to be 
        // in conflict with original canvas translation 
        gph.line(-x + (gph.width / 2), y, x + (gph.width / 2), y);
    }
    endShape();

    noLoop();
}

function windowResized() {
    resizeCanvas(window.innerWidth, window.innerHeight / 1.1);
}



// *        -----------------------         * //
//          MOUSE RUNTIME FUNCTIONS           //
// *        -----------------------         * //

function mouseWheel(e) {
    updateMouseScroll(e);
}

function updateMouseScroll(e) {
    var scrollSpeed, mappedSpeed;

    scrollSpeed = abs(e.delta);
    mappedSpeed = constrain(scrollSpeed, 0, cnv.width - (strweight * 13));
    scrollHistory.push(mappedSpeed);

    scrolled += 1;
    scrolledcm = scrolled * CONVERSION_VALUE;

    document.getElementById('scroll-counter').innerHTML = `You have scrolled ${(scrolledcm * 10).toFixed(0)} centimeters.`

    loop();
}

function mouseClicked() {
    var elToSave = gph.canvas;
    var canvasData = elToSave.toDataURL('image/png');
    var headerData = 'data:image/png;base64,';
    canvasData = canvasData.replace(headerData, '');

    // saveToServer(canvasData, 'server_side/scroll_printer.py');
}



// *        -----------------------         * //
//          TOUCH RUNTIME FUNCTIONS           //
// *        -----------------------         * //

// TODO - Touch support
var start = {
    x: 0,
    y: 0
};

var startTime, endTime;

document.addEventListener('touchstart', function (e) {
    // start.x = e.touches[0].clientX;
    start.y = e.touches[0].clientY;
    startTime = new Date().getTime();
    // print(startTime);
}, false);

document.addEventListener('touchend', function (e) {
    endTime = new Date().getTime();
    // print(endTime);
}, false);

document.addEventListener('touchmove', function (e) {
    offset = {};
    // offset.x = start.x - e.touches[0].clientX;
    endTime = new Date().getTime();
    offset.y = start.y - e.touches[0].clientY;

    updateTouchScroll(e, offset.y, endTime);
}, false);

function updateTouchScroll(e, offset, endTime) {
    var scrollSpeed = abs(offset - start.y) / (endTime - startTime);
    print(scrollSpeed);

    var mappedSpeed = constrain(scrollSpeed * 10, 0, cnv.width - (strweight * 13));
    scrollHistory.push(mappedSpeed);

    scrolled += 1;
    scrolledcm = scrolled * CONVERSION_VALUE;

    document.getElementById('scroll-counter').innerHTML = `You have scrolled ${(scrolledcm * 10).toFixed(0)} centimeters.`

    loop();
}


// *        ---------------------         * //
//          BACKEND COMMUNICATION           //
// *        ---------------------         * //

// first parameter is the data to send,
// second parameter is the script to execute.
function saveToServer(source, targetOp) {
    var http = new XMLHttpRequest();
    http.open('POST', targetOp, true);

    // http.setRequestHeader('Content-type', 'image/png');

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            print(http.response);
        }
    }

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();

    var obj = {
        "meta-data": date + '_' + time,
        "scroll-data": scrollHistory,
        "img-data": source
    }
    var json = JSON.stringify(obj);

    http.send(json);
}



function floydSteinberg(sb, w, h) // source buffer, width, height
{
    for (var i = 0; i < h; i++)
        for (var j = 0; j < w; j++) {
            var ci = i * w + j; // current buffer index
            var cc = sb[ci]; // current color
            var rc = (cc < 128 ? 0 : 255); // real (rounded) color
            var err = cc - rc; // error amount
            sb[ci] = rc; // saving real color
            if (j + 1 < w) sb[ci + 1] += (err * 7) >> 4; // if right neighbour exists
            if (i + 1 == h) continue; // if we are in the last line
            if (j > 0) sb[ci + w - 1] += (err * 3) >> 4; // bottom left neighbour
            sb[ci + w] += (err * 5) >> 4; // bottom neighbour
            if (j + 1 < w) sb[ci + w + 1] += (err * 1) >> 4; // bottom right neighbour
        }
}