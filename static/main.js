var width, height;

var speed;
var scrollHistory = [];
var scrolled = 0;
var scrolledcm;
const CONVERSION_VALUE = 0.0026458333;
var color;
var stroke;
var strweight;

// 
// HTML Elements
// variable to store canvas for later write on image file
var cnv, gph;
var controlsHeight = document.getElementById('scroll-data').offsetHeight;


// intro events

document.querySelector("#intro > .btn").addEventListener("click", function() {
    this.parentElement.classList.add("hidden");
},false)


// *        -----------------------        * //
// *        -----------------------        * //
// * =======       P5 RUNTIME      ======= * //
// *        -----------------------        * //

function setup() {
    if (window.innerWidth > window.innerHeight) {
        cnv = createCanvas(window.innerWidth / 2, window.innerHeight - controlsHeight);
    } else {
        cnv = createCanvas(window.innerWidth, window.innerHeight - controlsHeight);
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

    beginShape();
    noFill();
    for (var i = 0; i < scrollHistory.length; i++) {

        // computedWeight = map(scrollHistory[i], 0, cnv.width - (strweight * 12), 8, strweight);
        
        var x = scrollHistory[i];
        var y = i * (speed);
        
        color = map(scrollHistory[i], 1, cnv.width/1.5, 110, 10);
        stroke(color);
        strokeWeight(4);
        line(-x + (cnv.width / 2), y, x + (cnv.width / 2), y);
        
        // writing data to image buffer for later export on white background
        // manual translation of line because translate function seems to be 
        // in conflict with original canvas translation 
        gph_color = map(scrollHistory[i], 1, cnv.width/1.5, 120, 30);
        gph.stroke(gph_color);
        gph.strokeWeight(4);
        gph.line(-x + (gph.width / 2), y, x + (gph.width / 2), y);

    }
    endShape();

    noLoop();
}

function windowResized() {
    if (window.innerWidth > window.innerHeight) {
        resizeCanvas(window.innerWidth / 2, window.innerHeight - controlsHeight);
    } else {
        resizeCanvas(window.innerWidth, window.innerHeight - controlsHeight);
    }
}

// *        -----------------------        * //
// * =======    END P5 RUNTIME     ======= * //
// *        -----------------------        * //
// *        -----------------------        * //





// 
// Print button events
//
var printBtn = document.getElementById('print-btn');
var scrollText = document.getElementById('scroll-counter');
var hasPrinted = false;

printBtn.addEventListener('click', function startProcess() {

    if (scrolledcm >= 2) {

        printBtn.style.pointerEvents = 'none';

        if (hasPrinted == false) {
            processCanvas();

            scrollText.textContent = 'Printing your trace...';
            printBtn.style.opacity = '0.5';
            printBtn.textContent = 'Printing';
            hasPrinted = true;

        } else if (hasPrinted == true) {
            location.reload();
        }
    } else {
        scrollText.textContent = 'Scroll some more!';
    }

}, false);




// *        -----------------------         * //
//          MOUSE RUNTIME FUNCTIONS           //
// *        -----------------------         * //

function mouseWheel(e) {
    updateMouseScroll(e);
}

function updateMouseScroll(e) {
    speed = 6;
    strweight = 16;
    var scrollSpeed, mappedSpeed;

    scrollSpeed = abs(e.delta);
    mappedSpeed = parseFloat(constrain(scrollSpeed, 0, cnv.width - (strweight * 6)).toFixed(1));
    scrollHistory.push(mappedSpeed);

    scrolled += 1;
    scrolledcm = (scrolled * CONVERSION_VALUE * 10).toFixed(0);

    document.getElementById('scroll-counter').innerHTML = `You have scrolled ${scrolledcm} centimeters.`

    loop();
}

// *        -----------------------         * //




// *        -----------------------         * //
//          TOUCH RUNTIME FUNCTIONS           //
// *        -----------------------         * //

// TODO - Touch support
var start = {
    x: 0,
    y: 0
};
var offset = {
    x: 0,
    y: 0
}
var startTime, endTime;


// *    -----------------     * //
//       TOUCH LISTENERS        //

document.addEventListener('touchstart', (e) => {
    start.y = e.touches[0].clientY;
    startTime = new Date().getTime();
}, false);

document.addEventListener('touchend', () => {
    endTime = new Date().getTime();
}, false);

// preventBouncing prevents mobile browsers overscroll
// Event Listener operations are delegated to preventBouncing function
document.addEventListener('touchmove', preventBouncing, { passive: false });

function preventBouncing(e) {

    endTime = new Date().getTime();
    offset.y = start.y - e.touches[0].clientY;
    touchSpeed(100, e.touches[0].clientY)

    //preventing the easing on iOS devices
    e.preventDefault();

}

// var myImpetus = new Impetus({
//     source: document,
//     friction: 0.95,
//     boundY: [0, 1],
//     bounce: true,
//     update: function(y) {
//     }
// })

// *    -----------------     * //

function updateTouchScroll(scrollSpeed) {
    speed = 6;
    strweight = 21;
    
    // var scrollSpeed = Math.abs( (offset - start.y) ) / (endTime - startTime);
    var mappedSpeed = parseFloat(constrain(scrollSpeed * 10, 0, cnv.width - (strweight * 4)).toFixed(1));
    scrollHistory.push(mappedSpeed);

    scrolled += 2;
    scrolledcm = (scrolled * CONVERSION_VALUE * 10).toFixed(0);

    document.getElementById('scroll-counter').innerHTML = `You have scrolled ${scrolledcm} centimeters.`

    loop();
}

function touchSpeed(interval, thisY) {
        window.setTimeout( () => {
            var distance = Math.abs(thisY - start.y);
            var scrollSpeed = distance / interval;
            scrollSpeed = scrollSpeed * 25;
            start.y = thisY;
            updateTouchScroll(scrollSpeed);
        }, interval);
}

// *        -----------------------         * //




// *        ---------------------         * //
//          BACKEND COMMUNICATION           //
// *        ---------------------         * //

// first parameter is the data to send,
// second parameter is the script to execute.
function saveToServer(source, address) {
    var http = new XMLHttpRequest();
    http.open('POST', address, true);

    http.setRequestHeader('Content-type', 'application/json');

    http.onreadystatechange = function () {
        if (http.readyState == 4 && http.status == 200) {
            printResponse(http.response);
        }
    }

    var today = new Date();
    var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
    var time = today.getHours() + "-" + today.getMinutes() + "-" + today.getSeconds();

    var obj = {
        "meta-data": date + '_' + time,
        "scroll-length": scrolledcm,
        "scroll-data": scrollHistory,
        "img-data": source
    }
    var json = JSON.stringify(obj);

    http.send(json);
}

function printResponse(response) {
    printBtn.style.opacity = '1';
    printBtn.textContent = 'Restart';
    printBtn.style.pointerEvents = 'auto';

    scrollText.textContent = response;

    if (response == 'Paper is missing :\(') {
        printBtn.textContent = 'That\'s bad!';
    }
}

function processCanvas() {
    var elToSave = gph.canvas;
    var canvasData = elToSave.toDataURL('image/png');
    var headerData = 'data:image/png;base64,';
    canvasData = canvasData.replace(headerData, '');

    saveToServer(canvasData, '/');
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