
var canvas = document.getElementById('c1');
var context = canvas.getContext('2d');
var clearButton = document.getElementById('clearCanvas');
var colorSelector = document.getElementById('colorSelector');
var lineWidthInput = document.getElementById('lineWidthInput');

var myColor = "#ff0000";
var myLineSize = 10;

clearButton.onclick = function () {
    context.clearRect(0, 0, canvas.width, canvas.height);
};

colorSelector.value = myColor;
colorSelector.oninput = function () {
    myColor = this.value;
}

lineWidthInput.value = myLineSize;
lineWidthInput.oninput = function () {
    myLineSize=lineWidthInput.value;
}

canvas.onmousedown = function (event) {
    canvas.onmousemove = function (event) {
        var x = event.offsetX;
        var y = event.offsetY;
        context.fillStyle = myColor;
        context.fillRect(x - myLineSize/2, y - myLineSize/2, myLineSize, myLineSize);
        context.fill();
    }
    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    }
}