var graph = null;
var nodos = null;
var tramos = null;  
var datosBuses = null;
var vehiculos = null;
var encierros = null;
var imageData = null;
var posicion = null;
var interval=null;
var listaBloqueos = new Array();
var listaSinCom = new Array();
var listaExceso = new Array();
var listaFueraRuta = new Array();
var listaMantenimiento = new Array();
var listaEstatus = new Array();
var listaEncierro = new Array();
var puntero = 'auto';
//console.log(puntero);
var canvas = null;
var canvasBuses = null;
var canvasBloqueos = null;
var canvasSinCom = null;
var canvasExceso = null;
var canvasFueraRuta = null;
var canvasMantenimiento = null;
var canvasEstatus = null;
var canvasEncierro = null;
var ctx = null;
var ctxBuses = null;
var ctxBloqueos = null;
var ctxSinCom = null;
var ctxExceso = null;
var ctxFueraRuta = null;
var ctxMantenimiento = null;
var ctxEstatus = null;
var ctxEncierro = null;
var pInicio = 8;
var avanceX = 50;
var avanceY = 0;
var divCanvas = null;
var divCanvasBuses = null;
var nombreGrupo = "";
var sx = 1;
var sy = 1;

var currentX;
var currentY;
var initialX;
var initialY;

var max = {
  x: 0,
  y: 0
}

var min = {
  x: 0,
  y: 0
}

var mouse = {  
  drag: false
};

var centro = {
  x: 0,
  y: 0
}

const resize = () => {     
  var btn = document.getElementById("expandir");  
  var btnInicio = document.getElementById("inicio");  
  c1 = document.getElementById("linea1");
  c2 = document.getElementById("linea2");
  c1.width = document.body.clientWidth;
  c2.width = document.body.clientWidth;  
  
  if (document.body.clientWidth > 650) {
    btn.style.marginLeft = document.body.clientWidth - btn.getBoundingClientRect().width - 660 + 'px';    
    btnInicio.style.left = document.body.clientWidth - 50 + 'px';
  }
  if (nodos != null && nodos.getListaNodos().length > 0) {
    if (sx > 1.5) {
      if (document.fullscreenElement) {
        sx = 1.25;
        sy = 1.25;
      } else {
        sx = 1;
        sy = 1;
      }
    }
    var resta1 = document.body.clientWidth - (max.x - min.x) - 50;
    avanceX = (resta1 / 2) / 2;
    avanceY = 50;
    repintaTodo();
  }
}

addEventListener('resize', resize);
addEventListener('DOMContentLoaded', resize);

function mover(id, x, y) {
  $('#objeto' + id).animate({left: x + 250 + pInicio, top: 230 + y},
  {
    duration:800,
  });
 
} 

function writeMessage(posicion, message) {
  posicion.innerText = message;
}

// Get the position of the mouse relative to the canvas
function getMousePos(canvasDom, evt) {
  var rect = canvasDom.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function onMouseOver(event) {
  switch(puntero) {
    case "grab":
      $(canvas).css('cursor', puntero);
      $(canvasBuses).css('cursor', puntero);
      break;
    case "zoom-in":
      $(canvas).css('cursor', puntero);
      $(canvasBuses).css('cursor', puntero);
      break;
    case "zoom-out":
      $(canvas).css('cursor', puntero);
      $(canvasBuses).css('cursor', puntero);
      break;
  } 
}

function onMouseOut(event) {
  switch(puntero) {
    case "grab":
      mouse.drag = false;
      break;
    case "zoom-in":
      break;
    case "zoom-out":
      break;
  }  
  return false;
}

function onMouseUp(event) {
  if (puntero == 'grab') {          
    mouse.drag = !mouse.drag;
    initialX = currentX;
    initialY = currentY;
  }
  return false;
}

function onMouseDown(event) {
  var mousePos;
  switch(puntero) {
    case "auto":
      mousePos = getMousePos(canvasBuses, event);   
      if (vehiculos != null) {
        for (var i = 0; i < vehiculos.listaVehiculos.length; i++) {
          try {
            if (vehiculos.listaVehiculos[i].visible && vehiculos.listaVehiculos[i].mostrarInfo((mousePos.x - pInicio) * 0.77, mousePos.y * 0.77, mousePos.x, mousePos.y) === true) {
              if (typeof(vehiculos.listaVehiculos[i].googleURL) != "undefined") {
                window.open(vehiculos.listaVehiculos[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
              }
              return true;
            }
          } catch(error) {}
        }
      } 
      break;
    case "grab":
      mousePos = getMousePos(canvasBuses, event);
      mouse.drag = !mouse.drag;
      initialX = event.clientX - avanceX;
      initialY = event.clientY - avanceY;
      break;
    case "zoom-in":
      mousePos = getMousePos(canvasBuses, event);  
      zoomIn(mousePos.x, mousePos.y);
      break;
    case "zoom-out":
      mousePos = getMousePos(canvasBuses, event);  
      zoomOut(mousePos.x, mousePos.y);
      break;
  }    
  return false;
}

function onMouseDownFueraRuta(event) {
  var mousePos = getMousePos(canvasFueraRuta, event);      
  if (listaFueraRuta != null) {
    for (var i = 0; i < listaFueraRuta.length; i++) {
      try {
        if (listaFueraRuta[i].isOverFueraRuta(mousePos.x, mousePos.y) === true) {
          if (typeof(listaFueraRuta[i].googleURL) != "undefined") {
            window.open(listaFueraRuta[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
          }
          return true;
        }
      } catch(error) {}
    }
  }
  return false;
}

function onMouseDownBloqueos(event) {
  var mousePos = getMousePos(canvasBloqueos, event);    
  if (listaBloqueos != null) {
    for (var i = 0; i < listaBloqueos.length; i++) {
      try {
        if (listaBloqueos[i].isOverBloqueos(mousePos.x, mousePos.y) === true) {
          if (typeof(listaBloqueos[i].googleURL) != "undefined") {
            window.open(listaBloqueos[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
          }
          return true;
        }
      } catch(error) {}
    }
  }
  return false;
}

function onMouseDownSinCom(event) {
  var mousePos = getMousePos(canvasSinCom, event);        
  if (listaSinCom != null) {
    for (var i = 0; i < listaSinCom.length; i++) {
      try {
        if (listaSinCom[i].isOverSinCom(mousePos.x, mousePos.y) === true) {
          if (typeof(listaSinCom[i].googleURL) != "undefined") {
            window.open(listaSinCom[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
          }
          return true;
        }
      } catch(error) {}
    }
  }
  return false;
}

function onMouseDownMantenimiento(event) {
  var mousePos = getMousePos(canvasMantenimiento, event);    
  if (listaMantenimiento != null) {
    for (var i = 0; i < listaMantenimiento.length; i++) {
      try {
        if (listaMantenimiento[i].isOverMantenimiento(mousePos.x, mousePos.y) === true) {
          if (typeof(listaMantenimiento[i].googleURL) != "undefined") {
            window.open(listaMantenimiento[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
          }
          return true;
        }
      } catch(error) {}
    }
  }
  return false;
}

function onMouseDownExceso(event) {
  var mousePos = getMousePos(canvasExceso, event);      
  if (listaExceso != null) {
    for (var i = 0; i < listaExceso.length; i++) {
      try {
        if (listaExceso[i].isOverExceso(mousePos.x, mousePos.y) === true) {
          if (typeof(listaExceso[i].googleURL) != "undefined") {
            window.open(listaExceso[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
          }
          return true;
        }
      } catch(error) {}
    }
  }
  return false;
}

function onMouseDownEncierro(event) {
  var mousePos = getMousePos(canvasEncierro, event);      
  if (listaEncierro != null) {
    for (var i = 0; i < listaEncierro.length; i++) {
      try {
        if (listaEncierro[i].isOverEncierro(mousePos.x, mousePos.y) === true) {
          if (typeof(listaEncierro[i].googleURL) != "undefined") {
            window.open(listaEncierro[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
          }
          return true;
        }
      } catch(error) {}
    }
  }
  return false;
}

function onMouseMove(event) {
  var mousePos;
  if (puntero == 'auto') {          
    mousePos = getMousePos(canvasBuses, event); 
    mousePosWindows = getMousePos(document.body, event);   
    var result = false;    
    if (vehiculos != null) {
      for (var i = 0; i < vehiculos.listaVehiculos.length; i++) {
        try {
          if (vehiculos.listaVehiculos[i].visible && vehiculos.listaVehiculos[i].isOver((mousePos.x - pInicio) * 0.77, mousePos.y * 0.77, mousePosWindows.x, mousePosWindows.y) === true) {
            result = true;
            break;
          }
        } catch(error) {}
      }
    }
    if (result) {
      $(canvasBuses).css('cursor', 'pointer');
    }
    else {
      var iDiv = document.getElementById("iDatosBus");
      if (typeof(iDiv) != "undefined")
        iDiv.style.display = "none"; 
      $(canvasBuses).css('cursor', 'auto');
      iDiv = document.getElementById("iDatosBusFueraRuta");
      if (typeof(iDiv) != "undefined")
        iDiv.style.display = "none"; 
      $(canvasFueraRuta).css('cursor', 'auto');
      iDiv = document.getElementById("iDatosBusEncierro");
      if (typeof(iDiv) != "undefined")
        iDiv.style.display = "none"; 
      $(canvasEncierro).css('cursor', 'auto');
      iDiv = document.getElementById("iDatosBusMantenimiento");
      if (typeof(iDiv) != "undefined")
        iDiv.style.display = "none"; 
      $(canvasMantenimiento).css('cursor', 'auto');
      iDiv = document.getElementById("iDatosBusExceso");
      if (typeof(iDiv) != "undefined")
        iDiv.style.display = "none"; 
      $(canvasExceso).css('cursor', 'auto');
      iDiv = document.getElementById("iDatosBusBloqueos");
      if (typeof(iDiv) != "undefined")
        iDiv.style.display = "none"; 
      $(canvasBloqueos).css('cursor', 'auto');
      iDiv = document.getElementById("iDatosBusSinCom");
      if (typeof(iDiv) != "undefined")
        iDiv.style.display = "none"; 
      $(canvasSinCom).css('cursor', 'auto');
    }
    return result;
  } else {
    if (mouse.drag == true) {
      currentX = event.clientX - initialX;
      currentY = event.clientY - initialY;
      mousePos = getMousePos(canvasBuses, event);
      avanceX = currentX;
      avanceY = currentY;      
      repintaTodo();
    } 
  }
  return false;
}

function onMouseMoveFueraRuta(event) {
  var mousePos = getMousePos(canvasFueraRuta, event);    
  var result = false;    
  if (listaFueraRuta != null) {
    for (var i = 0; i < listaFueraRuta.length; i++) {
      try {
        if (listaFueraRuta[i].isOverFueraRuta(mousePos.x, mousePos.y) === true) {
          result = true;
          break;
        }
      } catch(error) {}
    }
  }
  if (result) {
    $(canvasFueraRuta).css('cursor', 'pointer');
  }
  else {
    var iDiv = document.getElementById("iDatosBusFueraRuta");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasFueraRuta).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBus");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasBuses).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusEncierro");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasEncierro).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusMantenimiento");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasMantenimiento).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusExceso");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasExceso).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusBloqueos");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasBloqueos).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusSinCom");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasSinCom).css('cursor', 'auto');
  }
  return result;
}

function onMouseMoveBloqueos(event) {
  var mousePos = getMousePos(canvasBloqueos, event);    
  var result = false;    
  if (listaBloqueos != null) {
    for (var i = 0; i < listaBloqueos.length; i++) {
      try {
        if (listaBloqueos[i].isOverBloqueos(mousePos.x, mousePos.y) === true) {
          result = true;
          break;
        }
      } catch(error) {}
    }
  }
  if (result) {
    $(canvasBloqueos).css('cursor', 'pointer');
  }
  else {
    var iDiv = document.getElementById("iDatosBusBloqueos");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasBloqueos).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusFueraRuta");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasFueraRuta).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusEncierro");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasEncierro).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusMantenimiento");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasMantenimiento).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusExceso");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasExceso).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBus");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasBuses).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusSinCom");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasSinCom).css('cursor', 'auto');
  }
  return result;
}

function onMouseMoveSinCom(event) {
  var mousePos = getMousePos(canvasSinCom, event);    
  var result = false;    
  if (listaSinCom != null) {
    for (var i = 0; i < listaSinCom.length; i++) {
      try {
        if (listaSinCom[i].isOverSinCom(mousePos.x, mousePos.y) === true) {
          result = true;
          break;
        }
      } catch(error) {}
    }
  }
  if (result) {
    $(canvasSinCom).css('cursor', 'pointer');
  }
  else {
    var iDiv = document.getElementById("iDatosBusSinCom");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasSinCom).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusFueraRuta");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasFueraRuta).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusEncierro");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasEncierro).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusMantenimiento");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasMantenimiento).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusExceso");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasExceso).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusBloqueos");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasBloqueos).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBus");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasBuses).css('cursor', 'auto');
  }
  return result;
}

function onMouseMoveExceso(event) {
  var mousePos = getMousePos(canvasExceso, event);    
  var result = false;    
  if (listaExceso != null) {
    for (var i = 0; i < listaExceso.length; i++) {
      try {
        if (listaExceso[i].isOverExceso(mousePos.x, mousePos.y) === true) {
          result = true;
          break;
        }
      } catch(error) {}
    }
  }
  if (result) {
    $(canvasExceso).css('cursor', 'pointer');
  }
  else {
    var iDiv = document.getElementById("iDatosBusExceso");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasExceso).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusFueraRuta");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasFueraRuta).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusEncierro");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasEncierro).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusMantenimiento");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasMantenimiento).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBus");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasBuses).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusBloqueos");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasBloqueos).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusSinCom");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasSinCom).css('cursor', 'auto');
  }
  return result;
}

function onMouseMoveMantenimiento(event) {
  var mousePos = getMousePos(canvasMantenimiento, event);    
  var result = false;    
  if (listaMantenimiento != null) {
    for (var i = 0; i < listaMantenimiento.length; i++) {
      try {
        if (listaMantenimiento[i].isOverMantenimiento(mousePos.x, mousePos.y) === true) {
          result = true;
          break;
        }
      } catch(error) {}
    }
  }
  if (result) {
    $(canvasMantenimiento).css('cursor', 'pointer');
  }
  else {
    var iDiv = document.getElementById("iDatosBusMantenimiento");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasMantenimiento).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusFueraRuta");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasFueraRuta).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusEncierro");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasEncierro).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBus");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasBuses).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusExceso");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasExceso).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusBloqueos");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasBloqueos).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusSinCom");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasSinCom).css('cursor', 'auto');
  }
  return result;
}

function onMouseMoveEncierro(event) {
  var mousePos = getMousePos(canvasEncierro, event);    
  var result = false;    
  if (listaEncierro != null) {
    for (var i = 0; i < listaEncierro.length; i++) {
      try {
        if (listaEncierro[i].isOverEncierro(mousePos.x, mousePos.y) === true) {
          result = true;
          break;
        }
      } catch(error) {}
    }
  }
  if (result) {
    $(canvasEncierro).css('cursor', 'pointer');
  }
  else {
    var iDiv = document.getElementById("iDatosBusEncierro");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasEncierro).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusFueraRuta");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasFueraRuta).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBus");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasBuses).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusMantenimiento");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasMantenimiento).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusExceso");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasExceso).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusBloqueos");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasBloqueos).css('cursor', 'auto');
    iDiv = document.getElementById("iDatosBusSinCom");
    if (typeof(iDiv) != "undefined")
      iDiv.style.display = "none"; 
    $(canvasSinCom).css('cursor', 'auto');
  }
  return result;
}
document.addEventListener('fullscreenchange', (event) => {
  if (document.fullscreenElement) {
    //console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
    document.getElementById('oculta').style.display = 'none';    
  } else {
    //console.log('Leaving full-screen mode.');
    document.getElementById('oculta').style.display = 'block';
    $("#mostrar").trigger("click");
  }
});

$(document).ready(function() 
{
  posicion = document.getElementById("posicion");
  canvas = document.getElementById("linea1");
  canvasBuses = document.getElementById("linea2");
  canvasBloqueos = document.getElementById("Bloqueos");
  canvasSinCom = document.getElementById("SinCom");
  canvasExceso = document.getElementById("Exceso");
  canvasFueraRuta = document.getElementById("FueraRuta");
  canvasMantenimiento = document.getElementById("Mantenimiento");
  canvasEstatus = document.getElementById("Estatus");
  canvasEncierro = document.getElementById("Encierro");
  divCanvas = document.getElementById("canvas1");
  divCanvasBuses = document.getElementById("canvas2");
  ctx = canvas.getContext("2d");
  ctxBuses = canvasBuses.getContext("2d");
  ctx.setTransform(1, 0, 0, 1, 0, 0);
	ctxBuses.setTransform(1, 0, 0, 1, 0, 0);
  ctx.scale(1.3, 1.3);
  ctxBuses.scale(1.3, 1.3);
  ctx.stroke();
  ctx.stroke(); 
  ctxBuses.stroke();
  ctxBuses.stroke();
  ctxBloqueos = canvasBloqueos.getContext("2d");
  ctxBloqueos.stroke();
  ctxSinCom = canvasSinCom.getContext("2d");
  ctxSinCom.stroke();
  ctxExceso = canvasExceso.getContext("2d");
  ctxExceso.stroke();
  ctxFueraRuta = canvasFueraRuta.getContext("2d");
  ctxFueraRuta.stroke();
  ctxMantenimiento = canvasMantenimiento.getContext("2d");
  ctxMantenimiento.stroke();
  ctxEstatus = canvasEstatus.getContext("2d");
  ctxEstatus.stroke();
  ctxEncierro = canvasEncierro.getContext("2d");
  ctxEncierro.stroke();
  canvasBuses.onmouseup = onMouseUp;
  canvasBuses.onmouseout = onMouseOut;
  canvasBuses.onmouseover = onMouseOver;
  canvasBuses.onmousedown = onMouseDown;
  canvasBloqueos.onmousedown = onMouseDownBloqueos;
  canvasSinCom.onmousedown = onMouseDownSinCom;
  canvasExceso.onmousedown = onMouseDownExceso;        
  canvasFueraRuta.onmousedown = onMouseDownFueraRuta;
  canvasMantenimiento.onmousedown = onMouseDownMantenimiento;
  canvasEncierro.onmousedown = onMouseDownEncierro;
  canvasBuses.onmousemove = onMouseMove;
  canvasBloqueos.onmousemove = onMouseMoveBloqueos;
  canvasSinCom.onmousemove = onMouseMoveSinCom;
  canvasExceso.onmousemove = onMouseMoveExceso;        
  canvasFueraRuta.onmousemove = onMouseMoveFueraRuta;
  canvasMantenimiento.onmousemove = onMouseMoveMantenimiento;
  canvasEncierro.onmousemove = onMouseMoveEncierro;
  ctxBuses.stroke();
  ctxBuses.stroke(); 

  var rutas = $('#rutas');
  var nodo = $('#nodo');
  var ruta_sel = $('#ruta_sel');


         
  $('#grupos').click(function() {
    canvas = document.getElementById("linea1");
    var grupo_id = $(this).val(); 
    var select = document.getElementById("grupos"), //El <select>
    value = select.value, //El valor seleccionado
    nombreGrupo = select.options[select.selectedIndex].innerText;
 
    if(grupo_id !== '') {                      
      $.ajax( {
        data: { grupo_id:grupo_id, nombre:nombreGrupo }, 
        dataType: 'html', 
        type: 'POST', 
        url: 'get_ruta.php' ,
      }).done(function(data) {             
        //console.log(data);
        rutas.html(data);
      });                    
    } else { 
      rutas.val('');
    }    
                
    if(nombreGrupo !== '') { 
      $.ajax( {
        data: { nombre:nombreGrupo }, 
        dataType: 'html', 
        type: 'POST', 
        url: 'get_nodo.php' 
      })
    }              
  });        


  $('#buscar').click(function() { 
    var encontrado = false;
    if (datosBuses != null) { 
      var i = 0;
      var countRuta = 0;
      for (i = 0; i < vehiculos.listaVehiculos.length; i++) {
        try {
          if (vehiculos.listaVehiculos[i].visible) {
            countRuta++;
          }
          if (vehiculos.listaVehiculos[i].visible && vehiculos.listaVehiculos[i].nombre == $("#txtBuscar").val()) {
            encontrado = true;
            if (!vehiculos.listaVehiculos[i].buscar) {
              vehiculos.listaVehiculos[i].buscar = true;
              ctxBuses.beginPath();
              ctxBuses.lineWidth = 0;
              ctxBuses.fillStyle = "red";
              ctxBuses.globalAlpha = 0.3;
              ctxBuses.arc((vehiculos.listaVehiculos[i].x * sx) + vehiculos.listaVehiculos[i].pInicio + avanceX, (vehiculos.listaVehiculos[i].y * sy) + avanceY, 10, 0, 2 * Math.PI);
              ctxBuses.stroke();
              ctxBuses.fill();
              ctxBuses.closePath();                
              ctxBuses.lineWidth = 1;
              ctxBuses.globalAlpha = 1;
            }
          } else {
            vehiculos.listaVehiculos[i].buscar = false;
          }
        } catch(error) {}
      }  
      var resaltarTitulo = false;
      for (i = 0; i < listaBloqueos.length; i++) {
        try {
          if (listaBloqueos[i].nombre == $("#txtBuscar").val()) {
            encontrado = true;
            resaltarTitulo = true;
            if (!listaBloqueos[i].buscarBloqueos) {
              listaBloqueos[i].buscarBloqueos = true;
              ctxBloqueos.beginPath();
              ctxBloqueos.lineWidth = 0;
              ctxBloqueos.fillStyle = "red";
              ctxBloqueos.globalAlpha = 0.3;
              ctxBloqueos.arc( listaBloqueos[i].xBloqueo,  listaBloqueos[i].yBloqueo, 10, 0, 2 * Math.PI);
              ctxBloqueos.stroke();
              ctxBloqueos.fill();
              ctxBloqueos.closePath();
              ctxBloqueos.lineWidth = 1;
              ctxBloqueos.globalAlpha = 1;
            }
          } else {
            listaBloqueos[i].buscarBloqueos = false;
          }
        } catch(error) {}
      }    
      var titulo = "Bloqueos: " + listaBloqueos.length.toString();
      ctxBloqueos.beginPath();
      ctxBloqueos.clearRect(0, 0, 200, 15);
      if (resaltarTitulo) {
        resaltarTitulo = false;
        ctxBloqueos.lineWidth = 0;
        ctxBloqueos.fillStyle = "red";
				ctxBloqueos.globalAlpha = 0.3;        
        ctxBloqueos.fillRect(0, 0, 200, 15);
        ctxBloqueos.stroke();        
      }      
      ctxBloqueos.lineWidth = 1;
      ctxBloqueos.globalAlpha = 1;
      ctxBloqueos.fillStyle = "#000000";
      ctxBloqueos.font = "700 12px Arial";
      ctxBloqueos.textAlign = "center";
      ctxBloqueos.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
      ctxBloqueos.stroke();   
      ctxBloqueos.closePath();
      for (i = 0; i < listaSinCom.length; i++) {
        try {
          if (listaSinCom[i].nombre == $("#txtBuscar").val()) {
            encontrado = true;
            resaltarTitulo = true;
            if (!listaSinCom[i].buscarSinCom) {
              listaSinCom[i].buscarSinCom = true;
              ctxSinCom.beginPath();
              ctxSinCom.lineWidth = 0;
              ctxSinCom.fillStyle = "red";
              ctxSinCom.globalAlpha = 0.3;
              ctxSinCom.arc( listaSinCom[i].xSinCom,  listaSinCom[i].ySinCom, 10, 0, 2 * Math.PI);
              ctxSinCom.stroke();
              ctxSinCom.fill();
              ctxSinCom.closePath();
              ctxSinCom.lineWidth = 1;
              ctxSinCom.globalAlpha = 1;
            }
          } else {
            listaSinCom[i].buscarSinCom = false;
          }
        } catch(error) {}
      }  
      titulo = "Sin Com: " + listaSinCom.length.toString() + "     Con Com: " + (vehiculos.listaVehiculos.length - listaSinCom.length);
      ctxSinCom.beginPath();
      ctxSinCom.clearRect(0, 0, 200, 15);
      if (resaltarTitulo) {
        resaltarTitulo = false;
        ctxSinCom.lineWidth = 0;
        ctxSinCom.fillStyle = "red";
				ctxSinCom.globalAlpha = 0.3;        
        ctxSinCom.fillRect(0, 0, 200, 15);
        ctxSinCom.stroke();        
      }      
      ctxSinCom.lineWidth = 1;
      ctxSinCom.globalAlpha = 1;
      ctxSinCom.fillStyle = "#000000";
      ctxSinCom.font = "700 12px Arial";
      ctxSinCom.textAlign = "center";
      ctxSinCom.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
      ctxSinCom.stroke();   
      ctxSinCom.closePath();
      for (i = 0; i < listaExceso.length; i++) {
        try {
          if (listaExceso[i].nombre == $("#txtBuscar").val()) {
            encontrado = true;
            resaltarTitulo = true;
            if (!listaExceso[i].buscarExceso) {
              listaExceso[i].buscarExceso = true;
              ctxExceso.beginPath();
              ctxExceso.lineWidth = 0;
              ctxExceso.fillStyle = "red";
              ctxExceso.globalAlpha = 0.3;
              ctxExceso.arc( listaExceso[i].xExceso,  listaExceso[i].yExceso, 10, 0, 2 * Math.PI);
              ctxExceso.stroke();
              ctxExceso.fill();
              ctxExceso.closePath();
              ctxExceso.lineWidth = 1;
              ctxExceso.globalAlpha = 1;
            }
          } else {
            listaExceso[i].buscarExceso = false;
          }
        } catch(error) {}
      } 
      titulo = "Exceso de Velocidad: " + listaExceso.length.toString();
      ctxExceso.beginPath();
      ctxExceso.clearRect(0, 0, 200, 15);
      if (resaltarTitulo) {
        resaltarTitulo = false;
        ctxExceso.lineWidth = 0;
        ctxExceso.fillStyle = "red";
				ctxExceso.globalAlpha = 0.3;        
        ctxExceso.fillRect(0, 0, 200, 15);
        ctxExceso.stroke();        
      }      
      ctxExceso.lineWidth = 1;
      ctxExceso.globalAlpha = 1;
      ctxExceso.fillStyle = "#000000";
      ctxExceso.font = "700 12px Arial";
      ctxExceso.textAlign = "center";
      ctxExceso.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
      ctxExceso.stroke();   
      ctxExceso.closePath(); 
      for (i = 0; i < listaFueraRuta.length; i++) {
        try {
          if (listaFueraRuta[i].nombre == $("#txtBuscar").val()) {
            encontrado = true;
            resaltarTitulo = true;
            //console.log(listaFueraRuta[i]);
            if (!listaFueraRuta[i].buscarFueraRuta) {
              listaFueraRuta[i].buscarFueraRuta = true;
              ctxFueraRuta.beginPath();
              ctxFueraRuta.lineWidth = 0;
              ctxFueraRuta.fillStyle = "red";
              ctxFueraRuta.globalAlpha = 0.3;
              ctxFueraRuta.arc( listaFueraRuta[i].xFuera,  listaFueraRuta[i].yFuera, 10, 0, 2 * Math.PI);
              ctxFueraRuta.stroke();
              ctxFueraRuta.fill();
              ctxFueraRuta.closePath();
              ctxFueraRuta.lineWidth = 1;
              ctxFueraRuta.globalAlpha = 1;
            }
          } else {
            listaFueraRuta[i].buscarFueraRuta = false;
          }
        } catch(error) {}
      } 
      titulo = "Fuera de Ruta: " + listaFueraRuta.length.toString() + " En Ruta: " + countRuta;
      ctxFueraRuta.beginPath();
      ctxFueraRuta.clearRect(0, 0, 200, 15);
      if (resaltarTitulo) {
        resaltarTitulo = false;
        ctxFueraRuta.lineWidth = 0;
        ctxFueraRuta.fillStyle = "red";
				ctxFueraRuta.globalAlpha = 0.3;        
        ctxFueraRuta.fillRect(0, 0, 200, 15);
        ctxFueraRuta.stroke();        
      }      
      ctxFueraRuta.lineWidth = 1;
      ctxFueraRuta.globalAlpha = 1;
      ctxFueraRuta.fillStyle = "#000000";
      ctxFueraRuta.font = "700 12px Arial";
      ctxFueraRuta.textAlign = "center";
      ctxFueraRuta.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
      ctxFueraRuta.stroke();   
      ctxFueraRuta.closePath(); 
      for (i = 0; i < listaMantenimiento.length; i++) {
        try {
          if (listaMantenimiento[i].nombre == $("#txtBuscar").val()) {
            encontrado = true;
            resaltarTitulo = true;
            if (!listaFueraRuta[i].buscarMantenimiento) {
              listaMantenimiento[i].buscarMantenimiento = true;
              ctxMantenimiento.beginPath();
              ctxMantenimiento.lineWidth = 0;
              ctxMantenimiento.fillStyle = "red";
              ctxMantenimiento.globalAlpha = 0.3;
              ctxMantenimiento.arc( listaMantenimiento[i].xMantenimiento,  listaMantenimiento[i].yMantenimiento, 10, 0, 2 * Math.PI);
              ctxMantenimiento.stroke();
              ctxMantenimiento.fill();
              ctxMantenimiento.closePath();
              ctxMantenimiento.lineWidth = 1;
              ctxMantenimiento.globalAlpha = 1;
            }
          } else {
            listaMantenimiento[i].buscarMantenimiento = false;
          }
        } catch(error) {}
      } 
      titulo = "Mantenimiento: " + listaMantenimiento.length.toString();
      ctxMantenimiento.beginPath();
      ctxMantenimiento.clearRect(0, 0, 200, 15);
      if (resaltarTitulo) {
        resaltarTitulo = false;
        ctxMantenimiento.lineWidth = 0;
        ctxMantenimiento.fillStyle = "red";
				ctxMantenimiento.globalAlpha = 0.3;        
        ctxMantenimiento.fillRect(0, 0, 200, 15);
        ctxMantenimiento.stroke();        
      }      
      ctxMantenimiento.lineWidth = 1;
      ctxMantenimiento.globalAlpha = 1;
      ctxMantenimiento.fillStyle = "#000000";
      ctxMantenimiento.font = "700 12px Arial";
      ctxMantenimiento.textAlign = "center";
      ctxMantenimiento.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
      ctxMantenimiento.stroke();   
      ctxMantenimiento.closePath(); 
      for (i = 0; i < listaEncierro.length; i++) {
        try {
          if (listaEncierro[i].nombre == $("#txtBuscar").val()) {
            encontrado = true;
            resaltarTitulo = true;
            if (!listaEncierro[i].buscarEncierro) {
              listaEncierro[i].buscarEncierro = true;
              ctxEncierro.beginPath();
              ctxEncierro.lineWidth = 0;
              ctxEncierro.fillStyle = "red";
              ctxEncierro.globalAlpha = 0.3;
              ctxEncierro.arc( listaEncierro[i].xEncierro,  listaEncierro[i].yEncierro, 10, 0, 2 * Math.PI);
              ctxEncierro.stroke();
              ctxEncierro.fill();
              ctxEncierro.closePath();
              ctxEncierro.lineWidth = 1;
              ctxEncierro.globalAlpha = 1;
            }
          } else {
            listaEncierro[i].buscarEncierro = false;
          }
        } catch(error) {}
      } 
      titulo = "Encierro: " + listaEncierro.length.toString();
      ctxEncierro.beginPath();
      ctxEncierro.clearRect(0, 0, 200, 15);
      if (resaltarTitulo) {
        ctxEncierro.lineWidth = 0;
        ctxEncierro.fillStyle = "red";
				ctxEncierro.globalAlpha = 0.3;        
        ctxEncierro.fillRect(0, 0, 200, 15);
        ctxEncierro.stroke();        
      }      
      ctxEncierro.lineWidth = 1;
      ctxEncierro.globalAlpha = 1;
      ctxEncierro.fillStyle = "#000000";
      ctxEncierro.font = "700 12px Arial";
      ctxEncierro.textAlign = "center";
      ctxEncierro.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
      ctxEncierro.stroke();   
      ctxEncierro.closePath(); 
    }
    if (!encontrado) {
      $("#txtBuscar").val("No se encontró");
    }
  });

  $('#borrar').click(function() {  
    $("#txtBuscar").val('');
    if (datosBuses != null) {
      var i = 0;
      for (i = 0; i < vehiculos.listaVehiculos.length; i++) {
        try {
          vehiculos.listaVehiculos[i].buscar = false;
        } catch(error) {}
      }  
      for (i = 0; i < listaBloqueos.length; i++) {
        try {
          listaBloqueos[i].buscarBloqueos = false;
        } catch(error) {}   
      }    
      for (i = 0; i < listaSinCom.length; i++) {
        try {
          listaSinCom[i].buscarSinCom = false;
        } catch(error) {}
      }  
      for (i = 0; i < listaExceso.length; i++) {
        try {
          listaExceso[i].buscarExceso = false;
        } catch(error) {}
      } 
      for (i = 0; i < listaFueraRuta.length; i++) {
        try {
          listaFueraRuta[i].buscarFueraRuta = false;
        } catch(error) {}
      } 
      for (i = 0; i < listaMantenimiento.length; i++) {
        try {
          listaMantenimiento[i].buscarMantenimiento = false;
        } catch(error) {}
      } 
      for (i = 0; i < listaEncierro.length; i++) {
        try {
          listaEncierro[i].buscarEncierro = false;
        } catch(error) {}
      } 
      actualizaCamiones(datosBuses['vehiculos'], ctxBuses, ctxBloqueos, ctxSinCom, ctxExceso, ctxFueraRuta, ctxMantenimiento, ctxEstatus, ctxEncierro);   
    }
    $("#txtBuscar").attr("placeholder", "Autobús a buscar");
  });

  $('#mano').click(function() {
    puntero = 'grab';
    //console.log(puntero);
    $(canvas).css('cursor', puntero);
    $(canvasBuses).css('cursor', puntero);
  }); 

  $('#puntero').click(function() {
    puntero = 'auto';
    //console.log(puntero);
    $(canvas).css('cursor', puntero);
    $(canvasBuses).css('cursor', puntero);
  }); 

  $('#expandir').click(function() {
    sx = 1.25;
    sy = 1.25;
    var elem = document.documentElement;
    if (elem.requestFullscreen) {
      elem.requestFullscreen();
    } else if (elem.webkitRequestFullscreen) { /* Safari */
      elem.webkitRequestFullscreen();
    } else if (elem.msRequestFullscreen) { /* IE11 */
      elem.msRequestFullscreen();    
    }  
  });       
  

  $('#zoomin').click(function() {
    puntero = 'zoom-in';
    $(canvas).css('cursor', puntero);
    $(canvasBuses).css('cursor', puntero);
    //zoomIn();    
  });  

  $('#zoomount').click(function() {
    puntero = 'zoom-out';
    $(canvas).css('cursor', puntero);
    $(canvasBuses).css('cursor', puntero);
    //zoomOut();
  }); 

  $('#regresar').click(function() {
    oneToOne();
    $("#puntero").trigger("click");
  }); 

  $('#hide').click(function() {
    if ($("#eye").hasClass("fa-eye-slash")) {
      $("#eye").removeClass("fa-eye-slash");
      $("#eye").addClass("fa-eye");
      document.getElementById("foo").style.display="none";
    } else {
      $("#eye").removeClass("fa-eye");
      $("#eye").addClass("fa-eye-slash");
      document.getElementById("foo").style.display="block";
    }    
  });

  $('#mostrar').click(function() {    
    sx = 1;
	  sy = 1;
	  avanceX = 0;
	  avanceY = 0;   
    $('#linea1').html('<div class="loading"><img src="loader.gif" alt="loading" /><br/>Un momento, por favor...</div>');   
     
    var select = document.getElementById("grupos");
    nombre = select.options[select.selectedIndex].innerText;        
    var id = $("#rutas").val(); 
    if(id !== '') {             
      $.ajax( {
        data: { id:id, nombre:nombre }, 
          dataType: 'html',
          type: 'POST', 
          url: 'get_nodo.php' 
      }).done(function(data) {  
        $('#linea1').fadeIn(1000).html(canvas);
        var datos=JSON.parse(data);       
        var buses = $('[id^="objeto"]');
        for (var j = 0; j < buses.length; j++) {
          try {
            buses[j].parentNode.removeChild(buses[j]);
          } catch(error) {}
        }         
        canvas = document.getElementById("linea1");
        
        if (canvas && canvas.getContext) {
          ctx = canvas.getContext("2d");
          nodos = new Nodos(datos['nodos']);
          tramos = new Tramos(datos['tramos']);
          vehiculos = new Vehiculos(datos['vehiculos'], ctxBuses, pInicio, avanceX, avanceY);
          encierros = new Encierros(datos['encierros']);
          min.x = datos['minx'];
          min.y = datos['miny'];
          max.x = datos['maxx'];
          max.y = datos['maxy'];
          //console.log(datos['encierros']);
          if (ctx) {      
            var resta1 = document.body.clientWidth - (max.x - min.x) - 50;
            avanceX = (resta1 / 2) / 2;
            avanceY = 80;
                    
            // Limpiamos el canvas
            ctx.setTransform(1, 0, 0, 1, 0, 0);
            ctxBuses.setTransform(1, 0, 0, 1, 0, 0);
            ctx.scale(1.3, 1.3);
            ctxBuses.scale(1.3, 1.3);           
            ctx.clearRect(0, 0, canvas.width, canvas.height);  
            ctxBuses.clearRect(0, 0, canvasBuses.width, canvasBuses.height);  
            centro.x = canvas.width / 2;
            centro.y = canvas.height / 2;            
            var i = 0;
            if (interval != null)
              clearInterval(interval);
            while (i < nodos.getListaNodos().length) {
              try {
                ctx.lineWidth = 4;
                ctx.strokeStyle = "#FFD700";
                ctx.beginPath();
                ctx.moveTo((nodos.getListaNodos()[i].getX() * sx) + pInicio + avanceX, (nodos.getListaNodos()[i].getY() * sy) + avanceY);
                if (tramos.getListaTramos()[i].getNodoFin() != null) {
                  ctx.lineTo((tramos.getListaTramos()[i].getNodoFin().getX() * sx) + pInicio + avanceX, (tramos.getListaTramos()[i].getNodoFin().getY() * sy) + avanceY);
                }
                ctx.closePath();
                ctx.stroke();
                ctx.save(); 
                ctx.lineWidth = 2;                    
                ctx.font = "700 8.2px Arial";
                switch(nodos.getListaNodos()[i].getIcono()) {
                  case 1:
                    ctx.beginPath();
                    ctx.fillStyle = "#FFD700"; 
                    ctx.rect((nodos.getListaNodos()[i].getX() * sx) + pInicio - 1 + avanceX, (nodos.getListaNodos()[i].getY() * sy) + avanceY - 6, 2, 12); 
                    ctx.fill();   
                    ctx.stroke();                                       
                    ctx.closePath();
                    ctx.save();
                    ctx.beginPath();
                    ctx.fillStyle = "#000000";
                    ctx.rotate(90 * (Math.PI / 180));
                    ctx.fillText(nodos.getListaNodos()[i].getNombre().split("").join(String.fromCharCode(8202)), (nodos.getListaNodos()[i].getY() * sx) + pInicio + avanceY, (((nodos.getListaNodos()[i].getX() * sy) + pInicio - 3) * -1) - avanceX);
                    ctx.closePath();
                    ctx.restore();  
                  break;
                  case 3:
                    ctx.beginPath();
                    ctx.fillStyle = "#FFD700";
                    ctx.rect((nodos.getListaNodos()[i].getX() * sx) + pInicio + avanceX - 1, (nodos.getListaNodos()[i].getY() * sy) + avanceY - 6, 2, 12); 
                    ctx.fill();  
                    ctx.stroke();                                        
                    ctx.closePath(); 
                    ctx.save();
                    ctx.beginPath();
                    ctx.fillStyle = "#000000";
                    ctx.rotate(270 * (Math.PI / 180));
                    ctx.fillText(nodos.getListaNodos()[i].getNombre().split("").join(String.fromCharCode(8202)), ((nodos.getListaNodos()[i].getY() * sx) * -1) + pInicio - (avanceY), (nodos.getListaNodos()[i].getX() * sy) + (pInicio * 1.4) + avanceX); 
                    ctx.closePath();
                    ctx.restore();                        
                  break;
                  case 16:
                    ctx.beginPath();
                    ctx.fillStyle = "#FFD700";
                    ctx.rect((nodos.getListaNodos()[i].getX() * sx) + pInicio + avanceX - 6, (nodos.getListaNodos()[i].getY() * sy) + avanceY, 12, 2);
                    ctx.fill(); 
                    ctx.stroke();                                         
                    ctx.closePath();
                    ctx.save();
                    ctx.beginPath();
                    ctx.fillStyle = "#000000";
                    ctx.font = "700 8px Arial";
                    ctx.fillText(nodos.getListaNodos()[i].getNombre().split("").join(String.fromCharCode(8202)), (nodos.getListaNodos()[i].getX() * sx) + pInicio + avanceX + 14, (nodos.getListaNodos()[i].getY() * sy) + 4 + avanceY); 
                    ctx.closePath();
                    ctx.restore();    
                  break;
                  case 17:
                    ctx.beginPath();
                    ctx.fillStyle = "#FFD700";
                    ctx.rect((nodos.getListaNodos()[i].getX() * sx) + pInicio + avanceX - 6, (nodos.getListaNodos()[i].getY() * sy) + avanceY, 12, 2);
                    ctx.fill(); 
                    ctx.stroke();                                         
                    ctx.closePath();
                    ctx.save();
                    ctx.beginPath();
                    ctx.fillStyle = "#000000";
                    ctx.font = "700 8px Arial";
                    ctx.textAlign = "right";
                    ctx.fillText(nodos.getListaNodos()[i].getNombre().split("").join(String.fromCharCode(8202)), (nodos.getListaNodos()[i].getX() * sx) + avanceX - 6, (nodos.getListaNodos()[i].getY() * sy) + 4 + avanceY); 
                    ctx.closePath();
                    ctx.restore();    
                  break;
                  case 12:
                    ctx.beginPath();
                    ctx.fillStyle = "#FFD700";
                    ctx.rect((nodos.getListaNodos()[i].getX() * sx) + pInicio + avanceX - 6, ((nodos.getListaNodos()[i].getY() * sy) + avanceY) , 12, 2);
                    ctx.fill(); 
                    ctx.stroke();                                         
                    ctx.closePath();
                    ctx.save();
                    ctx.beginPath();
                    ctx.fillStyle = "#000000";
                    ctx.font = "700 8px Arial";
                    ctx.fillText(nodos.getListaNodos()[i].getNombre().split("").join(String.fromCharCode(8202)), (nodos.getListaNodos()[i].getX() * sx) + avanceX, (nodos.getListaNodos()[i].getY() * sy) + 4 + avanceY); 
                    ctx.closePath();
                    ctx.restore();    
                  break;
                  case 18:
                    ctx.beginPath();
                    ctx.fillStyle = "#FFD700";
                    ctx.rect((nodos.getListaNodos()[i].getX() * sx) + pInicio + avanceX - 6, ((nodos.getListaNodos()[i].getY() * sy) + avanceY) , 12, 2);
                    ctx.fill(); 
                    ctx.stroke();                                         
                    ctx.closePath();
                    ctx.save();
                    ctx.restore();    
                  break;
                  case 19:
                    ctx.beginPath();
                    ctx.fillStyle = "#FFD700"; 
                    ctx.rect((nodos.getListaNodos()[i].getX() * sx) + pInicio +avanceX - 1, ((nodos.getListaNodos()[i].getY() * sy) + avanceY) - 6 , 2, 12); 
                    ctx.fill();   
                    ctx.stroke();                                       
                    ctx.closePath();
                    ctx.save();
                    ctx.restore();  
                  break;
                } 
              } catch(error) {}
              i++;
            } 
            ctx.save();
            initCamiones(ctxBuses);
            actualizaCamiones(datos['vehiculos'], ctxBuses, ctxBloqueos, ctxSinCom, ctxExceso, ctxFueraRuta, ctxMantenimiento, ctxEstatus, ctxEncierro);
            interval = setInterval(function () {
              $.ajax( {
                data: { id:id, nombre:nombre }, 
                  dataType: 'html',
                  type: 'POST', 
                  url: 'get_posiciones.php' 
              }).done(function(data) { 
                try {
                  datosBuses = JSON.parse(data);     
                  //console.log('Timer: '); 
                  actualizaCamiones(datosBuses['vehiculos'], ctxBuses, ctxBloqueos, ctxSinCom, ctxExceso, ctxFueraRuta, ctxMantenimiento, ctxEstatus, ctxEncierro);   
                }
                catch(error) {
                }      
              }); 
            }, 5000);            
          }
        }
      });
    } else { 
      nodo.val('');
    }                                                                                                    
  });       
});             