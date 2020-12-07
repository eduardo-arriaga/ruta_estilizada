class Nodo {
    id;
    nombre;
    latitud;
    longitud;
    x;
    y;
    icono;
    orden;
    radio;
    visitado;
    velocidad;
    visible;

    getId() {
        return this.id;
    }

    getNombre() {
        return this.nombre;
    }

    getLatitud() {
        return this.latitud;
    }

    getLongitud() {
        return this.longitud;        
    }

    getX() {
        return this.x;
    }

    getY() {
        return this.y;
    }

    getIcono() {
        return this.icono;
    }

    getOrden() {
        return this.orden;
    }

    getRadio() {
        return this.radio;
    }

    getVisitado() {
        return this.visitado;
    }

    getVelocidad() {
        return this.velocidad;
    }

    getVisible() {
        return this.visible;
    }

    constructor(nodo) {  
		if (nodo != null) {
			this.id = parseInt(nodo['id']);    
        	this.nombre = nodo['nombre'];
        	this.latitud = nodo['latitud'];
			this.longitud = nodo['longitud'];
			this.icono = parseInt(nodo['icono']);
       		this.orden = parseInt(nodo['orden']);
			this.radio = parseInt(nodo['radio']);
			this.velocidad = parseInt(nodo['velocidad']);
			this.x = parseInt(nodo['x']);
			this.y = parseInt(nodo['y']);        
			this.visitado = nodo['visitado'];        
			this.visible = parseInt(nodo['visible']);	
		} else {
			this.id = -1;    
        	this.nombre = '';
        	this.latitud = -1;
			this.longitud = -1;
			this.icono = -1;
       		this.orden = -1;
			this.radio = 0;
			this.velocidad = 0;
			this.x = -1;
			this.y = -1;
			this.visible = 0;
		}  
    }
    
    distancia(camion) {
        var lDist = Math.sqrt(Math.pow((this.latitud - camion.latitud),2) + Math.pow((this.longitud - camion.longitud),2)) * .11106;
        return lDist;
    }

    getAngleVehicle(camion) {
        var dLong = this.longitud - camion.longitud;
        var dLat = this.latitud - camion.latitud;
        var dir = Math.atan(dLong/dLat) * 180 / Math.PI;
        if (((dLong >= 0) && (dLat >= 0)) || ((dLong < 0) && (dLat >= 0))) {
            dir += 180;
        } else if ((dLong >= 0) && (dLat < 0)) {
            dir += 360;
        }
        return dir;
    }
}

class Nodos {    
    listaNodos = Array();

    getListaNodos() {
        return this.listaNodos;
    }

    constructor(lNodos) { 
        graph = new Graph(lNodos.length);
        for (var i = 0; i < lNodos.length; i++) {
            var nodo = new Nodo(lNodos[i]);
            this.listaNodos.push(nodo);
            graph.addNode(nodo, nodo.orden);
        }     
    }
}