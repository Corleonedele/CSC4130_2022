window.addEventListener('load', ()=>{
    document.addEventListener('click', click);    
    document.addEventListener('mousedown', canvasMouseDown);
    document.addEventListener('mouseup', canvasMouseUp);
    // document.addEventListener('mousemove', sketch);
});

var canvas = new fabric.Canvas("canvas");
var isDown, origX, origY;
var isDown = false;


var colorinput = document.getElementById("favcolor");
var slider = document.getElementById("opacity");
var output_o = document.getElementById("value");
var colorvalue = document.getElementById('colorVal');

output_o.innerHTML = slider.value;
colorvalue.innerHTML = colorinput.value;


var tooltype = "draw";
var shapetype = "circle";




let downPoint = null // 按下鼠标时的坐标
let upPoint = null // 松开鼠标时的坐标

function getPosition() {
  canvas.on('mouse:down', canvasMouseDown)   // 鼠标在画布上按下
  canvas.on('mouse:up', canvasMouseUp)       // 鼠标在画布上松开
}

// 鼠标在画布上按下
function canvasMouseDown(event) {
  // 鼠标左键按下时，将当前坐标 赋值给 downPoint。{x: xxx, y: xxx} 的格式
  downPoint = canvas.getPointer(event);
  // console.log("START",downPoint)
}

// 鼠标在画布上松开
function canvasMouseUp(event) {
  upPoint = canvas.getPointer(event);
  // console.log("END",upPoint)
  if (tooltype=="draw"){
    create()
  }
}


function create(){
  if (tooltype == "draw"){
    // console.log(tooltype, shapetype, colorinput.value, slider.value)

    if (shapetype=="circle"){
      var obj = new fabric.Circle({
        left : downPoint.x,
        top : downPoint.y,
        fill : colorinput.value,
        radius : Math.abs(downPoint.x-upPoint.x)/2,
        opacity: slider.value,
        evented: false,
        dirty:true,
      });
      
    }else if (shapetype=="rectangle"){
      var obj = new fabric.Rect({
        left : downPoint.x,
        top : downPoint.y,
        fill : colorinput.value,
        width: (upPoint.x-downPoint.x),  
        height: (upPoint.y-downPoint.y),  
        opacity: slider.value,
        evented: false,
        dirty:true,
      });

    }else if (shapetype=="triangle"){
      var obj = new fabric.Triangle({
        left : downPoint.x,
        top : downPoint.y,
        fill : colorinput.value,
        width: (upPoint.x-downPoint.x),    
        height: (upPoint.y-downPoint.y),  
        opacity: slider.value,
        evented: false,
        dirty:true,
      })
    }
  }
  canvas.add(obj);
}


function click(event){ 
  changeOpcaity(event)
  // console.log(tooltype)
  // if users click reset, clear all shapes in the interface (10pts)
  if (tooltype=="reset"){
    tooltype="reset";
    canvas.clear();
  } else if (tooltype=="move"){
    objs = canvas.getObjects()
    for (obj of objs){
      obj.evented=true
    }
    canvas.renderAll()
  }else if (tooltype=="draw"){
    objs = canvas.getObjects()
    for (obj of objs){
      obj.evented=false
    }
    canvas.renderAll()
  }
  /* your code is here */
}


function changeOpcaity(event){
  objs = canvas.getObjects()
  for (obj of objs){
    obj.opacity=slider.value;
  }
  canvas.renderAll()
}


function select_shape(shape){
  shapetype = shape.value;
}

function use_tool(tool){
  tooltype = tool;
}

slider.oninput = function() {
  output_o.innerHTML = this.value;
}

colorinput.oninput = function() {
  colorvalue.innerHTML = this.value;
}


