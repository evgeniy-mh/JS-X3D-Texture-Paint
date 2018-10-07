var canvas; //ссылка на холст
var context; //ссылка на контекст холста
var clearButton = document.getElementById('clearCanvas'); //ссылка на кнопку очистки холста
var colorSelector = document.getElementById('colorSelector'); //ссылка на элемент выбора цвета кисти
var lineWidthInput = document.getElementById('lineWidthInput'); //ссылка на элемент выбора толщины линии кисти
var loadNewModelButton = document.getElementById('loadNewModel'); //ссылка на кнопку загрузки новой модели
var ShapeSelectListBox = document.getElementById('ShapeSelectListBox'); //ссылка на элемент выбора модели
var X3DScene = document.getElementById('X3DScene'); //ссылка на объект x3d

var lineColor = "#ff0000"; //начальный цвет кисти
var myLineSize = 10; //начальная толщина линии

var clickX = new Array(); //массив с X координатами нажатий мышки
var clickY = new Array(); //массив с Y координатами нажатий мышки
var clickDrag = new Array(); //массив логических значений; в нем сохраняется true если в данный момент мышь двигалась
var clickColor = new Array(); //массив значений цветов которыми были нарисованы линии
var clickSize = new Array(); //массив значений размеров кисти во время рисования
var imageTexture; //текстура
var paint; //true- в данный момент пользователь рисует; false- в данный момент пользователь не рисует;

//Функция инициализации canvas
function initCanvas() {
    canvas = document.getElementById('textureCanvas'); //ссылка на холст
    context = canvas.getContext('2d');

    //Функция-обработчик события нажатия кнопки мыши
    canvas.onmousedown = function (e) {
        var mouseX = e.offsetX;
        var mouseY = e.offsetY;

        paint = true;
        addClick(mouseX, mouseY);
        redraw();
    };

    //Функция-обработчик события движения мыши
    canvas.onmousemove = function (e) {
        if (paint) {
            addClick(e.offsetX, e.offsetY, true);
            redraw();
        }
    };

    //Функция-обработчик события отмены нажатия кнопки мыши
    canvas.onmouseup = function (e) {
        paint = false;
    };

    //Функция-обработчик события когда мышь покидает область элемента canvas
    canvas.onmouseleave = function (e) {
        paint = false;
    };

    canvasHeight = parseInt(document.getElementById("textureCanvas").getAttribute("height"));
    canvasWidth = parseInt(document.getElementById("textureCanvas").getAttribute("width"));
    context.lineWidth = 2;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
}

//Функция нажатия на canvas
function addClick(x, y, dragging) {
    clickX.push(x);
    clickY.push(y);
    clickDrag.push(dragging);
    clickColor.push(lineColor);
    clickSize.push(myLineSize);
}

//функция перерисовки canvas
//Вызывается после каждого изменения рисунка. Рисует на canvas все ранее 
//сохраненные (в массивах clickX, clickY, ...)  линии с необходимыми 
//параметрами цвета и толщины. Обновляет трехмерный x3d объект.

function redraw() {
    context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
    context.lineJoin = "round";

    if (imageTexture) context.drawImage(imageTexture, 0, 0);

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

//Функия позволяющая быстро задавать необходимые параметры HTML элементов при их создании
function setAttributes(el, attrs) {
    for (var key in attrs) {
        el.setAttribute(key, attrs[key]);
    }
}

//Функция-обработчик события нажатия на кнопку загрузки новой трехмерной модели
loadNewModelButton.onclick = function () {
    //Удаление старого содержимого X3DTransformRoot
    clearX3DViev();

    //Создание новых дочерних элементов с новой трехмерной фигурой
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

//Функция для удаления всем дочерних элементов X3DTransformRoot
function clearX3DViev() {
    var X3DTransformRoot = document.getElementById('X3DTransformRoot');
    for (var i = 0; i < X3DTransformRoot.childNodes.length; i++) {
        if (X3DTransformRoot.childNodes[i].nodeType === Node.ELEMENT_NODE) {
            X3DTransformRoot.removeChild(X3DTransformRoot.childNodes[i]);
            break;
        }
    }
}

//Функция возвращающая название выбранной трехмерной модели
function getX3DModel() {
    return ShapeSelectListBox.options[ShapeSelectListBox.selectedIndex].attributes.name.value;
}

//Инициализация обработчика события нажатия кнопки очистки холста
clearButton.onclick = function () {
    clearCanvas();
};

//Функкия для очистки canvas
function clearCanvas() {
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

//Функция-обработчик события выбора нового файла текстуры
function openTextureFile(files) {
    imageTexture = new Image;
    imageTexture.onload = function () {
        redraw();
    }
    imageTexture.src = URL.createObjectURL(files[0]);
}

//Функция для сохранения содержимого canvas
function saveCanvas() {
    var download = document.getElementById("download");
    var image = canvas.toDataURL("image/png")
        .replace("image/png", "image/octet-stream");
    download.setAttribute("href", image);
}

initCanvas();