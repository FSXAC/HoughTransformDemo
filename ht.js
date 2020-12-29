const SQRT_2 = 1.4142135;

let N = 512;

let mX;
let mY;

let I;

let M;
let L;

let acc;

function setup() {
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
            // I[i][j] = 0;
            I[i][j] = (i == j || i + j == N - 1) ? 255 : 0;
        }
    }

    return I
}

function createEmptyAcc(m, l) {
    let I = new Array(m);
    for (let i = 0; i < I.length; i++) {
        I[i] = new Array(l);
        for (let j = 0; j < I[i].length; j++) {
            I[i][j] = 0;
        }
    }

    return I
}

function onInputImageSizeChange() {
    N = document.getElementById("imageWidth").value;
    I = createEmptyImage(int(N));

    /* Update hough accumulator size */
    L = round(SQRT_2 * N);
    M = round(SQRT_2 * 2 * N);
    document.getElementById("hough-size-width").innerHTML = L;
    document.getElementById("hough-size-height").innerHTML = M;
}

function mouseClicked() {

    /* Toggle the pixel */
    if (mouseInBound()) {
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

function ht_inputStationary() {
    
    /* Make accumulator */
    let acc = createEmptyAcc(M, L);
    const deltaT = PI / L;
    for (let i = 0; i < N; i++) {
        for (let j = 0; j < N; j++) {
            for (let v = 0; v < L; v++) {
                if (I[j][i] == 0)
                    continue;
                
                let theta = deltaT * v - HALF_PI;
                let rho = i * Math.cos(theta) + j + Math.sin(theta);
                let u = floor(rho - (M / 2));
                if (u >= 0 && u < M)
                    acc[u][v]++;
            }
        }
    }
    return acc;
}

function ht_outputstationary() {
    let acc = createEmptyAcc(M, L);
    const deltaT = PI / L;

    for (let u = 0; u < M; u++) {
        let rho = u - L;
        for (let v = 0; v < L; v++) {
            let theta = deltaT * v - HALF_PI;
            if (theta >= -PI/4 && theta < PI/4) {
                for (let x = 0; x < N; x++) {
                    let y = int((rho - Math.cos(theta) * x) / Math.sin(theta));
                    if (y >= 0 && y < N) {
                        if (I[y][x] > 0) {
                            acc[u][v]++;
                        }
                    }
                }
            } else {
                for (let y = 0; y < N; y++) {
                    let x = int((rho - Math.sin(theta) * y) / Math.cos(theta));
                    if (x >= 0 && x < N) {
                        if (I[y][x] > 0) {
                            acc[u][v]++;
                        }
                    }
                }
            }
        }
    }

    return acc;
}

function ht() {
    let acc = ht_outputstationary();

    /* Find max value */
    let max = 0;
    for (let u = 0; u < M; u++) {
        for (let v = 0; v < L; v++) {
            if (acc[u][v] > max)
                max = acc[u][v];
        }
    }
    console.log('max value', max);

    /* Normalize and write to output */
    let accI = createImage(L, M);
    accI.loadPixels();
    for (let u = 0; u < M; u++) {
        for (let v = 0; v < L; v++) {
            accI.set(v, u, acc[u][v] * (255 / max));
        }
    }
    accI.updatePixels();

    /* Write to DOM */
    document.getElementById("output-img").src = accI.canvas.toDataURL();
}