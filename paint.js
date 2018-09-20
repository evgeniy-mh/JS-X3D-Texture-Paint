
var canvas; //ссылка на холст
var context; //ссылка на контекст холста
var clearButton = document.getElementById('clearCanvas'); //ссылка на кнопку очистки холста
var colorSelector = document.getElementById('colorSelector'); //ссылка на элемент выбора цвета кисти
var lineWidthInput = document.getElementById('lineWidthInput'); //ссылка на элемент выбора толщины линии кисти
var loadNewModelButton = document.getElementById('loadNewModel');
var ShapeSelectListBox = document.getElementById('ShapeSelectListBox');

var lineColor = "#ff0000"; //начальный цвет кисти
var myLineSize = 10; //начальная толщина линии

initCanvas = function () {
    canvas = document.getElementById('textureCanvas'); //ссылка на холст
    context = canvas.getContext('2d');

    //инициализация обработчика события нажатия на холст
    canvas.onmousedown = function (event) {
        //инициализация обработчика события передвижения мыши по холсту
        canvas.onmousemove = function (event) {
            var x = event.offsetX;
            var y = event.offsetY;

            //рисование прямоугольника с заданными координатами и цветом
            context.fillStyle = lineColor;
            context.fillRect(x - myLineSize / 2, y - myLineSize / 2, myLineSize, myLineSize);
            context.fill();
            canvas.parentNode._x3domNode.invalidateGLObject();
        }
        //инициализация обработчика события отпускания кнопки мыши
        canvas.onmouseup = function () {
            canvas.onmousemove = null;
        }
    }

    canvasHeight = parseInt(document.getElementById("textureCanvas").getAttribute("height"));
    canvasWidth = parseInt(document.getElementById("textureCanvas").getAttribute("width"));
    context.lineWidth = 2;
    context.fillStyle = "#ffffff";
    context.fillRect(0, 0, canvasWidth, canvasHeight);
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
        "width": "256",
        "height": "256",
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

    /*X3DShape.onmousedown=function(event){
        if(event.button==2){
            event.preventDefault();
            console.log("dfdsf");
        }      
    }*/

}

function handleMouseClick(event) {
    console.log("click");
}

function handleMouseMove(event) {
    event.stopPropagation();
    console.log("move");
}

document.onload = function () {
    console.log("onload");
    document.getElementById('PaintCheckbox').checked = false;
    /*var X3DScene = document.getElementById('X3DScene');

    X3DScene.setAttribute("onclick",event => {
        //if (event.button == 1) {
         //   event.preventDefault();
            console.log("dfdsf");
        //}
    });*/

    /*document.getElementById('X3DScene').addEventListener("click", handleMouseClick, true);
    document.getElementById('X3DScene').addEventListener("mousemove", handleMouseMove, true);*/
}

function PaintCheckboxClick(checkBox) {
    if (checkBox.checked) {
        console.log("y");
        document.getElementById('X3DScene').addEventListener("click", handleMouseClick, true);
        document.getElementById('X3DScene').addEventListener("mousemove", handleMouseMove, true);
    } else {
        console.log("n");
        document.getElementById('X3DScene').removeEventListener("click", handleMouseClick, true);
        document.getElementById('X3DScene').removeEventListener("mousemove", handleMouseMove, true);
    }
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
    //очистка холста
    context.clearRect(0, 0, canvas.width, canvas.height);
    canvas.parentNode._x3domNode.invalidateGLObject();
    initCanvas();
};

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

initCanvas();