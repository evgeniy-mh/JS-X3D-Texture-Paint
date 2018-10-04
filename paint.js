var canvas; //ссылка на холст
var context; //ссылка на контекст холста
var clearButton = document.getElementById('clearCanvas'); //ссылка на кнопку очистки холста
var colorSelector = document.getElementById('colorSelector'); //ссылка на элемент выбора цвета кисти
var lineWidthInput = document.getElementById('lineWidthInput'); //ссылка на элемент выбора толщины линии кисти
var loadNewModelButton = document.getElementById('loadNewModel');
var ShapeSelectListBox = document.getElementById('ShapeSelectListBox');
var X3DScene = document.getElementById('X3DScene');

var lineColor = "#ff0000"; //начальный цвет кисти
var myLineSize = 10; //начальная толщина линии

var clickX = new Array();
var clickY = new Array();
var clickDrag = new Array();
var clickColor = new Array();
var clickSize = new Array();
var imageTexture;
var paint;

initCanvas = function () {
    canvas = document.getElementById('textureCanvas'); //ссылка на холст
    context = canvas.getContext('2d');

    canvas.onmousedown = function (e) {
        var mouseX = e.offsetX;
        var mouseY = e.offsetY;

        paint = true;
        addClick(mouseX, mouseY);
        redraw();
    };

    canvas.onmousemove = function (e) {
        if (paint) {
            addClick(e.offsetX, e.offsetY, true);
            redraw();
        }
    };

    canvas.onmouseup = function (e) {
        paint = false;
    };

    canvas.onmouseleave = function (e) {
        paint = false;
    };

    canvasHeight = parseInt(document.getElementById("textureCanvas").getAttribute("height"));
    canvasWidth = parseInt(document.getElementById("textureCanvas").getAttribute("width"));
    context.lineWidth = 2;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
}

function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(lineColor);
    clickSize.push(myLineSize);
}

function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.lineJoin = "round";

    if (imageTexture) context.drawImage(imageTexture, 20, 20);

    for (var i = 0; i < clickX.length; i++) {
        context.beginPath();
        if (clickDrag[i] && i) {
            context.moveTo(clickX[i - 1], clickY[i - 1]);
        } else {
            context.moveTo(clickX[i] - 1, clickY[i]);
        }
        context.lineTo(clickX[i], clickY[i]);
        context.closePath();
        context.strokeStyle = clickColor[i];
        context.lineWidth = clickSize[i];
        context.stroke();
    }
    canvas.parentNode._x3domNode.invalidateGLObject();
}

function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

loadNewModelButton.onclick = function () {

    clearX3DViev();

    var X3DTransform = document.createElement('transform');
    X3DTransform.setAttribute("translation", "0 0 0");
    var X3DShape = document.createElement('shape');
    var X3DAppearance = document.createElement('appearance');
    var X3DMaterial = document.createElement('material');
    var texture = X3DAppearance.appendChild(document.createElement("texture"));
    texture.setAttribute("hideChildren", "false");
    var canvas = texture.appendChild(document.createElement("canvas"));
    setAttributes(canvas, {
        "width": "512",
        "height": "512",
        "id": "textureCanvas",
        "style": "border: solid 1px black; position:absolute; top:20px;left:520px;"
    });

    X3DAppearance.appendChild(X3DMaterial);
    X3DShape.appendChild(X3DAppearance);
    X3DTransform.appendChild(X3DShape);
    var X3DModel = document.createElement(getX3DModel());
    X3DShape.appendChild(X3DModel);

    X3DTransformRoot = document.getElementById('X3DTransformRoot');
    X3DTransformRoot.appendChild(X3DTransform);
    initCanvas();
    clearCanvas();
}

function clearX3DViev() {
    var X3DTransformRoot = document.getElementById('X3DTransformRoot');
    for (var i = 0; i < X3DTransformRoot.childNodes.length; i++) {
        if (X3DTransformRoot.childNodes[i].nodeType === Node.ELEMENT_NODE) {
            X3DTransformRoot.removeChild(X3DTransformRoot.childNodes[i]);
            break;
        }
    }
}

function getX3DModel() {
    return ShapeSelectListBox.options[ShapeSelectListBox.selectedIndex].attributes.name.value;
}

//инициализация обработчика события нажатия кнопки очистки холста
clearButton.onclick = function () {
    clearCanvas();
};

function clearCanvas() {
    //очистка холста
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.parentNode._x3domNode.invalidateGLObject();

    clickX = [];
    clickY = [];
    clickDrag = [];
    clickColor = [];
    clickSize = [];
    imageTexture = null;
    redraw();
}

colorSelector.value = lineColor; //инициализация элемента выбора цвета начальным цветом
//инициализация обработчика события выбора цвета
colorSelector.oninput = function () {
    //присвоение нового цвета кисти
    lineColor = this.value;
}

lineWidthInput.value = myLineSize; //инициализация элемента выбора толщины линии начальным значением
//инициализация обработчика события выбора толщины линии
lineWidthInput.oninput = function () {
    //обновление толщины линии
    myLineSize = lineWidthInput.value;
}

function openTextureFile(files) {
    imageTexture = new Image;
    imageTexture.onload = function () {
        redraw();
    }
    imageTexture.src = URL.createObjectURL(files[0]);
}

function saveCanvas() {
    var download = document.getElementById("download");
    var image = canvas.toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}

initCanvas();