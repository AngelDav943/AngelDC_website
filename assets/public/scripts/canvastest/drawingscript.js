var d = document.getElementById("canvas");
var context = d.getContext("2d");
var dx1 = document.getElementById("x1");
var dy1 = document.getElementById("y1");
var dx2 = document.getElementById("x2");
var dy2 = document.getElementById("y2");

function draw(x1,y1,x2,y2,color) {
    context.beginPath();
    context.strokeStyle = color;
    context.moveTo(x1,y1);
    context.lineTo(x2,y2);
    context.stroke();
    context.stroke();
    context.stroke();
    context.closePath();
}

function square(x1,y1,x2,y2) {
    draw(x1,y1,x2,y1,"white")   // up
    draw(x2,y2,x1,y2,"red")     // down
    draw(x2,y1,x2,y2,"blue")    // left
    draw(x1,y2,x1,y1,"green")   // right
}

function circle(x,y,radius,color) {
    context.beginPath();
    context.arc(x, y, radius, 0, 2 * Math.PI, false);
    context.fillStyle = color;
    context.fill();
    context.lineWidth = 5;
    context.strokeStyle = '#003300';
    context.stroke();
}

function SubmitClear() {
    context.clearRect(0, 0, canvas.width, canvas.height);
}

function SubmitSquare() {
    square(dx1.value,dy1.value,dx2.value,dy2.value);
    console.log(dx1.value+","+dy1.value+","+dx2.value+","+dy2.value);
}

function SubmitLine() {
    draw(dx1.value,dy1.value,dx2.value,dy2.value,"white");
    console.log(dx1.value+","+dy1.value+","+dx2.value+","+dy2.value);
}