
var canvas; //ссылка на холст
var context; //ссылка на контекст холста
var clearButton = document.getElementById('clearCanvas'); //ссылка на кнопку очистки холста
var colorSelector = document.getElementById('colorSelector'); //ссылка на элемент выбора цвета кисти
var lineWidthInput = document.getElementById('lineWidthInput'); //ссылка на элемент выбора толщины линии кисти
var loadNewModelButton = document.getElementById('loadNewModel');

var lineColor = "#ff0000"; //начальный цвет кисти
var myLineSize = 10; //начальная толщина линии

initCanvas = function () {
    canvas = document.getElementById('textureCanvas'); //ссылка на холст
    context = canvas.getContext('2d');

    //инициализация обработчика события нажатия на холст
    canvas.onmousedown = function (event) {
        console.log("sadasdasd");
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

    /*var X3DTableTr = document.getElementById("X3DTableTr");
    var X3DScene = document.getElementById("X3DScene");

    X3DTableTr.removeChild(X3DScene);

    var x3D = document.createElement("x3d");
    setAttributes(x3D, {
        "id": "X3DScene",
        "showLog": "false",
        "x": "0px",
        "y": "0px",
        "width": "500px",
        "height": "350px",
    });


    var scene = x3D.appendChild(document.createElement("scene"));
    scene.appendChild(document.createElement("background")).setAttribute("skyColor", "0.15 0.15 0.15");
    scene.appendChild(document.createElement("viewpoint")).setAttribute("position", "0 0 5");

    var shape = scene.appendChild(document.createElement("shape"));
    var appearance = shape.appendChild(document.createElement("appearance"));
    var texture= appearance.appendChild(document.createElement("texture"));
    texture.setAttribute("hideChildren", "false");

    var canvas=texture.appendChild(document.createElement("canvas"));
    setAttributes(canvas, {
        "width":"256",
        "height":"256",
        "id":"textureCanvas",
        "style":"border: solid 1px black; position:absolute; top:20px;left:520px;"
    });
    appearance.appendChild(document.createElement("material")).setAttribute("diffuseColor","0 0 0");

    shape.appendChild(document.createElement("sphere"));
    X3DTableTr.appendChild(x3D);

    initCanvas();*/

    var ot = document.getElementById('X3DTransformRoot');
    for (var i = 0; i < ot.childNodes.length; i++) {
        if (ot.childNodes[i].nodeType === Node.ELEMENT_NODE) {
            ot.removeChild(ot.childNodes[i]);
            break;
        }
    }


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
    var b = document.createElement('sphere');
    X3DShape.appendChild(b);

    var ot = document.getElementById('X3DTransformRoot');
    ot.appendChild(X3DTransform);
    
    initCanvas();
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