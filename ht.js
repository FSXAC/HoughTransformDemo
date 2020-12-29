let N = 512;

let mX;
let mY;

let I;

function setup() {
    console.log(N);
    let canvas = createCanvas(800, 800);
    canvas.parent("main");

    /* Setup image */
    onInputImageSizeChange();

    noSmooth();
}

function draw() {
    background(0);

    drawInputImage();

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

function mouseInBound() {
    return (mouseX >= 0 && mouseX < width && mouseY >= 0 && mouseY < height);
}

function drawMouseCoordinates() {
    noStroke();
    fill(255);
    if (mouseInBound()) {
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

function createEmptyImage(n) {
    let I = new Array(n);
    for (let i = 0; i < I.length; i++) {
        I[i] = new Array(n);
        for (let j = 0; j < I[i].length; j++) {
            I[i][j] = 0;
        }
    }

    return I
}

function onInputImageSizeChange() {
    N = document.getElementById("imageWidth").value;
    I = createEmptyImage(int(N));
    console.log(I);
}

function mouseClicked() {

    /* Toggle the pixel */
    if (mouseInBound) {
        if (I[mY][mX] > 0)
            I[mY][mX] = 0;
        else
            I[mY][mX] = 255;
    }
}

function drawInputImage() {
    let img = createImage(N, N);
    img.loadPixels();
    for (let j = 0; j < I.length; j++) {
        for (let i = 0; i < I[j].length; i++) {
            img.set(i, j, I[j][i]);
        }
    }
    img.updatePixels();
    image(img, 0, 0, width, height);
}