class Tramo {
    nodoIni;
    nodoFin;
    direccion;
    direccionxy;
    distancia;
    distanciaxy;
    invisible;
    derrotero;

    getNodoIni() {
        return this.nodoIni;
    }

    getNodoFin() {
        return this.nodoFin;
    }

    getDireccion() {
        return this.direccion;
    }

    getDireccionxy() {
        return this.direccionxy;
    }

    getDistancia() {
        return this.distancia;
    }

    getDistanciaxy() {
        return this.distanciaxy;
    }

    getInvisible() {
        return this.invisible;
    }

    getDerrotero() {
        return this.derrotero;
    }

    constructor(tramo) {       
        this.nodoIni = new Nodo(tramo['nodoIni']);
        if (tramo['nodoFin'] !=  null)
            this.nodoFin = new Nodo(tramo['nodoFin']);
        else
            this.nodoFin = null;
        this.direccion = parseInt(tramo['direccion']);
        this.direccionxy = parseInt(tramo['direccionxy']);
        this.distancia = parseInt(tramo['distancia']);
        this.distanciaxy = parseInt(tramo['distanciaxy']);
        this.derrotero = parseInt(tramo['derrotero']);
        this.direccion = this.getAngle();
		this.distancia = this.getDistance();
		this.direccionxy = this.getAnglexy();
		this.distanciaxy = this.getDistancexy();
    }

    
    static NewTramo(firstNode, lastNode, subruta){
        var tramo = new Array();
        tramo['nodoIni'] = firstNode;
        tramo['nodoFin'] = lastNode;
        tramo['derrotero'] = subruta;
        tramo['direccion'] = 0;
        tramo['direccionxy'] = 0;
        tramo['distancia'] = 0;
        tramo['distanciaxy'] = 0;
        return new Tramo(tramo);
    }

    iniciar() {

    }

    getAngle() {
        if (this.nodoFin != null) {
            var dLong = this.nodoIni.longitud - this.nodoFin.longitud;
            var dLat = this.nodoIni.latitud - this.nodoFin.latitud;
            if (dLat == 0) {
                dLat = .0001;
            }			
            var dir = Math.atan(dLong/dLat) * 180 / Math.PI;
            if (((dLong >= 0) && (dLat >= 0)) || ((dLong < 0) && (dLat >= 0))) {
                dir += 180;
            } else if ((dLong >= 0) && (dLat < 0)) {
                dir += 360;
            }
            return dir;
        }
        return 0;
    }

    getAngleV(camion) {
        if (this.nodoFin != null) {
            var deltaLon1 = this.nodoIni.longitud - this.nodoFin.longitud;
            var deltaLat1 = this.nodoIni.latitud - this.nodoFin.latitud;

            //Para evitarnos errores de division por cero
            if (deltaLat1 == 0) {
                deltaLat1 = .000000001;
            }

            var angleTramo = Math.atan(deltaLon1/deltaLat1) * 180 / Math.PI;
            if (((deltaLon1 >= 0) && (deltaLat1 >= 0)) || ((deltaLon1 < 0) && (deltaLat1 >= 0))) {
                angleTramo += 180;
            } else if ((deltaLon1 >= 0) && (deltaLat1 < 0)) {
                angleTramo += 360;
            }
            var angle = Math.abs(camion.direccion - angleTramo);
            if (angle > 180) {
                angle = Math.abs(angle - 360);
            }
            return angle;
        }
        return 0;
    }
    
    getAnglexy() {
        if (this.nodoFin != null) {
            var dLong = this.nodoIni.y - this.nodoFin.y;
            var dLat = this.nodoIni.x - this.nodoFin.x;
            if (dLat == 0) {
                dLat = .0001;
            }
            var dir = Math.atan(dLong/dLat) * 180 / Math.PI;
            if (((dLong >= 0) && (dLat >= 0)) || ((dLong < 0) && (dLat >= 0))) {
                dir += 180;
            } else if ((dLong >= 0) && (dLat < 0)) {
                dir += 360;
            }
            return dir;
        }
        return 0;
    }

    getDistance() {
        if (this.nodoFin != null) {
            var lDist = Math.sqrt(Math.pow((this.nodoIni.latitud - this.nodoFin.latitud),2) + Math.pow((this.nodoIni.longitud - this.nodoFin.longitud),2)) * .11106;
            return lDist;
        }
        return 0;
    }

    getDistancexy() {
        if (this.nodoFin != null) {
            var lDist = Math.sqrt(Math.pow((this.nodoIni.x - this.nodoFin.x),2) + Math.pow((this.nodoIni.y - this.nodoFin.y),2));
            return lDist;
        }
        return 0;
    }

    getDisplacement(camion) {
        if (this.nodoFin != null) {
            var deltaLon1 = this.nodoFin.longitud - this.nodoIni.longitud;
            var deltaLat1 = this.nodoFin.latitud - this.nodoIni.latitud;
            var deltaLon2 = camion.longitud - this.nodoIni.longitud;
            var deltaLat2 = camion.latitud - this.nodoIni.latitud;
            var angleTramo = Math.atan(deltaLon1/deltaLat1) * 180 / Math.PI;
            if (((deltaLon1 >= 0) && (deltaLat1 >= 0)) || ((deltaLon1 < 0) && (deltaLat1 >= 0))) {
                angleTramo += 180;
            } else if ((deltaLon1 >= 0) && (deltaLat1 < 0)) {
                angleTramo += 360;
            }
            var angleVehicle = Math.atan(deltaLon2/deltaLat2) * 180 / Math.PI;
            if (((deltaLon2 >= 0) && (deltaLat2 >= 0)) || ((deltaLon2 < 0) && (deltaLat2 >= 0))) {
                angleVehicle += 180;
            } else if ((deltaLon2 >= 0) && (deltaLat2 < 0)) {
                angleVehicle += 360;
            }
            var angle = (angleTramo - angleVehicle) * Math.PI / 180;
            var magnitud = Math.sqrt(Math.pow(deltaLat2,2) + Math.pow(deltaLon2,2)) * .11106;
            var displacement = magnitud * Math.cos(angle);
            displacement = (displacement / this.distancia) * this.distanciaxy;
                    
            return displacement; 
        }
        return 0;
    }

    calculateX(disp) {
        var x = parseInt(this.nodoIni.x) + disp * Math.cos(this.direccionxy * Math.PI / 180);
        if(isNaN(x))
            x= -20;
        return x;
    }

    calculateY(disp) {
        var y = parseInt(this.nodoIni.y) + disp * Math.sin(this.direccionxy * Math.PI / 180);
        if(isNaN(y))
            y = -20;
        return y;
    }

    isInRange(camion,radio) {
        if (this.nodoFin != null) {
            var deltaLon1 = this.nodoIni.longitud - this.nodoFin.longitud;
            var deltaLat1 = this.nodoIni.latitud - this.nodoFin.latitud;
            var deltaLon2 = this.nodoIni.longitud - camion.longitud;
            var deltaLat2 = this.nodoIni.latitud - camion.latitud;
            //Para evitarnos errores de division por cero
            if (deltaLat1 == 0) {
                deltaLat1 = .000000001;
            }
            if (deltaLat2 == 0) {
                deltaLat2 = .000000001;
            }
            var angleTramo = Math.atan(deltaLon1/deltaLat1) * 180 / Math.PI;
            if (((deltaLon1 >= 0) && (deltaLat1 >= 0)) || ((deltaLon1 < 0) && (deltaLat1 >= 0))) {
                angleTramo += 180;
            } else if ((deltaLon1 >= 0) && (deltaLat1 < 0)) {
                angleTramo += 360;
            }
            var angleVehicle = Math.atan(deltaLon2/deltaLat2) * 180 / Math.PI;
            if (((deltaLon2 >= 0) && (deltaLat2 >= 0)) || ((deltaLon2 < 0) && (deltaLat2 >= 0))) {
                angleVehicle += 180;
            } else if ((deltaLon2 >= 0) && (deltaLat2 < 0)) {
                angleVehicle += 360;
            }
            var angle = Math.abs(angleTramo - angleVehicle);
            if (angle > 180) {
                angle = 360 - angle;
            }
            if (angle > 90) {
                return false;
            }
            var magnitud = Math.sqrt(Math.pow(deltaLat2,2) + Math.pow(deltaLon2,2)) * .11106;
            var displacement = Math.abs(magnitud * Math.sin(angle * Math.PI / 180));
            if (displacement > radio) {
                return false;
            } else {
                return true;
            }
        }
        return false;
    }

    isInRoute(camion) {
        if (this.nodoFin != null) {
            if(qualifyRange(camion) > 0) {
                return true;
            } else if (this.nodoIni.distancia(camion) <= this.nodoIni.radio) {
                camion.x = this.nodoIni.x;
                camion.y = this.nodoIni.y;
                return true;
            } else if (this.nodoFin.distancia(camion) <= this.nodoFin.radio) {
                camion.x = this.nodoFin.x;
                camion.y = this.nodoFin.y;
                return true;
            } else {
                return false;
            }
        }
        return false;
    }
    
    qualifyRange(camion) {
        if (this.nodoFin != null) {
            var radio = this.nodoIni.radio;
            //Calculamos el angulo con respecto al nodofinal
            var deltaLon1 = this.nodoFin.longitud - this.nodoIni.longitud;
            var deltaLat1 = this.nodoFin.latitud - this.nodoIni.latitud;
            var deltaLon2 = this.nodoFin.longitud - camion.longitud;
            var deltaLat2 = this.nodoFin.latitud - camion.latitud;
            //Para evitarnos errores de division por cero
            if (deltaLat1 == 0) {
                deltaLat1 = .000000001;
            }
            if (deltaLat2 == 0) {
                deltaLat2 = .000000001;
            }
            var angleTramo = Math.atan(deltaLon1/deltaLat1) * 180 / Math.PI;
            if (((deltaLon1 >= 0) && (deltaLat1 >= 0)) || ((deltaLon1 < 0) && (deltaLat1 >= 0))) {
                angleTramo += 180;
            } else if ((deltaLon1 >= 0) && (deltaLat1 < 0)) {
                angleTramo += 360;
            }
            var angleVehicle = Math.atan(deltaLon2/deltaLat2) * 180 / Math.PI;
            if (((deltaLon2 >= 0) && (deltaLat2 >= 0)) || ((deltaLon2 < 0) && (deltaLat2 >= 0))) {
                angleVehicle += 180;
            } else if ((deltaLon2 >= 0) && (deltaLat2 < 0)) {
                angleVehicle += 360;
            }
            var angle = Math.abs(angleTramo - angleVehicle);
            if (angle > 180) {
                angle = 360 - angle;
            }
            if (angle > 90) {
                return -2;
            }
            //Calculamos angulo con respecto al nodo inicial
            deltaLon1 = this.nodoIni.longitud - this.nodoFin.longitud;
            deltaLat1 = this.nodoIni.latitud - this.nodoFin.latitud;
            deltaLon2 = this.nodoIni.longitud - camion.longitud;
            deltaLat2 = this.nodoIni.latitud - camion.latitud;
            //Para evitarnos errores de division por cero
            if (deltaLat1 == 0) {
                deltaLat1 = .000000001;
            }
            if (deltaLat2 == 0) {
                deltaLat2 = .000000001;
            }
            angleTramo = Math.atan(deltaLon1/deltaLat1) * 180 / Math.PI;
            if (((deltaLon1 >= 0) && (deltaLat1 >= 0)) || ((deltaLon1 < 0) && (deltaLat1 >= 0))) {
                angleTramo += 180;
            } else if ((deltaLon1 >= 0) && (deltaLat1 < 0)) {
                angleTramo += 360;
            }
            angleVehicle = Math.atan(deltaLon2/deltaLat2) * 180 / Math.PI;
            if (((deltaLon2 >= 0) && (deltaLat2 >= 0)) || ((deltaLon2 < 0) && (deltaLat2 >= 0))) {
                angleVehicle += 180;
            } else if ((deltaLon2 >= 0) && (deltaLat2 < 0)) {
                angleVehicle += 360;
            }
            angle = Math.abs(angleTramo - angleVehicle);
            if (angle > 180) {
                angle = 360 - angle;
            }
            if (angle > 90) {
                return -1;
            }
            var magnitud = Math.sqrt(Math.pow(deltaLat2,2) + Math.pow(deltaLon2,2)) * .11106;
            var displacement = Math.abs(magnitud * Math.sin(angle * Math.PI / 180));
            if (displacement > radio) {
                return -3;
            }
            angle = Math.abs(camion.direccion - angleTramo);
            if (angle > 180) {
                angle = Math.abs(angle - 360);
            }
            angle = angle / 180;
            magnitud = displacement / radio;
            return angle + magnitud;
        }
        return 0;
    }

    qualifyRangeRelax(camion) {	
        if (this.nodoFin != null) {
            var radio = this.nodoIni.radio;
            //Calculamos el angulo con respecto al nodofinal
            var deltaLon1 = this.nodoFin.longitud - this.nodoIni.longitud;
            var deltaLat1 = this.nodoFin.latitud - this.nodoIni.latitud;
            var deltaLon2 = this.nodoFin.longitud - camion.longitud;
            var deltaLat2 = this.nodoFin.latitud - camion.latitud;
            var distanceNI = this.nodoIni.distancia(camion);
            //Para evitarnos errores de division por cero
            if (deltaLat1 == 0) {
                deltaLat1 = .000000001;
            }
            if (deltaLat2 == 0) {
                deltaLat2 = .000000001;
            }
            var angleTramo = Math.atan(deltaLon1/deltaLat1) * 180 / Math.PI;
            if (((deltaLon1 >= 0) && (deltaLat1 >= 0)) || ((deltaLon1 < 0) && (deltaLat1 >= 0))) {
                angleTramo += 180;
            } else if ((deltaLon1 >= 0) && (deltaLat1 < 0)) {
                angleTramo += 360;
            }
            var angleVehicle = Math.atan(deltaLon2/deltaLat2) * 180 / Math.PI;
            if (((deltaLon2 >= 0) && (deltaLat2 >= 0)) || ((deltaLon2 < 0) && (deltaLat2 >= 0))) {
                angleVehicle += 180;
            } else if ((deltaLon2 >= 0) && (deltaLat2 < 0)) {
                angleVehicle += 360;
            }
            var angle = Math.abs(angleTramo - angleVehicle);
            if (angle > 180) {
                angle = 360 - angle;
            }
            if (angle > 90) {
                return -2;
            }
            //Calculamos angulo con respecto al nodo inicial
            deltaLon1 = this.nodoIni.longitud - this.nodoFin.longitud;
            deltaLat1 = this.nodoIni.latitud - this.nodoFin.latitud;
            deltaLon2 = this.nodoIni.longitud - camion.longitud;
            deltaLat2 = this.nodoIni.latitud - camion.latitud;
            //Para evitarnos errores de division por cero
            if (deltaLat1 == 0) {
                deltaLat1 = .000000001;
            }
            if (deltaLat2 == 0) {
                deltaLat2 = .000000001;
            }
            angleTramo = Math.atan(deltaLon1/deltaLat1) * 180 / Math.PI;
            if (((deltaLon1 >= 0) && (deltaLat1 >= 0)) || ((deltaLon1 < 0) && (deltaLat1 >= 0))) {
                angleTramo += 180;
            } else if ((deltaLon1 >= 0) && (deltaLat1 < 0)) {
                angleTramo += 360;
            }
            angleVehicle = Math.atan(deltaLon2/deltaLat2) * 180 / Math.PI;
            if (((deltaLon2 >= 0) && (deltaLat2 >= 0)) || ((deltaLon2 < 0) && (deltaLat2 >= 0))) {
                angleVehicle += 180;
            } else if ((deltaLon2 >= 0) && (deltaLat2 < 0)) {
                angleVehicle += 360;
            }
            angle = Math.abs(angleTramo - angleVehicle);
            if (angle > 180) {
                angle = 360 - angle;
            }
            if ((angle > 90) && (distanceNI > radio)) {
                return -1;
            }
            var magnitud = Math.sqrt(Math.pow(deltaLat2,2) + Math.pow(deltaLon2,2)) * .11106;
            var displacement = Math.abs(magnitud * Math.sin(angle * Math.PI / 180));
            if (displacement > radio) {
                return -3;
            }
            angle = Math.abs(camion.direccion - angleTramo);
            if (angle > 180) {
                angle = Math.abs(angle - 360);
            }
            angle = angle / 180;
            magnitud = displacement / radio;
            return angle + magnitud;
        }
        return 0;
    }
}

class Tramos {    
    listaTramos = Array();

    getListaTramos() {
        return this.listaTramos;
    }

    constructor(tramos) { 
        var oArc;
        for (var i = 0; i < tramos.length; i++) {
            var tramo = new Tramo(tramos[i]);
            var iOrigen = tramo.nodoIni.orden;
            var iDestino = -1;
            if (tramo.nodoFin != null) {
                iDestino = tramo.nodoFin.orden;
            }
            graph.addArc(iOrigen, iDestino, tramo.derrotero);
            oArc = graph.getArc(iOrigen,iDestino);
            if (oArc != null) {
                if (parseInt(tramos[i]['invisible']) == 0) {
                    tramo.invisible = false;
                    oArc.invisible = false;
                } else {
                    tramo.invisible = true;
                    oArc.invisible = true;
                }
            }
            this.listaTramos.push(tramo);
        }     
    }
}