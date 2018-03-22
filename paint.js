
var canvas = document.getElementById('c1');
var context = canvas.getContext('2d');
var clearButton = document.getElementById('clearCanvas');
var colorSelector=document.getElementById('colorSelector');

var myColor = "red";

clearButton.onclick = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
};

colorSelector.value=myColor;
colorSelector.oninput = function () {
    myColor = this.value;
}

canvas.onmousedown = function (event) {
    canvas.onmousemove = function (event) {
        var x = event.offsetX;
        var y = event.offsetY;
        context.fillStyle = myColor;
        context.fillRect(x - 5, y - 5, 10, 10);        
        context.fill();


    }
    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    }
}