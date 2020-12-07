class Encierro {
    //propiedades del encierro
	id;
	nombre;
	latitud;
	longitud;
	tiempo;
    radio;
    
    //constructor
    constructor(encierro) {    
        this.id = parseInt(encierro['id']);
		this.nombre = encierro['nombre'];
		this.latitud = parseInt(encierro['latitud']);
		this.longitud = parseInt(encierro['longitud']);
		this.tiempo = parseInt(encierro['tiempo']);
		this.radio = parseInt(encierro['radio']);
    }

    isInside(camion) {
        var lDist = Math.sqrt(Math.pow((this.latitud - camion.latitud),2) + Math.pow((this.longitud - camion.longitud),2)) * .11106;
        //trace("Distancia Encierro: " + lDist.toString());
        if (lDist <= this.radio) {
            return true;
        } else {
            return false;
        }
    }
}

class Encierros {    
    listaEncierros = Array();

    getListaEncierros() {
        return this.listaEncierros;
    }

    constructor(encierros) { 
        for (var i = 0; i < encierros.length; i++) {
            var encierro = new Encierro(encierros[i]);
            this.listaEncierros.push(encierro);
        }     
    }
}