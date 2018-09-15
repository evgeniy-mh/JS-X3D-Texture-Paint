
var canvas = document.getElementById('textureCanvas'); //ссылка на холст
var context = canvas.getContext('2d'); //ссылка на контекст холста
var clearButton = document.getElementById('clearCanvas'); //ссылка на кнопку очистки холста
var colorSelector = document.getElementById('colorSelector'); //ссылка на элемент выбора цвета кисти
var lineWidthInput = document.getElementById('lineWidthInput'); //ссылка на элемент выбора толщины линии кисти

var myColor = "#ff0000"; //начальный цвет кисти
var myLineSize = 10; //начальная толщина линии

initCanvas = function () {
    canvasHeight = parseInt(document.getElementById("textureCanvas").getAttribute("height"));
    canvasWidth = parseInt(document.getElementById("textureCanvas").getAttribute("width"));
    context.lineWidth = 2;
    // Fill the path
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
}

//инициализация обработчика события нажатия кнопки очистки холста
clearButton.onclick = function () {
    //очистка холста
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.parentNode._x3domNode.invalidateGLObject();
    initCanvas();
};

colorSelector.value = myColor; //инициализация элемента выбора цвета начальным цветом
//инициализация обработчика события выбора цвета
colorSelector.oninput = function () {
    //присвоение нового цвета кисти
    myColor = this.value;
}

lineWidthInput.value = myLineSize; //инициализация элемента выбора толщины линии начальным значением
//инициализация обработчика события выбора толщины линии
lineWidthInput.oninput = function () {
    //обновление толщины линии
    myLineSize = lineWidthInput.value;
}


initCanvas();
//инициализация обработчика события нажатия на холст
canvas.onmousedown = function (event) {

    //инициализация обработчика события передвижения мыши по холсту
    canvas.onmousemove = function (event) {
        var x = event.offsetX;
        var y = event.offsetY;

        //рисование прямоугольника с заданными координатами и цветом
        context.fillStyle = myColor;
        context.fillRect(x - myLineSize / 2, y - myLineSize / 2, myLineSize, myLineSize);
        context.fill();

        canvas.parentNode._x3domNode.invalidateGLObject();
    }
    //инициализация обработчика события отпускания кнопки мыши
    canvas.onmouseup = function () {
        canvas.onmousemove = null;
    }
}