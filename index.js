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
console.log(puntero);
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
var divCanvas = null;
var divCanvasBuses = null;
var mouse = {
  x: 0,
  y: 0,
  drag: false
};


function mover(id, x, y) {
  $('#objeto' + id).animate({left:x+250+pInicio,top:230+y},
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

function onMouseOut(event) {
  if (puntero == 'grab') {          
    mouse.drag = false;
  }
  return false;
}

function onMouseUp(event) {
  if (puntero == 'grab') {          
    mouse.drag = !mouse.drag;
  }
  return false;
}

function onMouseDown(event) {
  var mousePos;
  if (puntero != 'grab') {
    mousePos = getMousePos(canvasBuses, event);   
    if (vehiculos != null) {
      for (var i = 0; i < vehiculos.listaVehiculos.length; i++) {
        if (vehiculos.listaVehiculos[i].visible && vehiculos.listaVehiculos[i].mostrarInfo((mousePos.x - pInicio) * 0.77, mousePos.y * 0.77, mousePos.x, mousePos.y) === true) {
          if (typeof(vehiculos.listaVehiculos[i].googleURL) != "undefined") {
            window.open(vehiculos.listaVehiculos[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
          }
          return true;
        }
      }
    } 
  } else {
    mousePos = getMousePos(canvasBuses, event);
    mouse.drag = !mouse.drag;
    mouse.x = mousePos.x;
    mouse.y = mousePos.y;
    if (mouse.grab == true) {
      console.log("Started to drag");
    } else {
      console.log("Finished dragging.");
    }
  }
  return false;
}

function onMouseDownFueraRuta(event) {
  var mousePos = getMousePos(canvasFueraRuta, event);      
  if (listaFueraRuta != null) {
    for (var i = 0; i < listaFueraRuta.length; i++) {
      if (listaFueraRuta[i].isOverFueraRuta(mousePos.x, mousePos.y) === true) {
        if (typeof(listaFueraRuta[i].googleURL) != "undefined") {
          window.open(listaFueraRuta[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
        }
        return true;
      }
    }
  }
  return false;
}

function onMouseDownBloqueos(event) {
  var mousePos = getMousePos(canvasBloqueos, event);    
  if (listaBloqueos != null) {
    for (var i = 0; i < listaBloqueos.length; i++) {
      if (listaBloqueos[i].isOverBloqueos(mousePos.x, mousePos.y) === true) {
        if (typeof(listaBloqueos[i].googleURL) != "undefined") {
          window.open(listaBloqueos[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
        }
        return true;
      }
    }
  }
  return false;
}

function onMouseDownSinCom(event) {
  var mousePos = getMousePos(canvasSinCom, event);        
  if (listaSinCom != null) {
    for (var i = 0; i < listaSinCom.length; i++) {
      if (listaSinCom[i].isOverSinCom(mousePos.x, mousePos.y) === true) {
        if (typeof(listaSinCom[i].googleURL) != "undefined") {
          window.open(listaSinCom[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
        }
        return true;
      }
    }
  }
  return false;
}

function onMouseDownMantenimiento(event) {
  var mousePos = getMousePos(canvasMantenimiento, event);    
  if (listaMantenimiento != null) {
    for (var i = 0; i < listaMantenimiento.length; i++) {
      if (listaMantenimiento[i].isOverMantenimiento(mousePos.x, mousePos.y) === true) {
        if (typeof(listaMantenimiento[i].googleURL) != "undefined") {
          window.open(listaMantenimiento[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
        }
        return true;
      }
    }
  }
  return false;
}

function onMouseDownExceso(event) {
  var mousePos = getMousePos(canvasExceso, event);      
  if (listaExceso != null) {
    for (var i = 0; i < listaExceso.length; i++) {
      if (listaExceso[i].isOverExceso(mousePos.x, mousePos.y) === true) {
        if (typeof(listaExceso[i].googleURL) != "undefined") {
          window.open(listaExceso[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
        }
        return true;
      }
    }
  }
  return false;
}

function onMouseDownEncierro(event) {
  var mousePos = getMousePos(canvasEncierro, event);      
  if (listaEncierro != null) {
    for (var i = 0; i < listaEncierro.length; i++) {
      if (listaEncierro[i].isOverEncierro(mousePos.x, mousePos.y) === true) {
        if (typeof(listaEncierro[i].googleURL) != "undefined") {
          window.open(listaEncierro[i].googleURL,"miruta","width=500,height=500,scrollbars=NO");
        }
        return true;
      }
    }
  }
  return false;
}

function onMouseMove(event) {
  var mousePos;
  if (puntero != 'grab') {          
    mousePos = getMousePos(canvasBuses, event);    
    var result = false;    
    if (vehiculos != null) {
      for (var i = 0; i < vehiculos.listaVehiculos.length; i++) {
        if (vehiculos.listaVehiculos[i].visible && vehiculos.listaVehiculos[i].isOver((mousePos.x - pInicio) * 0.77, mousePos.y * 0.77, mousePos.x, mousePos.y) === true) {
          result = true;
          break;
        }
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
    console.log("mouse.drag=" + mouse.drag);
    if (mouse.drag == true) {
      mousePos = getMousePos(canvasBuses, event);
      if (mousePos.y < mouse.y) {
        divCanvasBuses.style.top = (parseFloat(divCanvasBuses.style.top) - (mouse.y - mousePos.y)) + "px";
        divCanvas.style.top = divCanvasBuses.style.top;
      } else {
        divCanvasBuses.style.top = (parseFloat(divCanvasBuses.style.top) + (mousePos.y - mouse.y)) + "px";
        divCanvas.style.top = divCanvasBuses.style.top;
      }
      if (mousePos.x < mouse.x) {
        divCanvasBuses.style.left = (parseFloat(divCanvasBuses.style.left) - (mouse.x - mousePos.x)) + "px";
        divCanvas.style.left = divCanvasBuses.style.left;
      } else {
        divCanvasBuses.style.left = (parseFloat(divCanvasBuses.style.left) + (mousePos.x - mouse.x)) + "px";
        divCanvas.style.left = divCanvasBuses.style.left;
      }
    }     
  }
  return false;
}

function onMouseMoveFueraRuta(event) {
  var mousePos = getMousePos(canvasFueraRuta, event);    
  var result = false;    
  if (listaFueraRuta != null) {
    for (var i = 0; i < listaFueraRuta.length; i++) {
      if (listaFueraRuta[i].isOverFueraRuta(mousePos.x, mousePos.y) === true) {
        result = true;
        break;
      }
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
      if (listaBloqueos[i].isOverBloqueos(mousePos.x, mousePos.y) === true) {
        result = true;
        break;
      }
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
      if (listaSinCom[i].isOverSinCom(mousePos.x, mousePos.y) === true) {
        result = true;
        break;
      }
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
      if (listaExceso[i].isOverExceso(mousePos.x, mousePos.y) === true) {
        result = true;
        break;
      }
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
      if (listaMantenimiento[i].isOverMantenimiento(mousePos.x, mousePos.y) === true) {
        result = true;
        break;
      }
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
      if (listaEncierro[i].isOverEncierro(mousePos.x, mousePos.y) === true) {
        result = true;
        break;
      }
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
    console.log(`Element: ${document.fullscreenElement.id} entered full-screen mode.`);
    document.getElementById('oculta').style.display = 'none';
  
  } else {
    console.log('Leaving full-screen mode.');
    document.getElementById('oculta').style.display = 'block';
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
  ctx.scale(1.3, 1.3);
  ctx.stroke();
  ctx.stroke(); 
  ctxBuses = canvasBuses.getContext("2d");
  ctxBuses.scale(1.3, 1.3);
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
    nombre = select.options[select.selectedIndex].innerText;
 
    if(grupo_id !== '') {                      
      $.ajax( {
        data: { grupo_id:grupo_id, nombre:nombre }, 
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
                
    if(nombre !== '') { 
      $.ajax( {
        data: { nombre:nombre }, 
        dataType: 'html', 
        type: 'POST', 
        url: 'get_nodo.php' 
      })
    }              
  });        


  $('#buscar').click(function() { 
    if (datosBuses != null) { 
      var i = 0;
      for (i = 0; i < vehiculos.listaVehiculos.length; i++) {
        if (vehiculos.listaVehiculos[i].visible && vehiculos.listaVehiculos[i].nombre == $("#txtBuscar").val()) {
          vehiculos.listaVehiculos[i].buscar = true;
          ctxBuses.beginPath();
          ctxBuses.lineWidth = 0;
          ctxBuses.fillStyle = "red";
          ctxBuses.globalAlpha = 0.3;
          ctxBuses.arc(vehiculos.listaVehiculos[i].x + vehiculos.listaVehiculos[i].pInicio, vehiculos.listaVehiculos[i].y, 10, 0, 2 * Math.PI);
          ctxBuses.stroke();
          ctxBuses.fill();
          ctxBuses.closePath();
          ctxBuses.lineWidth = 1;
          ctxBuses.globalAlpha = 1;
        } else {
          vehiculos.listaVehiculos[i].buscar = false;
        }
      }  
      for (i = 0; i < listaBloqueos.length; i++) {
        if (listaBloqueos[i].nombre == $("#txtBuscar").val()) {
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
        } else {
          listaBloqueos[i].buscarBloqueos = false;
        }
      }    
      for (i = 0; i < listaSinCom.length; i++) {
        if (listaSinCom[i].nombre == $("#txtBuscar").val()) {
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
        } else {
          listaSinCom[i].buscarSinCom = false;
        }
      }  
      for (i = 0; i < listaExceso.length; i++) {
        if (listaExceso[i].nombre == $("#txtBuscar").val()) {
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
        } else {
          listaExceso[i].buscarExceso = false;
        }
      } 
      for (i = 0; i < listaFueraRuta.length; i++) {
        if (listaFueraRuta[i].nombre == $("#txtBuscar").val()) {
          console.log(listaFueraRuta[i]);
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
        } else {
          listaFueraRuta[i].buscarFueraRuta = false;
        }
      } 
      for (i = 0; i < listaMantenimiento.length; i++) {
        if (listaMantenimiento[i].nombre == $("#txtBuscar").val()) {
          listaFueraRuta[i].buscarMantenimiento = true;
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
        } else {
          listaMantenimiento[i].buscarMantenimiento = false;
        }
      } 
      for (i = 0; i < listaEncierro.length; i++) {
        if (listaEncierro[i].nombre == $("#txtBuscar").val()) {
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
        } else {
          listaEncierro[i].buscarEncierro = false;
        }
      } 
    }
  });

  $('#borrar').click(function() {  
    $("#txtBuscar").val('');
    if (datosBuses != null) {
      var i = 0;
      for (i = 0; i < vehiculos.listaVehiculos.length; i++) {
        vehiculos.listaVehiculos[i].buscar = false;
      }  
      for (i = 0; i < listaBloqueos.length; i++) {
        listaBloqueos[i].buscarBloqueos = false;
      }    
      for (i = 0; i < listaSinCom.length; i++) {
        listaSinCom[i].buscarSinCom = false;
      }  
      for (i = 0; i < listaExceso.length; i++) {
        listaExceso[i].buscarExceso = false;
      } 
      for (i = 0; i < listaFueraRuta.length; i++) {
        listaFueraRuta[i].buscarFueraRuta = false;
      } 
      for (i = 0; i < listaMantenimiento.length; i++) {
        listaMantenimiento[i].buscarMantenimiento = false;
      } 
      for (i = 0; i < listaEncierro.length; i++) {
        listaEncierro[i].buscarEncierro = false;
      } 
      actualizaCamiones(datosBuses['vehiculos'], ctxBuses, ctxBloqueos, ctxSinCom, ctxExceso, ctxFueraRuta, ctxMantenimiento, ctxEstatus, ctxEncierro);   
    }
  });

  $('#mano').click(function() {
    puntero = 'grab';
    console.log(puntero);
    $(canvas).css('cursor', puntero);
    $(canvasBuses).css('cursor', puntero);
  }); 

  $('#puntero').click(function() {
    puntero = 'auto';
    console.log(puntero);
    $(canvas).css('cursor', puntero);
    $(canvasBuses).css('cursor', puntero);
  }); 

  $('#expandir').click(function() {
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

    if (canvas.style.zoom == "") {
      canvas.style.zoom = "150%";
    } else {
      canvas.style.zoom = (parseFloat(canvas.style.zoom) + 50) + "%";
    }
    if (canvasBuses.style.zoom == "") {
      canvasBuses.style.zoom = "150%";
    } else {
      canvasBuses.style.zoom = (parseFloat(canvasBuses.style.zoom) + 50) + "%";
    }
  });  

  $('#zoomount').click(function() {
    if (canvas.style.zoom == "") {
      canvas.style.zoom = "100%";
    } else {
      if (parseFloat(canvas.style.zoom) != 100) {
        canvas.style.zoom = (parseFloat(canvas.style.zoom) - 50) + "%";
      }
    }
    if (canvasBuses.style.zoom == "") {
      canvasBuses.style.zoom = "100%";
    } else {
      if (parseFloat(canvasBuses.style.zoom) != 100) {
        canvasBuses.style.zoom = (parseFloat(canvasBuses.style.zoom) - 50) + "%";
      }
    }
  }); 

  $('#regresar').click(function() {
    $("#linea1").css("zoom","100%");
    $("#linea2").css("zoom","100%");
  }); 

  $('#mostrar').click(function() {      
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
          buses[j].parentNode.removeChild(buses[j]);
        }         
        canvas = document.getElementById("linea1");
        
        if (canvas && canvas.getContext) {
          ctx = canvas.getContext("2d");
          nodos = new Nodos(datos['nodos']);
          tramos = new Tramos(datos['tramos']);
          vehiculos = new Vehiculos(datos['vehiculos'], ctxBuses, pInicio);
          encierros = new Encierros(datos['encierros']);
          //console.log(datos['encierros']);
          if (ctx) {
             // Limpiamos el canvas
             ctx.clearRect(0, 0, canvas.width, canvas.height);  
            ctxBuses.clearRect(0, 0, canvasBuses.width, canvasBuses.height);  
            var i = 0;
            if (interval != null)
              clearInterval(interval);
            while (i < nodos.getListaNodos().length) {
              ctx.lineWidth = 4;
              ctx.strokeStyle = "#FFD700";
              ctx.beginPath();
              ctx.moveTo(nodos.getListaNodos()[i].getX() + pInicio, nodos.getListaNodos()[i].getY());
              if (tramos.getListaTramos()[i].getNodoFin() != null) {
                ctx.lineTo(tramos.getListaTramos()[i].getNodoFin().getX() + pInicio, tramos.getListaTramos()[i].getNodoFin().getY());
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
                  ctx.rect(nodos.getListaNodos()[i].getX() + pInicio - 1, nodos.getListaNodos()[i].getY() - 6 , 2, 12); 
                  ctx.fill();   
                  ctx.stroke();                                       
                  ctx.closePath();
                  ctx.save();
                  ctx.beginPath();
                  ctx.fillStyle = "#000000";
                  ctx.rotate(90 * (Math.PI / 180));
                  ctx.fillText(nodos.getListaNodos()[i].getNombre().split("").join(String.fromCharCode(8202)), nodos.getListaNodos()[i].getY() + pInicio, (nodos.getListaNodos()[i].getX() + pInicio - 3) * -1); 
                  ctx.closePath();
                  ctx.restore();  
                  break;
                case 3:
                  ctx.beginPath();
                  ctx.fillStyle = "#FFD700";
                  ctx.rect(nodos.getListaNodos()[i].getX() + pInicio - 1, nodos.getListaNodos()[i].getY() - 6 , 2, 12); 
                  ctx.fill();  
                  ctx.stroke();                                        
                  ctx.closePath(); 
                  ctx.save();
                  ctx.beginPath();
                  ctx.fillStyle = "#000000";
                  ctx.rotate(270 * (Math.PI / 180));
                  ctx.fillText(nodos.getListaNodos()[i].getNombre().split("").join(String.fromCharCode(8202)), (nodos.getListaNodos()[i].getY() * -1) + pInicio, nodos.getListaNodos()[i].getX() + (pInicio * 1.4)); 
                  ctx.closePath();
                  ctx.restore();                        
                  break;
                case 16:
                  ctx.beginPath();
                  ctx.fillStyle = "#FFD700";
                  ctx.rect(nodos.getListaNodos()[i].getX() + pInicio - 6, nodos.getListaNodos()[i].getY() , 12, 2);
                  ctx.fill(); 
                  ctx.stroke();                                         
                  ctx.closePath();
                  ctx.save();
                  ctx.beginPath();
                  ctx.fillStyle = "#000000";
                  ctx.font = "700 8px Arial";
                  ctx.fillText(nodos.getListaNodos()[i].getNombre().split("").join(String.fromCharCode(8202)), nodos.getListaNodos()[i].getX() + pInicio + 6, nodos.getListaNodos()[i].getY() + 4); 
                  ctx.closePath();
                  ctx.restore();    
                  break;
                case 17:
                  ctx.beginPath();
                  ctx.fillStyle = "#FFD700";
                  ctx.rect(nodos.getListaNodos()[i].getX() + pInicio - 6, nodos.getListaNodos()[i].getY() , 12, 2);
                  ctx.fill(); 
                  ctx.stroke();                                         
                  ctx.closePath();
                  ctx.save();
                  ctx.beginPath();
                  ctx.fillStyle = "#000000";
                  ctx.font = "700 8px Arial";
                  ctx.textAlign = "right";
                  ctx.fillText(nodos.getListaNodos()[i].getNombre().split("").join(String.fromCharCode(8202)), nodos.getListaNodos()[i].getX(), nodos.getListaNodos()[i].getY() + 4); 
                  ctx.closePath();
                  ctx.restore();    
                  break;
                  case 12:
                  ctx.beginPath();
                  ctx.fillStyle = "#FFD700";
                  ctx.rect((nodos.getListaNodos()[i].getX()) + pInicio - 6, (nodos.getListaNodos()[i].getY()) , 12, 2);
                  ctx.fill(); 
                  ctx.stroke();                                         
                  ctx.closePath();
                  ctx.save();
                  ctx.beginPath();
                  ctx.fillStyle = "#000000";
                  ctx.font = "700 8px Arial";
                  ctx.fillText(nodos.getListaNodos()[i].getNombre().split("").join(String.fromCharCode(8202)), (nodos.getListaNodos()[i].getX()), (nodos.getListaNodos()[i].getY()) + 4); 
                  ctx.closePath();
                  ctx.restore();    
                  break;
                  case 18:
                  ctx.beginPath();
                  ctx.fillStyle = "#FFD700";
                  ctx.rect((nodos.getListaNodos()[i].getX()) + pInicio - 6, (nodos.getListaNodos()[i].getY()) , 12, 2);
                  ctx.fill(); 
                  ctx.stroke();                                         
                  ctx.closePath();
                  ctx.save();
                  ctx.restore();    
                  break;
                  case 19:
                  ctx.beginPath();
                  ctx.fillStyle = "#FFD700"; 
                  ctx.rect((nodos.getListaNodos()[i].getX()) + pInicio - 1, (nodos.getListaNodos()[i].getY()) - 6 , 2, 12); 
                  ctx.fill();   
                  ctx.stroke();                                       
                  ctx.closePath();
                  ctx.save();
                  ctx.restore();  
                  break;
              } 
              i++;
            } 
            ctx.save();
            //console.log('initCamiones');
            initCamiones(ctxBuses);
            interval= setInterval(function () {
              $.ajax( {
                data: { id:id, nombre:nombre }, 
                  dataType: 'html',
                  type: 'POST', 
                  url: 'get_posiciones.php' 
              }).done(function(data) { 
                datosBuses = JSON.parse(data);     
                //console.log('Timer: '); 
                actualizaCamiones(datosBuses['vehiculos'], ctxBuses, ctxBloqueos, ctxSinCom, ctxExceso, ctxFueraRuta, ctxMantenimiento, ctxEstatus, ctxEncierro);         
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