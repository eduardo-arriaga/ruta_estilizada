class Calificador {
	orden;
	distancia;
	pasos;
	velocidad;
	calificacion;
	constructor() {	}		
}

function traverse(origen, destino)
{	
	graph.clearMarks();
	return graph.breadthFirstSearch(graph.nodes[origen], graph.nodes[destino]);
}

function qualifyNodes(oCal, pasos, elements, camion) {
	var iNodo = -1;
	var cTramo = null; 
	var distancia = 100000;
	for (var x = 0; x < elements; x++) {
		if (oCal[x].pasos < pasos) {
			var orden = oCal[x].orden;
			var oNode = graph.nodes[orden];
			for (var j = 0; j < oNode.numArcs; j++) {
				var oTramo = NewTramo(oNode.data, oNode.arcs[j].node.data, 0);
				oTramo.invisible = oNode.arcs[j].invisible;
				if (oTramo.qualifyRange(camion) >= 0) {
					if (oTramo.qualifyRange(camion) < distancia) {
						distancia = oTramo.qualifyRange(camion);
						iNodo = orden;
						cTramo = oTramo;
					}
				}
			}
		}
	}
	return cTramo;
}

function findClosestNode2(camion) {
	var cTramo = camion.tramo;        
	var oCalificadores = new Array();
	var elementos = 10;

	if (graph.nodes.length >= 2) {
		for (var x = 0; x < nodos.listaNodos.length; x++) {                
			var oCal = new Calificador();
			oCal.orden = x;
			oCal.pasos = traverse(camion.tramo.nodoIni.orden, x);
			oCal.distancia = nodos.listaNodos[x].distancia(camion);
			oCalificadores.push(oCal);
		}
		oCalificadores.sort(function (item1, item2) {
			if (item1.distancia < item2.distancia) {
				return -1;
			}
			if (item1.distancia > item2.distancia) {
				return 1;
			}
			return 0;
		});
		oCalificadores.splice(elementos, (nodos.listaNodos.length - elementos));
		var maximaDistancia = oCalificadores[9].distancia;            
		oCalificadores.sort(function (item1, item2) {
			if (item1.pasos < item2.pasos) {
				return -1;
			}
			if (item1.pasos > item2.pasos) {
				return 1;
			}
			return 0;
		});
		var maximaPasos = 0;
		while ((maximaPasos < 9) && ((oCalificadores[maximaPasos + 1].pasos - oCalificadores[maximaPasos].pasos) < 3)) {
			maximaPasos++;
		}
		maximaPasos = oCalificadores[maximaPasos].pasos;
		for (x = 0; x < elementos; x++) {
			var dis = oCalificadores[x].distancia / maximaDistancia;
			var pas = oCalificadores[x].pasos / maximaPasos;
			oCalificadores[x].calificacion = dis + pas;
		}
		oCalificadores.sort(function (item1, item2) {
			if (item1.calificacion < item2.calificacion) {
				return -1;
			}
			if (item1.calificacion > item2.calificacion) {
				return 1;
			}
			return 0;
		});
		var nodo = oCalificadores[0].orden;
		//Evitamos brincos hacia atras.
		if (oCalificadores[0].pasos > maximaPasos) {
			nodo = camion.tramo.nodoIni.orden;
		}
		cTramo = qualifyNodes(oCalificadores, maximaPasos, elementos, camion);
		if (cTramo == null) {
			if (graph.nodes[nodo].numArcs > 0) {
				cTramo = NewTramo(graph.nodes[nodo].data, graph.nodes[nodo].arcs[0].node.data, 0);
				cTramo.invisible = graph.nodes[nodo].arcs[0].invisible;
			} else {
				cTramo = camion.tramo;
			}
		}						
	}
	return cTramo;
}

function findClosestNode(camion) {
	var cTramo;
	var lTramo;
	var distancia;
	var iSubRuta;
	var anguloCorrecto;
	anguloCorrecto = false;
	if (nodos.length >= 2) {
		cTramo = tramos[0];
		distancia = 1000;
		if (camion.tramo != null) {
			iSubRuta = camion.derrotero;
		} else {
			iSubRuta = -1;
		}
		for (var x=0; x < nodos.length; x++) {
			for (var j=0; j < graph.nodes[x].numArcs; j++) {
				lTramo = NewTramo(graph.nodes[x].data, graph.nodes[x].arcs[j].node.data, graph.nodes[x].arcs[j].weight);
				if ((distancia == 1000) || (cTramo.derrotero != iSubRuta)) {
					if ((lTramo.derrotero == iSubRuta) && (lTramo.qualifyRange(camion) >= 0) && (lTramo.isInRange(camion,lTramo.nodoIni.radio))) {
						distancia = lTramo.qualifyRange(camion);
						cTramo = lTramo;						
					} else if ((lTramo.qualifyRange(camion) >=0) && (lTramo.qualifyRange(camion) < distancia)) {
						distancia = lTramo.qualifyRange(camion);
						cTramo = lTramo;
					}					
				} else if (lTramo.derrotero == iSubRuta){
					if ((lTramo.qualifyRange(camion) >=0) && (lTramo.qualifyRange(camion) < distancia)) {
						distancia = lTramo.qualifyRange(camion);
						cTramo = lTramo;
					}
				}
			}
		}
		if (cTramo.nodoFin.orden == camion.tramo.nodoIni.orden) {//checamos si vamos en reversa, de ser asi se busca el tramo mejor
			cTramo = findClosestFirstNode(camion);
		} else if (cTramo.isInRange(camion,cTramo.nodoIni.radio)) {//vemos si estamos dentro de la ruta y guardamos el derrotero
			camion.derrotero = cTramo.derrotero;
		}
		return cTramo;
	}
}

function findClosestFirstNode(camion) {
	var cTramo;
	var lTramo;
	var distancia;
	if (tramos.listaTramos.length >= 2) {
		cTramo = tramos.listaTramos[0];
		distancia = 1000;

		for (var x=0; x < tramos.listaTramos.length; x++) {
			lTramo = tramos.listaTramos[x];			
			if ((lTramo.nodoFin != null) && (lTramo.qualifyRange(camion) >=0) && (lTramo.qualifyRange(camion) < distancia)) {
				distancia = lTramo.qualifyRange(camion);
				cTramo = lTramo;
			}
		}
		if (cTramo.isInRange(camion, cTramo.nodoIni.radio))//vemos si estamos dentro de la ruta y guardamos el derrotero
		{
			camion.derrotero = cTramo.derrotero;
		}
		return cTramo;
	}
}

function findClosestTip(camion) {
	var nodoNext;
	var nodoNextNext;
	var lTramo;
	var cTramo;
	var iSubRuta;
	var qual;
	var tqual;
	if (nodos.listaNodos.length >= 2) {
		cTramo = camion.tramo;
		lTramo = cTramo;
		iSubRuta = camion.derrotero;
		qual = lTramo.qualifyRange(camion);
		if (qual < 0) {
			qual = 1000;
		} else if (lTramo.isInRange(camion, lTramo.nodoIni.radio)) {
			return cTramo;
		}

		for (var x=0; x < tramos.listaTramos.length; x++) {
			lTramo = tramos.listaTramos[x];
			tqual = lTramo.qualifyRange(camion);
			if (tqual < 0) {
				tqual = 1000;
			}
			if ((tqual < qual) && (lTramo.derrotero == iSubRuta)) {
				qual = tqual;
				cTramo = lTramo;
			}
		}
		//vemos si estamos dentro de la ruta y guardamos el derrotero
		if (cTramo.isInRange(camion, cTramo.nodoIni.radio))
		{
			camion.derrotero = cTramo.derrotero;
		}
		return cTramo;
	}
}

function rotate180(degrees) {
	degrees += 180;
	if (degrees > 360) {
		degrees -= 360;
	}
	return degrees;
}

function checkEncierros(camion) {
	//console.log("Encierros: " + encierros.listaEncierros.length);
	for (var x = 0; x < encierros.listaEncierros.length; x++) {
		if (encierros.listaEncierros[x].isInside(camion)) {
			return x;
		}		
	}
	return -1;
}

//esta funcion checa si hay vehiculos en la misma posicion que el vehiculo y le agrega
//al texto del movieclip del vehiculo las caracteristicas de los vehiculos que estan
//en la misma posicion para asi poder ver las caracteristicas de todos
function isSuperposed() {
	for (var x = 0; x < activos.length; x++) {
		for (var y = 0; y < activos.length; y++) {
			if (x != y) {
				if (vehiculos[activos[x]].getDistancexy(vehiculos[activos[y]]) < 6) {
					//movies[activos[x]].textData.text += "\n\nUnidad: " + vehiculos[activos[y]].nombre + "\nVelocidad: " + vehiculos[activos[y]].velocidad + " km/h\nHora: " + vehiculos[activos[y]].fechaText + "\nOcupaci�n: " + vehiculos[activos[y]].pasajeros + "%\nAcumulado: " + vehiculos[activos[y]].acumulado;
				}
			}
		}
	}
}

function initCamiones(ctx) {
	var depth;
	var lClosest;
	var distance;
	var posX;
	var posY;
	var countFuera = 0;
	var countEncierro = 0;
	var countDesconect = 0;
	var countExceso = 0;
	var countBloqueos = 0;
	var countStatus = 0;
	var countActivo = 0;
	var countRuta = 0;

	listaBloqueos.length = 0;
	listaSinCom.length = 0;
	listaExceso.length = 0;
	listaFueraRuta.length = 0;
	listaMantenimiento.length = 0;
	listaEstatus.length = 0;
	listaEncierro.length = 0;

	depth = nodos.listaNodos.length;
	ctx.beginPath();
	for (var z = 0; z < vehiculos.listaVehiculos.length; z ++) {
		if (z==9) {
			z=9;
		}
		countActivo++;
		if (vehiculos.listaVehiculos[z].tramo == null) {
			lClosest = findClosestFirstNode(vehiculos.listaVehiculos[z]);

			distance = lClosest.getDisplacement(vehiculos.listaVehiculos[z]);
			posX = lClosest.calculateX(distance);
			posY = lClosest.calculateY(distance);
			vehiculos.listaVehiculos[z].actualizarPantalla(posX, posY, lClosest.direccionxy, lClosest, lClosest.nodoIni.orden);
		} else {
			lClosest = vehiculos.listaVehiculos[z].tramo;

			distance = lClosest.getDisplacement(vehiculos.listaVehiculos[z]);
			posX = lClosest.calculateX(distance);
			posY = lClosest.calculateY(distance);
		}
		if (vehiculos.listaVehiculos[z].comEstado.conectado != 1) {
			countDesconect ++;
			countActivo--;
			listaSinCom.push(vehiculos.listaVehiculos[z]);
			vehiculos.listaVehiculos[z].visible = false;
		} else if (checkEncierros(vehiculos.listaVehiculos[z]) >= 0) {			
			countEncierro ++;
			listaEncierro.push(vehiculos.listaVehiculos[z]);
			vehiculos.listaVehiculos[z].visible = false;
		} else if (lClosest.isInRange(vehiculos.listaVehiculos[z], lClosest.nodoIni.radio)) {
			countRuta++;
			vehiculos.listaVehiculos[z].visible = true;
			if (vehiculos.listaVehiculos[z].exceso) {
				listaExceso.push(vehiculos.listaVehiculos[z]);
				countExceso++;
			}
			vehiculos.listaVehiculos[z].dibujar();
		} else {
			countFuera ++;
			listaFueraRuta.push(vehiculos.listaVehiculos[z]);
			vehiculos.listaVehiculos[z].visible = false;
			if (vehiculos.listaVehiculos[z].velocidad > nodos.listaNodos[vehiculos.listaVehiculos[z].nodoActual].velocidad) {
				listaExceso.push(vehiculos.listaVehiculos[z]);
				countExceso++;
			}  
		}
		//Aqui guardamos en el arreglo movies la referencia al nuevo movieclip
		//movies[z] = tempMC;
		//Aqui ponemos los bloqueos
		if ((vehiculos.listaVehiculos[z].bloqueos1 > 0) || (vehiculos.listaVehiculos[z].bloqueos2 > 0)) {	
			countBloqueos++;	
			listaBloqueos.push(vehiculos.listaVehiculos[z]);	
			vehiculos.listaVehiculos[z].textExtra += "\nBloqueos1: " + vehiculos.listaVehiculos[z].bloqueos1;	
			vehiculos.listaVehiculos[z].textExtra += "\nBloqueos2: " + vehiculos.listaVehiculos[z].bloqueos2;						
		}		
		//Aqui ponemos los status			
		if ((!vehiculos.listaVehiculos[z].comPuertas1) || (!vehiculos.listaVehiculos[z].comPuertas2) || ((vehiculos.listaVehiculos[z].estatus > 0) && (vehiculos.listaVehiculos[z].estatus < 4)) || (vehiculos.listaVehiculos[z].estatus == 7)) {			
			countStatus++;
			listaEstatus.push(vehiculos.listaVehiculos[z]);
			listaMantenimiento.push(vehiculos.listaVehiculos[z]);				
			if (!vehiculos.listaVehiculos[z].comPuertas1) {
				vehiculos.listaVehiculos[z].textExtra += "\nError Com. Puerta 1";
			}
			if (!vehiculos.listaVehiculos[z].comPuertas2) {
				vehiculos.listaVehiculos[z].textExtra += "\nError Com. Puerta 2";
			}
			if (vehiculos.listaVehiculos[z].estatus == 1) {
				vehiculos.listaVehiculos[z].textExtra += "\nError Com. BEA";
			}
			if (vehiculos.listaVehiculos[z].estatus == 2) {
				vehiculos.listaVehiculos[z].textExtra += "\nError Com. GPS";
			}
			if (vehiculos.listaVehiculos[z].estatus == 3) {
				vehiculos.listaVehiculos[z].textExtra += "\nError Com. SAC";
			}
			if (vehiculos.listaVehiculos[z].estatus == 7) {
				vehiculos.listaVehiculos[z].textExtra += "\nDescarga Completa";
			}
		} 
	}
	ctx.closePath();
	ctx.restore();

	// Dibujamos los buses del cajón de bloqueos	
	ctxBloqueos.clearRect(0, 0, 200, 600);
	ctxBloqueos.lineWidth = 1;
	ctxBloqueos.strokeStyle = "black";
	var x = 15;
	var y = 40;
	var i = 0;
	var color = "black";
	var titulo = "Bloqueos: " + listaBloqueos.length;
	ctxBloqueos.beginPath();
	ctxBloqueos.fillStyle = "#000000";
	ctxBloqueos.font = "700 12px Arial";
	ctxBloqueos.textAlign = "center";
	ctxBloqueos.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxBloqueos.stroke();   
	ctxBloqueos.closePath(); 
	for (i = 0; i < listaBloqueos.length; i++) {
		listaBloqueos[i].xBloqueo = x;
		listaBloqueos[i].yBloqueo = y;
		ctxBloqueos.beginPath();
		ctxBloqueos.fillStyle = color;
		ctxBloqueos.moveTo(x - 5, y - 5);
		ctxBloqueos.lineTo(x - 5, y + 5);
		ctxBloqueos.lineTo(x, y + 5);
		ctxBloqueos.lineTo(x + 5, y);
		ctxBloqueos.lineTo(x, y - 5);
		ctxBloqueos.lineTo(x - 5, y - 5);
		ctxBloqueos.fill();
		ctxBloqueos.fillStyle = "#000000";
		ctxBloqueos.font = "500 10px Arial";
		ctxBloqueos.textAlign = "center";
		ctxBloqueos.fillText(listaBloqueos[i].nombre.split("").join(String.fromCharCode(8202)), x, y - 12); 
		ctxBloqueos.stroke();                                        
		ctxBloqueos.closePath(); 
		if (x > 150) {
			x = 15;
			y = y + 40;
		} else {
			x = x + 40;
		}
	}

	// Dibujamos los buses del cajón de sin comunicación
	ctxSinCom.clearRect(0, 0, 200, 600);
	ctxSinCom.lineWidth = 1;
	ctxSinCom.strokeStyle = "black";
	x = 15;
	y = 40;
	titulo = "Sin Com: " + countDesconect + "     Con Com: " + (countActivo - countDesconect);
	ctxSinCom.beginPath();
	ctxSinCom.fillStyle = "#000000";
	ctxSinCom.font = "700 12px Arial";
	ctxSinCom.textAlign = "center";
	ctxSinCom.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxSinCom.stroke();   
	ctxSinCom.closePath(); 
	for (i = 0; i < listaSinCom.length; i++) {
		// Color default
		color = "#FFD700";
		// Si está en el cajón de bloqueos su color será negro
		if (listaBloqueos.includes(listaSinCom[i])) {
			color = "black";
		}
		listaSinCom[i].xSinCom = x;
		listaSinCom[i].ySinCom = y;
		ctxSinCom.beginPath();
		ctxSinCom.fillStyle = color;
		ctxSinCom.moveTo(x - 5, y - 5);
		ctxSinCom.lineTo(x - 5, y + 5);
		ctxSinCom.lineTo(x, y + 5);
		ctxSinCom.lineTo(x + 5, y);
		ctxSinCom.lineTo(x, y - 5);
		ctxSinCom.lineTo(x - 5, y - 5);
		ctxSinCom.fill();
		ctxSinCom.fillStyle = "#000000";
		ctxSinCom.font = "500 10px Arial";
		ctxSinCom.textAlign = "center";
		ctxSinCom.fillText(listaSinCom[i].nombre.split("").join(String.fromCharCode(8202)), x, y - 12); 
		ctxSinCom.stroke();                                        
		ctxSinCom.closePath(); 
		if (x > 150) {
			x = 15;
			y = y + 40;
		} else {
			x = x + 40;
		}
	}

	// Dibujamos los buses con exceso
	ctxExceso.clearRect(0, 0, 200, 600);
	ctxExceso.lineWidth = 1;
	ctxExceso.strokeStyle = "black";
	x = 15;
	y = 40;
	titulo = "Exceso de Velocidad: " + listaExceso.length;
	ctxExceso.beginPath();
	ctxExceso.fillStyle = "#000000";
	ctxExceso.font = "700 12px Arial";
	ctxExceso.textAlign = "center";
	ctxExceso.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxExceso.stroke();   
	ctxExceso.closePath(); 
	// Color default
	color = "red";
	for (i = 0; i < listaExceso.length; i++) {
		listaExceso[i].xExceso = x;
		listaExceso[i].yExceso = y;
		ctxExceso.beginPath();
		ctxExceso.fillStyle = color;
		ctxExceso.moveTo(x - 5, y - 5);
		ctxExceso.lineTo(x - 5, y + 5);
		ctxExceso.lineTo(x, y + 5);
		ctxExceso.lineTo(x + 5, y);
		ctxExceso.lineTo(x, y - 5);
		ctxExceso.lineTo(x - 5, y - 5);
		ctxExceso.fill();
		ctxExceso.fillStyle = "#000000";
		ctxExceso.font = "500 10px Arial";
		ctxExceso.textAlign = "center";
		ctxExceso.fillText(listaExceso[i].nombre.split("").join(String.fromCharCode(8202)), x, y - 12); 
		ctxExceso.stroke();                                        
		ctxExceso.closePath(); 
		if (x > 150) {
			x = 15;
			y = y + 40;
		} else {
			x = x + 40;
		}
	}

	// Dibujamos los buses con fuera de ruta
	ctxFueraRuta.clearRect(0, 0, 200, 600);
	ctxFueraRuta.lineWidth = 1;
	ctxFueraRuta.strokeStyle = "black";
	x = 15;
	y = 40;
	titulo = "Fuera de Ruta: " + countFuera + " En Ruta: " + countRuta;
	ctxFueraRuta.beginPath();
	ctxFueraRuta.fillStyle = "#000000";
	ctxFueraRuta.font = "700 12px Arial";
	ctxFueraRuta.textAlign = "center";
	ctxFueraRuta.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxFueraRuta.stroke();   
	ctxFueraRuta.closePath(); 
	for (i = 0; i < listaFueraRuta.length; i++) {
		// Color default
		color = "#00FFFF";
		// Si está en el cajón de bloqueos su color será negro
		if (listaBloqueos.includes(listaFueraRuta[i])) {
			color = "black";
		} else {
			// Si está en el cajón de excesos de velocidad se pinta de rojo
			if (listaExceso.includes(listaFueraRuta[i])) {
				color = "red";
			}	
		}
		listaFueraRuta[i].xFuera = x;
		listaFueraRuta[i].yFuera = y;
		ctxFueraRuta.beginPath();
		ctxFueraRuta.fillStyle = color;
		ctxFueraRuta.moveTo(x - 5, y - 5);
		ctxFueraRuta.lineTo(x - 5, y + 5);
		ctxFueraRuta.lineTo(x, y + 5);
		ctxFueraRuta.lineTo(x + 5, y);
		ctxFueraRuta.lineTo(x, y - 5);
		ctxFueraRuta.lineTo(x - 5, y - 5);
		ctxFueraRuta.fill();
		ctxFueraRuta.fillStyle = "#000000";
		ctxFueraRuta.font = "500 10px Arial";
		ctxFueraRuta.textAlign = "center";
		ctxFueraRuta.fillText(listaFueraRuta[i].nombre.split("").join(String.fromCharCode(8202)), x, y - 12); 
		ctxFueraRuta.stroke();                                        
		ctxFueraRuta.closePath(); 
		if (x > 150) {
			x = 15;
			y = y + 40;
		} else {
			x = x + 40;
		}
	}

	// El cajón de estatus no se utiliza solo lo limparemos
	ctxEstatus.clearRect(0, 0, 200, 600);
	ctxEstatus.lineWidth = 1;
	ctxEstatus.strokeStyle = "black";
	titulo = "Estatus: 0";
	ctxEstatus.beginPath();
	ctxEstatus.fillStyle = "#000000";
	ctxEstatus.font = "700 12px Arial";
	ctxEstatus.textAlign = "center";
	ctxEstatus.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxEstatus.stroke();   
	ctxEstatus.closePath(); 

	// Dibujamos los buses con mantenimiento
	ctxMantenimiento.clearRect(0, 0, 200, 600);
	ctxMantenimiento.lineWidth = 1;
	ctxMantenimiento.strokeStyle = "black";
	x = 15;
	y = 40;
	titulo = "Mantenimiento: " + countStatus;
	ctxMantenimiento.beginPath();
	ctxMantenimiento.fillStyle = "#000000";
	ctxMantenimiento.font = "700 12px Arial";
	ctxMantenimiento.textAlign = "center";
	ctxMantenimiento.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxMantenimiento.stroke();   
	ctxMantenimiento.closePath(); 
	// Color default
	color = "blue";
	for (i = 0; i < listaMantenimiento.length; i++) {
		listaMantenimiento[i].xMantenimiento = x;
		listaMantenimiento[i].yMantenimiento = y;
		ctxMantenimiento.beginPath();
		ctxMantenimiento.fillStyle = color;
		ctxMantenimiento.moveTo(x - 5, y - 5);
		ctxMantenimiento.lineTo(x - 5, y + 5);
		ctxMantenimiento.lineTo(x, y + 5);
		ctxMantenimiento.lineTo(x + 5, y);
		ctxMantenimiento.lineTo(x, y - 5);
		ctxMantenimiento.lineTo(x - 5, y - 5);
		ctxMantenimiento.fill();
		ctxMantenimiento.fillStyle = "#000000";
		ctxMantenimiento.font = "500 10px Arial";
		ctxMantenimiento.textAlign = "center";
		ctxMantenimiento.fillText(listaMantenimiento[i].nombre.split("").join(String.fromCharCode(8202)), x, y - 12); 
		ctxMantenimiento.stroke();                                        
		ctxMantenimiento.closePath(); 
		if (x > 150) {
			x = 15;
			y = y + 40;
		} else {
			x = x + 40;
		}
	}

	// Dibujamos los buses en encierro
	ctxEncierro.clearRect(0, 0, 200, 600);
	ctxEncierro.lineWidth = 1;
	ctxEncierro.strokeStyle = "black";
	x = 15;
	y = 40;
	titulo = "Encierro: " + countEncierro;
	ctxEncierro.beginPath();
	ctxEncierro.fillStyle = "#000000";
	ctxEncierro.font = "700 12px Arial";
	ctxEncierro.textAlign = "center";
	ctxEncierro.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxEncierro.stroke();   
	ctxEncierro.closePath(); 
	for (i = 0; i < listaEncierro.length; i++) {
		// Color default
		color = "#996600";
		// Si está en el cajón de bloqueos su color será negro
		if (listaBloqueos.includes(listaEncierro[i])) {
			color = "black";
		}
		listaEncierro[i].xEncierro = x;
		listaEncierro[i].yEncierro = y;
		ctxEncierro.beginPath();
		ctxEncierro.fillStyle = color;
		ctxEncierro.moveTo(x - 5, y - 5);
		ctxEncierro.lineTo(x - 5, y + 5);
		ctxEncierro.lineTo(x, y + 5);
		ctxEncierro.lineTo(x + 5, y);
		ctxEncierro.lineTo(x, y - 5);
		ctxEncierro.lineTo(x - 5, y - 5);
		ctxEncierro.fill();
		ctxEncierro.fillStyle = "#000000";
		ctxEncierro.font = "500 10px Arial";
		ctxEncierro.textAlign = "center";
		ctxEncierro.fillText(listaEncierro[i].nombre.split("").join(String.fromCharCode(8202)), x, y - 12); 
		ctxEncierro.stroke();                                        
		ctxEncierro.closePath(); 
		if (x > 150) {
			x = 15;
			y = y + 40;
		} else {
			x = x + 40;
		}
	}
}

function actualizaCamiones(datos, ctxBuses, ctxBloqueos, ctxSinCom, ctxExceso, ctxFueraRuta, ctxMantenimiento, ctxEstatus, ctxEncierro) {
	var tempColor;
	var depth;
	var lClosest;
	var distance;
	var posX;
	var posY;
	var countFuera = 0;
	var countEncierro = 0;
	var countDesconect = 0;
	var countAviacion = 0;
	var countJuarez = 0;
	var countExceso = 0;
	var countBloqueos = 0;
	var countStatus = 0;
	var countActivo = 0;
	var countRuta = 0;
	var textoAux;
	var extraMC;
	var camion;

	listaBloqueos.length = 0;
	listaSinCom.length = 0;
	listaExceso.length = 0;
	listaFueraRuta.length = 0;
	listaMantenimiento.length = 0;
	listaEstatus.length = 0;
	listaEncierro.length = 0;

	depth = nodos.listaNodos.length;
	activos = new Array();
	//desdibujar();
	// Use the identity matrix while clearing the canvas
	ctxBuses.clearRect(0, 0, canvasBuses.width, canvasBuses.height);
	ctxBuses.beginPath();
	//console.log("Entrando actualizaCamiones");
	for (var z = 0; z < datos.length; z++) {
		if (z==9)
		{
			z=9;
		}
		camion = vehiculos.listaVehiculos.find(x => x.id === parseInt(datos[z]['id']));
		//console.log("Entrando bus: " + camion.nombre);
		//console.log(z);
		//console.log(datos[z]);
		//console.log(camion);
		if (typeof(camion) != "undefined") {	
			countActivo++;		
			camion.actualizarDatos(datos[z]);
			if (camion.tramo != null && camion.tramo.nodoFin != null)
				lClosest = findClosestTip(camion);
			else 
				lClosest = findClosestFirstNode(camion);
			if (lClosest.qualifyRange(camion) < 0) {
				lClosest = findClosestNode2(camion);
			}
			distance = lClosest.getDisplacement(camion);
			posX = lClosest.calculateX(distance);
			posY = lClosest.calculateY(distance);
			if (lClosest.invisible)
			{
				posX = lClosest.nodoIni.x;
				posY = lClosest.nodoIni.y;
			}

			camion.actualizarPantalla(posX, posY, lClosest.direccionxy, lClosest, lClosest. nodoIni.orden);
			if (camion.comEstado.conectado != 1) {
				countActivo--;
				countDesconect++;
				listaSinCom.push(camion);				
				camion.visible = false;
								
			} else if (checkEncierros(camion) >= 0) {
				countEncierro ++;
				listaEncierro.push(camion);
				camion.visible = false;
				
			} else if (lClosest.isInRange(camion, lClosest.nodoIni.radio)) {
				countRuta++;
				camion.visible = true;
				vehiculos.listaVehiculos[z].dibujar();
				if (camion.exceso) {
					listaExceso.push(camion);
					countExceso++;
				}
					
			} else {
				countFuera ++;
				listaFueraRuta.push(camion);
				camion.visible = false;
				if (camion.velocidad > nodos.listaNodos[camion.nodoActual].velocidad) {
					listaExceso.push(camion);
					countExceso++;
				}    
			}
			//Aqui ponemos los bloqueos
			if ((camion.bloqueos1 > 0) || (camion.bloqueos2 > 0)) {	
				countBloqueos++;	
				listaBloqueos.push(camion);	
				camion.textExtra += "\nBloqueos1: " + camion.bloqueos1;	
				camion.textExtra += "\nBloqueos2: " + camion.bloqueos2;			
				
			}		
			//Aqui ponemos los status			
			if ((!camion.comPuertas1) || (!camion.comPuertas2) || ((camion.estatus > 0) && (camion.estatus < 4)) || (camion.estatus == 7)) {			
				countStatus++;
				listaEstatus.push(camion);
				listaMantenimiento.push(camion);				
				if (!camion.comPuertas1)
				{
					camion.textExtra += "\nError Com. Puerta 1";
				}
				if (!camion.comPuertas2)
				{
					camion.textExtra += "\nError Com. Puerta 2";
				}
				if (camion.estatus == 1)
				{
					camion.textExtra += "\nError Com. BEA";
				}
				if (camion.estatus == 2)
				{
					camion.textExtra += "\nError Com. GPS";
				}
				if (camion.estatus == 3)
				{
					camion.textExtra += "\nError Com. SAC";
				}
				if (camion.estatus == 7)
				{
					camion.textExtra += "\nDescarga Completa";
				}
			
			} 
		}		
	}
	ctx.closePath();
	ctx.restore();

	// Dibujamos los buses del cajón de bloqueos	
	ctxBloqueos.clearRect(0, 0, 200, 600);
	ctxBloqueos.lineWidth = 1;
	ctxBloqueos.strokeStyle = "black";
	var x = 15;
	var y = 40;
	var i = 0;
	var color = "black";
	var titulo = "Bloqueos: " + listaBloqueos.length;
	ctxBloqueos.beginPath();
	ctxBloqueos.fillStyle = "#000000";
	ctxBloqueos.font = "700 12px Arial";
	ctxBloqueos.textAlign = "center";
	ctxBloqueos.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxBloqueos.stroke();   
	ctxBloqueos.closePath(); 
	for (i = 0; i < listaBloqueos.length; i++) {
		listaBloqueos[i].xBloqueo = x;
		listaBloqueos[i].yBloqueo = y;
		ctxBloqueos.beginPath();
		ctxBloqueos.fillStyle = color;
		ctxBloqueos.moveTo(x - 5, y - 5);
		ctxBloqueos.lineTo(x - 5, y + 5);
		ctxBloqueos.lineTo(x, y + 5);
		ctxBloqueos.lineTo(x + 5, y);
		ctxBloqueos.lineTo(x, y - 5);
		ctxBloqueos.lineTo(x - 5, y - 5);
		ctxBloqueos.fill();
		ctxBloqueos.fillStyle = "#000000";
		ctxBloqueos.font = "500 10px Arial";
		ctxBloqueos.textAlign = "center";
		ctxBloqueos.fillText(listaBloqueos[i].nombre.split("").join(String.fromCharCode(8202)), x, y - 12); 
		ctxBloqueos.stroke();                                        
		ctxBloqueos.closePath(); 
		if (x > 150) {
			x = 15;
			y = y + 40;
		} else {
			x = x + 40;
		}
	}

	// Dibujamos los buses del cajón de sin comunicación
	ctxSinCom.clearRect(0, 0, 200, 600);
	ctxSinCom.lineWidth = 1;
	ctxSinCom.strokeStyle = "black";
	x = 15;
	y = 40;
	titulo = "Sin Com: " + countDesconect + "     Con Com: " + (countActivo - countDesconect);
	ctxSinCom.beginPath();
	ctxSinCom.fillStyle = "#000000";
	ctxSinCom.font = "700 12px Arial";
	ctxSinCom.textAlign = "center";
	ctxSinCom.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxSinCom.stroke();   
	ctxSinCom.closePath(); 
	for (i = 0; i < listaSinCom.length; i++) {
		// Color default
		color = "#FFD700";
		// Si está en el cajón de bloqueos su color será negro
		if (listaBloqueos.includes(listaSinCom[i])) {
			color = "black";
		}
		listaSinCom[i].xSinCom = x;
		listaSinCom[i].ySinCom = y;
		ctxSinCom.beginPath();
		ctxSinCom.fillStyle = color;
		ctxSinCom.moveTo(x - 5, y - 5);
		ctxSinCom.lineTo(x - 5, y + 5);
		ctxSinCom.lineTo(x, y + 5);
		ctxSinCom.lineTo(x + 5, y);
		ctxSinCom.lineTo(x, y - 5);
		ctxSinCom.lineTo(x - 5, y - 5);
		ctxSinCom.fill();
		ctxSinCom.fillStyle = "#000000";
		ctxSinCom.font = "500 10px Arial";
		ctxSinCom.textAlign = "center";
		ctxSinCom.fillText(listaSinCom[i].nombre.split("").join(String.fromCharCode(8202)), x, y - 12); 
		ctxSinCom.stroke();                                        
		ctxSinCom.closePath(); 
		if (x > 150) {
			x = 15;
			y = y + 40;
		} else {
			x = x + 40;
		}
	}

	// Dibujamos los buses con exceso
	ctxExceso.clearRect(0, 0, 200, 600);
	ctxExceso.lineWidth = 1;
	ctxExceso.strokeStyle = "black";
	x = 15;
	y = 40;
	titulo = "Exceso de Velocidad: " + listaExceso.length;
	ctxExceso.beginPath();
	ctxExceso.fillStyle = "#000000";
	ctxExceso.font = "700 12px Arial";
	ctxExceso.textAlign = "center";
	ctxExceso.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxExceso.stroke();   
	ctxExceso.closePath(); 
	// Color default
	color = "red";
	for (i = 0; i < listaExceso.length; i++) {
		listaExceso[i].xExceso = x;
		listaExceso[i].yExceso = y;
		ctxExceso.beginPath();
		ctxExceso.fillStyle = color;
		ctxExceso.moveTo(x - 5, y - 5);
		ctxExceso.lineTo(x - 5, y + 5);
		ctxExceso.lineTo(x, y + 5);
		ctxExceso.lineTo(x + 5, y);
		ctxExceso.lineTo(x, y - 5);
		ctxExceso.lineTo(x - 5, y - 5);
		ctxExceso.fill();
		ctxExceso.fillStyle = "#000000";
		ctxExceso.font = "500 10px Arial";
		ctxExceso.textAlign = "center";
		ctxExceso.fillText(listaExceso[i].nombre.split("").join(String.fromCharCode(8202)), x, y - 12); 
		ctxExceso.stroke();                                        
		ctxExceso.closePath(); 
		if (x > 150) {
			x = 15;
			y = y + 40;
		} else {
			x = x + 40;
		}
	}

	// Dibujamos los buses con fuera de ruta
	ctxFueraRuta.clearRect(0, 0, 200, 600);
	ctxFueraRuta.lineWidth = 1;
	ctxFueraRuta.strokeStyle = "black";
	x = 15;
	y = 40;
	titulo = "Fuera de Ruta: " + countFuera + " En Ruta: " + countRuta;
	ctxFueraRuta.beginPath();
	ctxFueraRuta.fillStyle = "#000000";
	ctxFueraRuta.font = "700 12px Arial";
	ctxFueraRuta.textAlign = "center";
	ctxFueraRuta.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxFueraRuta.stroke();   
	ctxFueraRuta.closePath(); 
	for (i = 0; i < listaFueraRuta.length; i++) {
		// Color default
		color = "#00FFFF";
		// Si está en el cajón de bloqueos su color será negro
		if (listaBloqueos.includes(listaFueraRuta[i])) {
			color = "black";
		} else {
			// Si está en el cajón de excesos de velocidad se pinta de rojo
			if (listaExceso.includes(listaFueraRuta[i])) {
				color = "red";
			}	
		}
		listaFueraRuta[i].xFuera = x;
		listaFueraRuta[i].yFuera = y;
		ctxFueraRuta.beginPath();
		ctxFueraRuta.fillStyle = color;
		ctxFueraRuta.moveTo(x - 5, y - 5);
		ctxFueraRuta.lineTo(x - 5, y + 5);
		ctxFueraRuta.lineTo(x, y + 5);
		ctxFueraRuta.lineTo(x + 5, y);
		ctxFueraRuta.lineTo(x, y - 5);
		ctxFueraRuta.lineTo(x - 5, y - 5);
		ctxFueraRuta.fill();
		ctxFueraRuta.fillStyle = "#000000";
		ctxFueraRuta.font = "500 10px Arial";
		ctxFueraRuta.textAlign = "center";
		ctxFueraRuta.fillText(listaFueraRuta[i].nombre.split("").join(String.fromCharCode(8202)), x, y - 12); 
		ctxFueraRuta.stroke();                                        
		ctxFueraRuta.closePath(); 
		if (x > 150) {
			x = 15;
			y = y + 40;
		} else {
			x = x + 40;
		}
	}

	// El cajón de estatus no se utiliza solo lo limparemos
	ctxEstatus.clearRect(0, 0, 200, 600);
	ctxEstatus.lineWidth = 1;
	ctxEstatus.strokeStyle = "black";
	titulo = "Estatus: 0";
	ctxEstatus.beginPath();
	ctxEstatus.fillStyle = "#000000";
	ctxEstatus.font = "700 12px Arial";
	ctxEstatus.textAlign = "center";
	ctxEstatus.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxEstatus.stroke();   
	ctxEstatus.closePath(); 

	// Dibujamos los buses con mantenimiento
	ctxMantenimiento.clearRect(0, 0, 200, 600);
	ctxMantenimiento.lineWidth = 1;
	ctxMantenimiento.strokeStyle = "black";
	x = 15;
	y = 40;
	titulo = "Mantenimiento: " + countStatus;
	ctxMantenimiento.beginPath();
	ctxMantenimiento.fillStyle = "#000000";
	ctxMantenimiento.font = "700 12px Arial";
	ctxMantenimiento.textAlign = "center";
	ctxMantenimiento.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxMantenimiento.stroke();   
	ctxMantenimiento.closePath(); 
	// Color default
	color = "blue";
	for (i = 0; i < listaMantenimiento.length; i++) {
		listaMantenimiento[i].xMantenimiento = x;
		listaMantenimiento[i].yMantenimiento = y;
		ctxMantenimiento.beginPath();
		ctxMantenimiento.fillStyle = color;
		ctxMantenimiento.moveTo(x - 5, y - 5);
		ctxMantenimiento.lineTo(x - 5, y + 5);
		ctxMantenimiento.lineTo(x, y + 5);
		ctxMantenimiento.lineTo(x + 5, y);
		ctxMantenimiento.lineTo(x, y - 5);
		ctxMantenimiento.lineTo(x - 5, y - 5);
		ctxMantenimiento.fill();
		ctxMantenimiento.fillStyle = "#000000";
		ctxMantenimiento.font = "500 10px Arial";
		ctxMantenimiento.textAlign = "center";
		ctxMantenimiento.fillText(listaMantenimiento[i].nombre.split("").join(String.fromCharCode(8202)), x, y - 12); 
		ctxMantenimiento.stroke();                                        
		ctxMantenimiento.closePath(); 
		if (x > 150) {
			x = 15;
			y = y + 40;
		} else {
			x = x + 40;
		}
	}

	// Dibujamos los buses en encierro
	ctxEncierro.clearRect(0, 0, 200, 600);
	ctxEncierro.lineWidth = 1;
	ctxEncierro.strokeStyle = "black";
	x = 15;
	y = 40;
	titulo = "Encierro: " + countEncierro;
	ctxEncierro.beginPath();
	ctxEncierro.fillStyle = "#000000";
	ctxEncierro.font = "700 12px Arial";
	ctxEncierro.textAlign = "center";
	ctxEncierro.fillText(titulo.split("").join(String.fromCharCode(8202)), 100, 12); 
	ctxEncierro.stroke();   
	ctxEncierro.closePath(); 
	for (i = 0; i < listaEncierro.length; i++) {
		// Color default
		color = "#996600";
		// Si está en el cajón de bloqueos su color será negro
		if (listaBloqueos.includes(listaEncierro[i])) {
			color = "black";
		}
		listaEncierro[i].xEncierro = x;
		listaEncierro[i].yEncierro = y;
		ctxEncierro.beginPath();
		ctxEncierro.fillStyle = color;
		ctxEncierro.moveTo(x - 5, y - 5);
		ctxEncierro.lineTo(x - 5, y + 5);
		ctxEncierro.lineTo(x, y + 5);
		ctxEncierro.lineTo(x + 5, y);
		ctxEncierro.lineTo(x, y - 5);
		ctxEncierro.lineTo(x - 5, y - 5);
		ctxEncierro.fill();
		ctxEncierro.fillStyle = "#000000";
		ctxEncierro.font = "500 10px Arial";
		ctxEncierro.textAlign = "center";
		ctxEncierro.fillText(listaEncierro[i].nombre.split("").join(String.fromCharCode(8202)), x, y - 12); 
		ctxEncierro.stroke();                                        
		ctxEncierro.closePath(); 
		if (x > 150) {
			x = 15;
			y = y + 40;
		} else {
			x = x + 40;
		}
	}

	/* //Aqui modificamos los letreros de los camiones superpuestos
	fueraBox.numeroEnRuta.text = countActivo;
	sinComBox.numeroCom.text = countActivo + countFuera + countEncierro;	
	isSuperposed(); */
}