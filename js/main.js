function load() {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("ajax").innerHTML = "<p>" + this.responseText.replace(/\n/g,"<br />") + "</p>";
            this.responseText.xmlEncoding;
        }
    };
    xhttp.open("GET", "./text.txt", true);
    xhttp.send();
}

function docLoad() {
    "use strict";
    var auOne = document.getElementById("au1"),
        sound = document.getElementById("sound");
    auOne.addEventListener("play", function() {
        sound.pause();
        auOne.play();
    });
    sound.addEventListener("play", function() {
        auOne.pause();
        sound.play();
    });
    document.getElementById("audioInput").addEventListener("change", checker, false);//ждём пока пользователь выберет файл
}
function checker(e) {
    "use strict";
    var fileType = this.files[0].type;//проверяем аудио файл или нет
    if (fileType.indexOf("audio") != -1) {
        loadFile(this.files[0], ifSound);
    } else {
        alert("Это не аудио файл!");
    }
}
function loadFile(file, loaded)//загружаем
{
    var reader = new FileReader();
    reader.onload = loaded;
    reader.readAsDataURL(file);
}

function ifSound(evt)
{
    document.getElementById("sound").src = evt.target.result;//выводим
    stopAllAudio();
    document.getElementById("sound").play();//сразу проигрываем
}
function stopAllAudio() {
    var allAudios = document.querySelectorAll("audio");
    allAudios.forEach(function(audio){
        audio.pause();
    });
}
if (window.addEventListener) {
   console.log("here");
    window.addEventListener("load", docLoad);
} else {
    window.attachEvent("onload", docLoad);
}
var pageLoad = function () {
    "use strict";
    //параметры холста
    document.getElementById("hippi").width = 150;
    document.getElementById("hippi").height = 150;
    var drawingHippi = document.getElementById("hippi");
    if (drawingHippi && drawingHippi.getContext) {
        var hippi = drawingHippi.getContext("2d");
        hippi.beginPath();
        hippi.lineWidth = 5;//ширина линии
        hippi.beginPath();
        hippi.arc(75,75,50,0,Math.PI*2,true); // Внешняя окружность
        hippi.moveTo(110,75);
        hippi.arc(75,75,35,0,Math.PI,false);  // рот (по часовой стрелке)
        hippi.moveTo(65,65);
        hippi.arc(60,65,5,0,Math.PI*2,true);  // Левый глаз
        hippi.moveTo(95,65);
        hippi.arc(90,65,5,0,Math.PI*2,true);  // Правый глаз
        hippi.stroke();
        hippi.stroke();
    }



    //задаём параметры холста и действия для рисования
    canvas = document.getElementById("risovalka");
    if (window.innerWidth > 500){
        canvas.width = 500;
        canvas.height = 400;
    } else {
        canvas.width = 300;
        canvas.height = 300;
    }
    context = canvas.getContext("2d");
    canvas.onmousedown = start;
    canvas.onmouseup = stop;
    canvas.onmouseleave = leave;
    canvas.onmousemove = draw;
    //изменение параметров кисти
    document.getElementById("clearCanvas").onclick = clearCanvas;
    document.getElementById("colorRed").onclick = red;
    document.getElementById("colorBlue").onclick = blue;
    document.getElementById("colorYellow").onclick = yellow;
    document.getElementById("colorGrey").onclick = grey;
    document.getElementById("smallS").onclick = small;
    document.getElementById("normalS").onclick = normal;
    document.getElementById("largeS").onclick = large;
    document.getElementById("hugeS").onclick = huge;
    document.getElementById("eraser").onclick = white;
};
var canvas;
var context;
var X = new Array();
var Y = new Array();
var Drag = new Array();
var paint;
var colorRed = "red";
var  colorBlue = "blue";
var colorYellow = "yellow";
var colorGrey = "grey";
var eraser = "white";
var  Color = new Array();
var cursorColor = colorGrey;
var  Size = new Array();
var cursorSize = "normal";

function Click(x, y, dragging) {
    X.push(x);
    Y.push(y);
    Drag.push(dragging);
    Color.push(cursorColor);
    Size.push(cursorSize);
}
function start(e) {//определеям положение курсора на холсте
    e = e || window.event;
    if (!e.pageX) {
        e.pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        e.pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    var mouseX = e.pageX - this.offsetLeft;
    var mouseY = e.pageY - this.offsetTop;

    paint = true;
    new Click(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
    newdraw();
}
function newdraw() {
    "use strict";
    var radius;
    context.lineJoin = "round";
    for (var i=0; i < X.length; i++) {//определяем размер кисти выбраной пользователем
        if(Size[i] == "small") {
            radius = 2;
        } else if(Size[i] == "normal") {
            radius = 5;
        } else if(Size[i] == "large") {
            radius = 10;
        } else if(Size[i] == "huge") {
            radius = 20;
        }
        //соединяем точки
        context.beginPath();
        if(Drag[i] && i){
            context.moveTo(X[i-1], Y[i-1]);
        } else {
            context.moveTo(X[i]-1, Y[i]);
        }
        context.lineTo(X[i], Y[i]);
        context.closePath();
        context.strokeStyle = Color[i];
        context.lineWidth = radius;
        context.stroke();
    }
}
function draw(e) {//рисуем, при передвижении курсора по холсту
    e = e || window.event;
    if (!e.pageX) {
        e.pageX = e.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        e.pageY = e.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    }
    if(paint) {
        Click(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
        newdraw();
    }
};
function leave(e) {//при выходе курсора за размеры холста, прекратить рисовать
    paint = false;
}
function stop(e) {//закончить рисовать
    paint = false;
    newdraw();
};
function clearCanvas()//очистка холста
{
    X = new Array();
    Y = new Array();
    Drag = new Array();
    Color = new Array();
    Size = new Array();
    context.clearRect(0, 0, canvas.width, canvas.height);
}
//цвета кисти
function red() {
    cursorColor = colorRed;
}
function blue() {
    cursorColor = colorBlue;
}
function grey() {
    cursorColor = colorGrey;
}
function yellow() {
    cursorColor = colorYellow;
}
//размеры кисти
function small() {
    cursorSize = "small";
}
function normal() {
    cursorSize = "normal";
}
function large() {
    cursorSize = "large";
}
function huge() {
    cursorSize = "huge";
}
//тёрка
function white() {
    cursorColor = eraser;
}
//запускаем скрипт при загрузке страницы
if (window.addEventListener) {
    window.addEventListener("load", pageLoad);
} else {//для ІЕ
    window.attachEvent("onload", pageLoad);
}
function allowDrop(ev) {
    ev.preventDefault();
}

function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
}
