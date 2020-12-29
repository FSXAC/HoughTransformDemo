let N = 512;

let mX;
let mY;

function setup() {
    console.log(N);
    let canvas = createCanvas(800, 800);
    canvas.parent("main");
    
}

function draw() {
    // background(frameCount % 255);
    background(0);
    fill(255);
    text(N, width/2, height/2);

    /* Find image-space coordinates */
    mX = mapScreen2ImageSpace(mouseX);
    mY = mapScreen2ImageSpace(mouseY);

    drawMouseCursor();
    drawMouseCoordinates();
}

function mapScreen2ImageSpace(x) {
    return int(N / 800 * x);
}

function mapImage2ScreenSpace(x) {
    return int(800 / N * x);
}

function drawMouseCoordinates() {
    noStroke();
    fill(255);
    if (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height) {
        text(
            '(' + str(mX) + ', ' + str(mY) + ')',
            mouseX > (width - 80) ?  mouseX - 80 : mouseX + 8,
            mouseY < 30 ? mouseY + 30 : mouseY - 8
        );

    }
}

function drawMouseCursor() {
    stroke(50);
    noFill();
    rect(mapImage2ScreenSpace(mX), mapImage2ScreenSpace(mY), 800 / N, 800 / N);
}

function onInputImageSizeChange() {
    N = document.getElementById("imageWidth").value;
}
