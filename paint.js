
var canvas = document.getElementById('c1');
var ctx = canvas.getContext('2d');
var myColor = 'red';

var clearButton = document.getElementById('clearCanvas');

clearButton.onclick = function () {
    console.log("sadasd");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
};


document.getElementById('color').oninput = function () {
    myColor = this.value;
}
// ctx.fillRect(x, y, 10, 10); //   то кординаты где мишка отрисовывается прямоугольник 10х10 в пикселях
canvas.onmousedown = function (event) {
    canvas.onmousemove = function (event) {
        var x = event.offsetX;
        var y = event.offsetY;
        ctx.fillRect(x - 5, y - 5, 10, 10);
        ctx.fillStyle = myColor;
        ctx.fill();



    }
    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    }
}