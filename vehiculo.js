class Vehiculo {
    nombre;
    id;
    IMEI;
    latitud;
    longitud;
    altitud;
    fecha;
    fechaText;
    horaText;
    velocidad;
    direccion;
    pasajeros;
    acumulado;
    credenciales;
    x;
    y;
    direccionxy;
    tramo;
    nodoActual;
    flashIndex;
    googleURL;
    desconectado;
    derrotero;
    estatus;
    bloqueos1;
    bloqueos2;
    puertas;
    comPuertas1 = true;
    comPuertas2 = true;
    lastBifur;
    repintar;
    AcuSubidas;
    AcuBajadas;
    banderaRTC;
    visible = true;

    intervaloDesconexion = 10; // Diez minutos se considera como desconexión
    bajadas;
    timeSpan;
    comEstado;    

    ctx; 
    pInicio;
    avanceX;
    avanceY;
    buscar = false;
    buscarBloqueos = false;
    buscarSinCom = false;
    buscarExceso = false;
    buscarFueraRuta = false;
    buscarMantenimiento = false;
    buscarEncierro = false;
    color;
    exceso;
    textExtra;
    xMantenimiento = -1;
    yMantenimiento = -1;
    xEncierro = -1;
    yEncierro = -1;
    xExceso = -1;
    yExceso = -1;
    xFuera = -1;
    yFuera = -1;
    xBloqueo = -1;
    yBloqueo = -1;
    xSinCom = -1;
    ySinCom = -1;

    constructor(vehiculo, ctx, pInicio, avanceX, avanceY) {               
        this.nombre = vehiculo["nombre"];
		this.id = parseInt(vehiculo["id"]);
		this.IMEI = vehiculo["IMEI"];
		this.latitud = vehiculo["latitud"];
		this.longitud = vehiculo["longitud"];
		this.altitud = vehiculo["altitud"];
        this.fechaText = "";
        this.horaText  = "";
		this.velocidad = parseInt(vehiculo["velocidad"]);
        this.direccion = parseInt(vehiculo["direccion"]);
        this.pasajeros = parseInt(vehiculo["pasajeros"]);
        this.acumulado = parseInt(vehiculo["acumulado"]);
        this.credenciales = parseInt(vehiculo["credenciales"]);
        this.banderaRTC = parseInt(vehiculo["banderaRTC"]);
        this.estatus = parseInt(vehiculo["estatus"]);
		this.direccionxy = 0;
		this.x = 0;
        this.y = 0;
		this.tramo = null;
		this.nodoActual = null;
		this.flashIndex = 0;
		this.desconectado = false;
		this.lastBifur = -1;
		this.repintar = true;
        this.comEstado = new Estado();   
        this.comEstado.bea = parseInt(vehiculo["bea"]);
        this.comEstado.gps = parseInt(vehiculo["gps"]);
        this.comEstado.sac = parseInt(vehiculo["sac"]);
        this.comEstado.puerta1 = parseInt(vehiculo["puerta1"]);
        this.comEstado.puerta2 = parseInt(vehiculo["puerta2"]);
        this.comEstado.conectado = parseInt(vehiculo["conectado"]);
        this.ctx = ctx;  
        this.pInicio = pInicio;
        this.avanceX = avanceX;
        this.avanceY = avanceY;
        this.exceso = false;
        this.textExtra = '';      
        this.googleURL = "http://www.miruta.com.mx/localizacion/ubicarBUS.aspx?lat=" +  String(this.latitud/1000000) + "&lon=" + String(this.longitud/1000000) + ""; 
  

        if (typeof(vehiculo["fecha"]) === "string") {            
            var ano = parseInt(vehiculo["fecha"].substring(0, 4));
            var mes = parseInt(vehiculo["fecha"].substring(5,7));
            var dia = parseInt(vehiculo["fecha"].substring(8,10));
            var hora = parseInt(vehiculo["fecha"].substring(11,13));
            var minuto = parseInt(vehiculo["fecha"].substring(14,16));
            var segundo = parseInt(vehiculo["fecha"].substring(17,19));
            // Revisamos el dato de la fecha/hora para saber si se le aplica el offset
            //console.log('rtc:' + this.banderaRTC);
            if (this.banderaRTC === 0) {
                this.fecha = new Date(ano, mes - 1, dia, hora, minuto, segundo);
                this.fecha = this.convertUTCDateToLocalDate(this.fecha);
                // Revisamos si está en horario de verano
                if (this.isDstSwitchDates() && this.isDST(this.fecha)) {                
                    this.fecha.setHours(this.fecha.getHours() + 1);
                } 
            } else {
                this.fecha = new Date(ano, mes - 1, dia, hora, minuto, segundo);
            }
            // Separamos la fecha y la hora para mostrar como datos del autobús            
            this.fechaText = this.pad2(this.fecha.getDate()) + "/" + this.pad2(this.fecha.getMonth() + 1) + "/" + this.fecha.getFullYear();
            this.horaText = this.pad2(this.fecha.getHours()) + ":" + this.pad2(this.fecha.getMinutes()) + ":" + this.pad2(this.fecha.getSeconds());
        } else {
            this.fecha = vehiculo["fecha"];
        }        
        this.isDisconnected();
    }

    pad2(number) {   
        return (number < 10 ? '0' : '') + number      
    }

    diff (num1, num2) {
        if (num1 > num2) {
          return (num1 - num2);
        } else {
          return (num2 - num1);
        }
    };

    mostrarInfoPantalla(x, y) {
        var iDiv = document.getElementById("iDatosBus");
        iDiv.style.display = "block";
        var cadena = "Unidad: " + this.nombre + "\n" + 
                 "Velocidad: " + this.velocidad + " km/h\n" +
                 "Fecha: " + this.fechaText + "\n" + 
                 "Hora: " + this.horaText + "\n" + 
                 "Acumulado: " + this.acumulado + "\n" +
                 "Credenciales: " + this.credenciales + 
                 this.textExtra;
        iDiv.innerText = cadena;
        var cb = document.getElementById("canvas2").getBoundingClientRect();        
        if (this.textExtra.length > 0) {
            y = y - 240 ;
        } else {
            y = y - 210 ;
        }
        iDiv.style.left = x  + 60 + 'px';
        iDiv.style.top =  y + 60 + 'px';
    }

    mostrarInfoPantallaFueraRuta(x, y) {
        var iDiv = document.getElementById("iDatosBusFueraRuta");
        var iDiv2 = document.getElementsByName("divFueraRuta");
        iDiv.style.display = "block";
        var cadena = "Unidad: " + this.nombre + "\n" + 
                 "Velocidad: " + this.velocidad + " km/h\n" +
                 "Fecha: " + this.fechaText + "\n" + 
                 "Hora: " + this.horaText + "\n" + 
                 "Acumulado: " + this.acumulado + "\n" +
                 "Credenciales: " + this.credenciales + 
                 this.textExtra;
        iDiv.innerText = cadena;
        if (this.textExtra.length > 0) {
            y -= 180;
        } else {
            y -= 150;
        }
        iDiv.style.left = x - 60 + (document.body.clientWidth / 2.7) + 'px';
        iDiv.style.top =  y - iDiv2[0].scrollTop + 'px';
    }

    mostrarInfoPantallaBloqueos(x, y) {
        var iDiv = document.getElementById("iDatosBusBloqueos");
        var iDiv2 = document.getElementsByName("divBloqueos");
        iDiv.style.display = "block";
        var cadena = "Unidad: " + this.nombre + "\n" + 
                 "Velocidad: " + this.velocidad + " km/h\n" +
                 "Fecha: " + this.fechaText + "\n" + 
                 "Hora: " + this.horaText + "\n" + 
                 "Acumulado: " + this.acumulado + "\n" +
                 "Credenciales: " + this.credenciales + 
                 this.textExtra;
        iDiv.innerText = cadena;
        if (this.textExtra.length > 0) {
            y -= 180;
        } else {
            y -= 150;
        }
        iDiv.style.left = x - 60 + (document.body.clientWidth / 4.5) + 'px';
        iDiv.style.top =  y - iDiv2[0].scrollTop + 'px';
    }

    mostrarInfoPantallaSinCom(x, y) {
        var iDiv = document.getElementById("iDatosBusSinCom");
        var iDiv2 = document.getElementsByName("divSinCom");
        iDiv.style.display = "block";
        var cadena = "Unidad: " + this.nombre + "\n" + 
                 "Velocidad: " + this.velocidad + " km/h\n" +
                 "Fecha: " + this.fechaText + "\n" + 
                 "Hora: " + this.horaText + "\n" + 
                 "Acumulado: " + this.acumulado + "\n" +
                 "Credenciales: " + this.credenciales + 
                 this.textExtra;
        iDiv.innerText = cadena;
        if (this.textExtra.length > 0) {
            y -= 180;
        } else {
            y -= 150;
        }    
        iDiv.style.left = x - 60 + (document.body.clientWidth / 2) + 'px';
        iDiv.style.top =  y - iDiv2[0].scrollTop + 'px';
    }

    mostrarInfoPantallaExceso(x, y) {
        var iDiv = document.getElementById("iDatosBusExceso");
        var iDiv2 = document.getElementsByName("divExceso");
        iDiv.style.display = "block";
        var cadena = "Unidad: " + this.nombre + "\n" + 
                 "Velocidad: " + this.velocidad + " km/h\n" +
                 "Fecha: " + this.fechaText + "\n" + 
                 "Hora: " + this.horaText + "\n" + 
                 "Acumulado: " + this.acumulado + "\n" +
                 "Credenciales: " + this.credenciales + 
                 this.textExtra;
        iDiv.innerText = cadena;
        if (this.textExtra.length > 0) {
            y -= 180;
        } else {
            y -= 150;
        }
        iDiv.style.left = x - 60 + (document.body.clientWidth / 1.5) + 'px';
        iDiv.style.top =  y - iDiv2[0].scrollTop + 'px';
    }

    mostrarInfoPantallaMantenimiento(x, y) {
        var iDiv = document.getElementById("iDatosBusMantenimiento");
        var iDiv2 = document.getElementsByName("divMantenimiento");
        iDiv.style.display = "block";
        var cadena = "Unidad: " + this.nombre + "\n" + 
                 "Velocidad: " + this.velocidad + " km/h\n" +
                 "Fecha: " + this.fechaText + "\n" + 
                 "Hora: " + this.horaText + "\n" + 
                 "Acumulado: " + this.acumulado + "\n" +
                 "Credenciales: " + this.credenciales + 
                 this.textExtra;
        iDiv.innerText = cadena;
        if (this.textExtra.length > 0) {
            y -= 200;
        } else {
            y -= 150;
        }
        iDiv.style.left = x - 60 + (document.body.clientWidth / 2) + 'px';
        iDiv.style.top =  y - iDiv2[0].scrollTop + 'px';
    }

    mostrarInfoPantallaEncierro(x, y) {
        var iDiv = document.getElementById("iDatosBusEncierro");
        var iDiv2 = document.getElementsByName("divEncierro");
        iDiv.style.display = "block";
        var cadena = "Unidad: " + this.nombre + "\n" + 
                 "Velocidad: " + this.velocidad + " km/h\n" +
                 "Fecha: " + this.fechaText + "\n" + 
                 "Hora: " + this.horaText + "\n" + 
                 "Acumulado: " + this.acumulado + "\n" +
                 "Credenciales: " + this.credenciales + 
                 this.textExtra;
        iDiv.innerText = cadena;
        if (this.textExtra.length > 0) {
            y -= 180;
        } else {
            y -= 150;
        }
        iDiv.style.left = x - 60 + (document.body.clientWidth / 4.5) + 'px';
        iDiv.style.top =  y - iDiv2[0].scrollTop + 'px';
    }

   isOver(mx, my, ox, oy) {        
        var deltaX = this.diff((this.x * sx) + this.avanceX, mx);
        var deltaY = this.diff((this.y * sy) + this.avanceY, my);
        var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));                                
        if (dist <= 8) {
            this.mostrarInfoPantalla(ox, oy);
            return true;
        } else {
            return false;
        }
    }

    isOverFueraRuta(mx, my) {        
        var deltaX = this.diff(this.xFuera, mx);
        var deltaY = this.diff(this.yFuera, my);
        var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));                                
        if (dist <= 8) {
            this.mostrarInfoPantallaFueraRuta(mx, my);
            return true;
        } else {
            return false;
        }
    }

    isOverBloqueos(mx, my) {        
        var deltaX = this.diff(this.xBloqueo, mx);
        var deltaY = this.diff(this.yBloqueo, my);
        var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));                                
        if (dist <= 8) {
            this.mostrarInfoPantallaBloqueos(mx, my);
            return true;
        } else {
            return false;
        }
    }

    isOverSinCom(mx, my) {        
        var deltaX = this.diff(this.xSinCom, mx);
        var deltaY = this.diff(this.ySinCom, my);
        var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));                                
        if (dist <= 8) {
            this.mostrarInfoPantallaSinCom(mx, my);
            return true;
        } else {
            return false;
        }
    }

    isOverExceso(mx, my) {        
        var deltaX = this.diff(this.xExceso, mx);
        var deltaY = this.diff(this.yExceso, my);
        var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));                                
        if (dist <= 8) {
            this.mostrarInfoPantallaExceso(mx, my);
            return true;
        } else {
            return false;
        }
    }

    isOverMantenimiento(mx, my) {        
        var deltaX = this.diff(this.xMantenimiento, mx);
        var deltaY = this.diff(this.yMantenimiento, my);
        var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));                                
        if (dist <= 8) {
            this.mostrarInfoPantallaMantenimiento(mx, my);
            return true;
        } else {
            return false;
        }
    }

    isOverEncierro(mx, my) {        
        var deltaX = this.diff(this.xEncierro, mx);
        var deltaY = this.diff(this.yEncierro, my);
        var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));                                
        if (dist <= 8) {
            this.mostrarInfoPantallaEncierro(mx, my);
            return true;
        } else {
            return false;
        }
    }

    mostrarInfo(mx, my, ox, oy) {     
        var deltaX = this.diff((this.x * sx) + this.avanceX, mx);
        var deltaY = this.diff((this.y * sy) + this.avanceY, my);
        var dist = Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        //console.log(dist);
        if (dist <= 8) {
            //this.mostrarInfoPantalla(ox, oy);
            return true;
        } else {
            return false;
        } 
    }

    dibujar() {
        this.exceso = false;
        //console.log(this.nombre + ' dirección:' + this.direccionxy);    
        //console.log(this.nombre + ' nodoActual:' + this.nodoActual);   
        // Establecemos como color default el verde
        this.color = 'green';                              
        // Revisamos si el bus va a exceso de velocidad
        if (this.velocidad > nodos.listaNodos[this.nodoActual].velocidad) {
            this.color = 'red';
            this.exceso = true;
        }                      
        // Revisamos si el bus tiene bloqueos
        if ((this.bloqueos1 > 0) || (this.bloqueos2 > 0)) {
            this.color = 'black';
        } 
        switch(Math.round(this.direccionxy)) {
            case 180: // regreso
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color;
                this.ctx.moveTo((this.x * sx) + this.pInicio + this.avanceX + 5, (this.y * sy) - 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX + 5, (this.y * sy) + 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX, (this.y * sy) + 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX - 5, (this.y * sy) + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX, (this.y * sy) - 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX + 5, (this.y * sy)- 5 + this.avanceY);
                this.ctx.fill();                
                this.ctx.fillStyle = "#000000";
                this.ctx.font = "700 7px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillText(this.nombre.split("").join(String.fromCharCode(8202)), (this.x * sx) + this.pInicio + this.avanceX, (this.y * sy) + 15 + this.avanceY); 
                this.ctx.stroke();                                        
                this.ctx.closePath(); 
                break;
            case 360: // ida
            default:
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color;
                this.ctx.moveTo((this.x * sx) + this.pInicio + this.avanceX - 5, (this.y * sy) - 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX - 5, (this.y * sy) + 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX, (this.y * sy) + 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX + 5, (this.y * sy) + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX, (this.y * sy) - 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX - 5, (this.y * sy) - 5 + this.avanceY);
                this.ctx.fill();
                this.ctx.fillStyle = "#000000";
                this.ctx.font = "700 7px Arial";
                this.ctx.textAlign = "center";
                this.ctx.fillText(this.nombre.split("").join(String.fromCharCode(8202)), (this.x * sx) + this.pInicio + this.avanceX, (this.y * sy) - 10 + this.avanceY); 
                this.ctx.stroke();                                        
                this.ctx.closePath(); 
                break;
            case 270: // Arriba
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color;
                this.ctx.moveTo((this.x * sx) + this.pInicio + this.avanceX - 5, (this.y * sy) + 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX + 5, (this.y * sy) + 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX + 5, (this.y * sy) + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX, (this.y * sy) - 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX - 5, (this.y * sy) + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX - 5, (this.y * sy) + 5 + this.avanceY);
                this.ctx.fill();
                this.ctx.fillStyle = "#000000";
                this.ctx.font = "700 7px Arial";
                this.ctx.textAlign = "right";
                this.ctx.fillText(this.nombre.split("").join(String.fromCharCode(8202)), (this.x * sx) + this.pInicio + this.avanceX - 10, (this.y * sy) + 5 + this.avanceY); 
                this.ctx.stroke();                                        
                this.ctx.closePath(); 
                break;
            case 90: // Abajo
                this.ctx.beginPath();
                this.ctx.fillStyle = this.color;
                this.ctx.moveTo((this.x * sx) + this.pInicio + this.avanceX - 5, (this.y * sy) - 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX + 5, (this.y * sy) - 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX + 5, (this.y * sy) + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX, (this.y * sy) + 5 + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX - 5, (this.y * sy) + this.avanceY);
                this.ctx.lineTo((this.x * sx) + this.pInicio + this.avanceX - 5, (this.y * sy) - 5 + this.avanceY);
                this.ctx.fill();
                this.ctx.fillStyle = "#000000";
                this.ctx.font = "700 7px Arial";
                this.ctx.textAlign = "right";
                this.ctx.fillText(this.nombre.split("").join(String.fromCharCode(8202)), (this.x * sx) + this.pInicio + this.avanceX + 25, (this.y * sy) + this.avanceY); 
                this.ctx.stroke();                                        
                this.ctx.closePath(); 
                break;
        }    
        if (this.buscar) {
            this.ctx.beginPath();
            this.ctx.lineWidth = 0;
            this.ctx.fillStyle = "red";
            this.ctx.globalAlpha = 0.3;
            this.ctx.arc((this.x * sx) + this.pInicio + this.avanceX, (this.y * sy) + avanceY, 10, 0, 2 * Math.PI);
            this.ctx.stroke();
            this.ctx.fill();
            this.ctx.closePath();
            this.ctx.lineWidth = 1;
            this.ctx.globalAlpha = 1;
        }              
    }

    actualizarDatos(camion) {
        var ano;
        var mes;
        var dia;
        var hora;
        var minuto;
        var segundo;
        if (typeof(camion['fecha']) === "string") {
            ano = parseInt(camion['fecha'].substring(0, 4));
            mes = parseInt(camion['fecha'].substring(5,7));
            dia = parseInt(camion['fecha'].substring(8,10));
            hora = parseInt(camion['fecha'].substring(11,13));
            minuto = parseInt(camion['fecha'].substring(14,16));
            segundo = parseInt(camion['fecha'].substring(17,19));
            // Revisamos el dato de la fecha/hora para saber si se le aplica el offset
            if (this.banderaRTC === 0) {
                this.fecha = this.convertUTCDateToLocalDate(new Date(ano, mes - 1, dia, hora, minuto, segundo));
                // Revisamos si está en horario de verano
                if (this.isDstSwitchDates() && this.isDST(this.fecha)) {                
                    this.fecha.setHours(this.fecha.getHours() + 1);
                } 
            } else {
                this.fecha = new Date(ano, mes - 1, dia, hora, minuto, segundo);
            }
            // Separamos la fecha y la hora para mostrar como datos del autobús
            this.fechaText = this.pad2(this.fecha.getDate()) + "/" + this.pad2(this.fecha.getMonth() + 1) + "/" + this.fecha.getFullYear();
            this.horaText = this.pad2(this.fecha.getHours()) + ":" + this.pad2(this.fecha.getMinutes()) + ":" + this.pad2(this.fecha.getSeconds());
        } else {
            this.fecha = camion.fecha;
            ano = this.fecha.getFullYear();
            mes = this.fecha.getMonth();
            dia = this.fecha.getDate();
            hora = this.fecha.getHours();
            minuto = this.fecha.getMinutes();
            segundo = this.fecha.getSeconds();       
            this.fechaText = this.pad2(dia) + "/" + this.pad2(mes + 1) + "/" + ano;
            this.horaText = this.pad2(hora) + ":" + this.pad2(minuto) + ":" + this.pad2(segundo);
        }
        this.nombre = camion['nombre'];
        this.IMEI = camion['IMEI'];
        this.latitud = camion['latitud'];
        this.longitud = camion['longitud'];
        this.altitud = camion['altitud'];        
        this.velocidad = parseInt(camion["velocidad"]);
        this.direccion = parseInt(camion["direccion"]);
        this.pasajeros = parseInt(camion["pasajeros"]);
        this.acumulado = parseInt(camion["acumulado"]);
        this.credenciales = parseInt(camion["credenciales"]);
        this.banderaRTC = parseInt(camion["banderaRTC"]);
        this.estatus = parseInt(camion["estatus"]);
        this.comEstado.bea = parseInt(camion["bea"]);
        this.comEstado.gps = parseInt(camion["gps"]);
        this.comEstado.sac = parseInt(camion["sac"]);
        this.comEstado.puerta1 = parseInt(camion["puerta1"]);
        this.comEstado.puerta2 = parseInt(camion["puerta2"]);
        this.comEstado.conectado = parseInt(camion["conectado"]);
        this.textExtra = '';
        this.isDisconnected();
        this.decodeStatus(this.estatus);        
    }
    
    actualizar(nombre,id,IMEI,latitud,longitud,altitud,fecha,velocidad,direccion,x,y,direccionxy,tramo,nodoActual) {   
        var ano;
        var mes;
        var dia;
        var hora;
        var minuto;
        var segundo;
        if (typeof(fecha) === "string") {    
            ano = parseInt(fecha.substring(0, 4));
            mes = parseInt(fecha.substring(5,7));
            dia = parseInt(fecha.substring(8,10));
            hora = parseInt(fecha.substring(11,13));
            minuto = parseInt(fecha.substring(14,16));
            segundo = parseInt(fecha.substring(17,19));            
            // Revisamos el dato de la fecha/hora para saber si se le aplica el offset
            if (this.banderaRTC === 0) {
                this.fecha = this.convertUTCDateToLocalDate(new Date(ano, mes - 1, dia, hora, minuto, segundo));
                // Revisamos si está en horario de verano
                if (this.isDstSwitchDates() && this.isDST(this.fecha)) {                
                    this.fecha.setHours(this.fecha.getHours() + 1);
                } 
            } else {
                this.fecha = new Date(ano, mes - 1, dia, hora, minuto, segundo);
            }
            this.fechaText = this.pad2(dia) + "/" + this.pad2(mes + 1) + "/" + ano;
            this.horaText = this.pad2(hora) + ":" + this.pad2(minuto) + ":" + this.pad2(segundo);
        } else {
            ano = fecha.getFullYear();
            mes = fecha.getMonth();
            dia = fecha.getDate();
            hora = fecha.getHours();
            minuto = fecha.getMinutes();
            segundo = fecha.getSeconds();
            this.fecha = fecha;
            this.fechaText = this.pad2(dia) + "/" + this.pad2(mes + 1) + "/" + ano;
            this.horaText = this.pad2(hora) + ":" + this.pad2(minuto) + ":" + this.pad2(segundo);
        }        
        this.nombre = nombre;
        this.id = id;
        this.IMEI = IMEI;
        this.latitud = latitud;
        this.longitud = longitud;
        this.altitud = altitud;        
        this.velocidad = velocidad;
        this.direccion = direccion;
        this.direccionxy = direccionxy;
        this.x = x;
        this.y = y;
        this.tramo = tramo;		
        this.nodoActual = nodoActual;
        //console.log("entro3");
        this.isDisconnected();
    }

  

    getDistancexy(v) {
        var lDist = Math.sqrt(Math.pow((this.x - v.x),2) + Math.pow((this.y - v.y),2));
        return lDist;
    }

    getDistancexys(v,sx,sy) {
        var lDist = Math.sqrt(Math.pow(((this.x * sx) - (v.x * sx)),2) + Math.pow(((this.y * sy) - (v.y * sy)),2));
        return lDist;
    }

    isDisconnected() {
        if (this.fecha > Date.now()) {
            this.desconectado = false;            
        } else {
            var f =  new Date(this.fecha.getFullYear(), this.fecha.getMonth() - 1, this.fecha.getDate(), this.fecha.getHours(), this.fecha.getMinutes(), this.fecha.getSeconds());
            var today = new Date();
            // console.log(this.fechaText + ' ' + this.horaText);
            // console.log(f);
            // console.log(today);
            var difference = Math.abs(today - f);
            // console.log(difference);
            // console.log(Math.floor((difference / 1000) / 60));

            if (Math.floor((difference / 1000) / 60) > this.intervaloDesconexion){//3600000) {
                this.desconectado = true;
            } else {
                this.desconectado = false;
            }
            //trace ("ID:" + this.id + "\nhoy:" + today.toString() + "\nfecha:" + fecha.toString() + "\ndiferencia:" + difference);
        }
    }
    
    decodeStatus(dato) {  
        //console.log("decodificando status = " + dato);      
		this.bloqueos1 = dato & 0x0F;
        this.bloqueos2 = (dato >> 4) & 0x0F;
        //console.log("bloqueos1 = " + this.bloqueos1);  
        //console.log("bloqueos2 = " + this.bloqueos2);  
		if ((dato & 0x100) > 0) {
			this.comPuertas1 = false;
		} else {
			this.comPuertas1 = true;
		}
		if ((dato & 0x200) > 0) {
			this.comPuertas2 = false;
		} else {
			this.comPuertas2 = true;
		}
		this.estatus = (dato >> 12) & 0x07;
    }
    
    actualizarPosicion(latitud,longitud,altitud,fecha,velocidad,direccion,pasajeros,acumulado,estatus,bajadas,AcuSubidas,AcuBajadas,intervaloDesconexion,servidor) {
        this.intervaloDesconexion = intervaloDesconexion;
        this.estatus = estatus;
        var ano;
        var mes;
        var dia;
        var hora;
        var minuto;
        var segundo;
        if (typeof(fecha) === "string") {  
            ano = parseInt(fecha.substring(0, 4));
            mes = parseInt(fecha.substring(5,7));
            dia = parseInt(fecha.substring(8,10));
            hora = parseInt(fecha.substring(11,13));
            minuto = parseInt(fecha.substring(14,16));
            segundo = parseInt(fecha.substring(17,19));
            // Revisamos el dato de la fecha/hora para saber si se le aplica el offset
            if (this.banderaRTC === 0) {
                this.fecha = this.convertUTCDateToLocalDate(new Date(ano, mes - 1, dia, hora, minuto, segundo));
                // Revisamos si está en horario de verano
                if (this.isDstSwitchDates() && this.isDST(this.fecha)) {                
                    this.fecha.setHours(this.fecha.getHours() + 1);
                } 
            } else {
                this.fecha = new Date(ano, mes - 1, dia, hora, minuto, segundo);
            }
            this.fechaText = this.pad2(dia) + "/" + this.pad2(mes + 1) + "/" + ano;
            this.horaText = this.pad2(hora) + ":" + this.pad2(minuto) + ":" + this.pad2(segundo);
        } else {
            ano = fecha.getFullYear();
            mes = fecha.getMonth();
            dia = fecha.getDate();
            hora = fecha.getHours();
            minuto = fecha.getMinutes();
            segundo = fecha.getSeconds();
            this.fecha = fecha;
            this.fechaText = this.pad2(dia) + "/" + this.pad2(mes + 1) + "/" + ano;
            this.horaText = this.pad2(hora) + ":" + this.pad2(minuto) + ":" + this.pad2(segundo);
        }
        var tempFecha = new Date();
        tempFecha.setUTCFullYear(ano, mes - 1, dia);
        tempFecha.setUTCHours(hora, minuto, segundo);

        var tempVel;
        if (this.fecha != null) {
			var lDist = Math.sqrt(Math.pow((this.latitud - latitud),2) + Math.pow((this.longitud - longitud),2)) * .11106;
			lDist = lDist / 1000;
			var tiempo = tempFecha.valueOf() - this.fecha.valueOf();
			tiempo = tiempo / 3600000;
			var vel = lDist / tiempo;
			tempVel = vel;
		} else {
			tempVel = 0;
		}

        if ((tempVel < 20000)) {
            this.repintar = true;
            this.latitud = latitud;
            this.longitud = longitud;
            this.altitud = altitud;
            this.fecha = tempFecha;
            this.decodeStatus(estatus);
            //this.fecha.setUTCFullYear(ano,mes - 1,dia);
            //this.fecha.setUTCHours(hora,minuto,segundo);
            //this.fechaText = "fec: ";

            var sTemp = String(this.fecha.getDate());
            if (sTemp.length == 1) {
                sTemp = "0" + sTemp;
            }
            this.fechaText = sTemp + "/";
            sTemp = String(this.fecha.getMonth() + 1);
            if (sTemp.length == 1) {
                sTemp = "0" + sTemp;
            }
            this.fechaText = this.fechaText + sTemp + "/";
            sTemp = String(this.fecha.getFullYear());
            this.fechaText = this.fechaText + sTemp + " ";
            sTemp = String(this.fecha.getHours());
            if (sTemp.length == 1) {
                sTemp = "0" + sTemp;
            }
            //this.horaText = sTemp + ":";
            sTemp = String(this.fecha.getMinutes());
            if (sTemp.length == 1) {
                sTemp = "0" + sTemp;
            }
            //this.horaText = this.horaText + sTemp + ":";
            sTemp = String(this.fecha.getSeconds());
            if (sTemp.length == 1) {
                sTemp = "0" + sTemp;
            }
            //this.horaText = this.horaText + sTemp;
            //this.fechaText = "hola123456789"	;
            this.velocidad = velocidad;
            this.direccion = direccion;
        }
        if (tempFecha != fecha) {
            this.repintar = true;
        } else {
            this.repintar = false;
        }
        //this.googleURL = "http://www.alethia.com.mx/localizacion/googlemaps.aspx?latitud=" + String(latitud/1000000) + "&longitud=" + String(longitud/1000000) + "&vehiculo=" + this.nombre + "&velocidad=" + String(this.velocidad) + "&fecha=" + this.fechaText;
        //this.googleURL = "http://maps.google.com/maps/api/staticmap?center=" + String(latitud/1000000) + "'," + String(longitud/1000000) + "'" + "&zoom=15&size=600x650&maptype=roadmap&markers=color:blue|label:AS|" + String(latitud/1000000) + "," + String(longitud/1000000) + "&sensor=false";
        this.googleURL = "http://" + servidor + "/localizacion/ubicarBUS.aspx?lat=" +  String(latitud/1000000) + "&lon=" + String(longitud/1000000) + "";
        this.pasajeros = pasajeros;
        this.acumulado = acumulado;
        this.bajadas = bajadas;
        this.AcuBajadas = AcuBajadas;
        this.AcuSubidas = AcuSubidas;

        //console.log("Entrando a revisar desconexión: " + this.intervaloDesconexion);
        var today = new Date();
        var difference = today - this.fecha;
        if (difference > this.intervaloDesconexion){//3600000) {
            this.desconectado = true;
        } else {
            this.desconectado = false;
        }
        //trace ("ID:" + this.id + "\nhoy:" + today.toString() + "\nfecha:" + fecha.toString() + "\ndiferencia:" + difference);
    }

    actualizarPantalla(x, y, direccionxy, tramo, nodoActual) {
        this.direccionxy = direccionxy;
        this.x = x;
        this.y = y;
        this.tramo = tramo;
        this.nodoActual = nodoActual;			
    }

    // convertUTCDateToLocalDate(date) {
    //     var newDate = new Date(date.getTime() + date.getTimezoneOffset() * 60 * 1000);
    
    //     var offset = date.getTimezoneOffset() / 60;
    //     var hours = date.getHours();
    
    //     newDate.setHours(hours - offset);
    //     return newDate;   
    // }

    convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime() - date.getTimezoneOffset() * 60 * 1000);
        
        return newDate;   
    }

    isDST(date) {
        var year = date.getFullYear();
        var dst_start = new Date(year, 2, 14);
        var dst_end = new Date(year, 10, 7);
        dst_start.setDate(14 - dst_start.getDay()); // adjust date to 2nd Sunday
        dst_end.setDate(7 - dst_end.getDay()); // adjust date to the 1st Sunday
        return (date >= dst_start && date < dst_end);
    }

    isDstSwitchDates() {
        var year = new Date().getYear();
        if (year < 1000)
            year += 1900;

        var firstSwitch = 0;
        var secondSwitch = 0;
        var lastOffset = 99;

        // Loop through every month of the current year
        for (var i = 0; i < 12; i++) {
            // Fetch the timezone value for the month
            var newDate = new Date(Date.UTC(year, i, 0, 0, 0, 0, 0));
            var tz = -1 * newDate.getTimezoneOffset() / 60;

            // Capture when a timzezone change occurs
            if (tz > lastOffset)
                firstSwitch = i-1;
            else if (tz < lastOffset)
                secondSwitch = i-1;

            lastOffset = tz;
        }

        // Go figure out date/time occurrences a minute before
        // a DST adjustment occurs
        var secondDstDate = this.findDstSwitchDate(year, secondSwitch);
        var firstDstDate = this.findDstSwitchDate(year, firstSwitch);

        if (firstDstDate == null && secondDstDate == null) {
            return false;
        } else {
            return true;
        }
    }

    findDstSwitchDate(year, month) {
        // Set the starting date
        var baseDate = new Date(Date.UTC(year, month, 0, 0, 0, 0, 0));
        var changeDay = 0;
        var changeMinute = -1;
        var baseOffset = -1 * baseDate.getTimezoneOffset() / 60;
        var dstDate;

        // Loop to find the exact day a timezone adjust occurs
        for (var day = 0; day < 50; day++) {
            var tmpDate = new Date(Date.UTC(year, month, day, 0, 0, 0, 0));
            var tmpOffset = -1 * tmpDate.getTimezoneOffset() / 60;

            // Check if the timezone changed from one day to the next
            if (tmpOffset != baseOffset) {
                var minutes = 0;
                changeDay = day;

                // Back-up one day and grap the offset
                tmpDate = new Date(Date.UTC(year, month, day-1, 0, 0, 0, 0));
                tmpOffset = -1 * tmpDate.getTimezoneOffset() / 60;

                // Count the minutes until a timezone change occurs
                while (changeMinute == -1) {
                    tmpDate = new Date(Date.UTC(year, month, day-1, 0, minutes, 0, 0));
                    tmpOffset = -1 * tmpDate.getTimezoneOffset() / 60;

                    // Determine the exact minute a timezone change
                    // occurs
                    if (tmpOffset != baseOffset) {
                        // Back-up a minute to get the date/time just
                        // before a timezone change occurs
                        tmpOffset = new Date(Date.UTC(year, month,
                                             day-1, 0, minutes-1, 0, 0));
                        changeMinute = minutes;
                        break;
                    } else {
                        minutes++;
                    }
                }

                // Add a month (for display) since JavaScript counts
                // months from 0 to 11
                dstDate = tmpOffset.getMonth() + 1;

                // Pad the month as needed
                if (dstDate < 10) dstDate = "0" + dstDate;

                // Add the day and year
                dstDate += '/' + tmpOffset.getDate() + '/' + year + ' ';
 
                // Capture the time stamp
                tmpDate = new Date(Date.UTC(year, month,
                                   day-1, 0, minutes-1, 0, 0));
                dstDate += tmpDate.toTimeString().split(' ')[0];
                return dstDate;
            }
        }
    }
}

class Vehiculos {    
    listaVehiculos = Array();

    getListaTramos() {
        return this.listaVehiculos;
    }

    constructor(vehiculos, ctx, pInicio, avanceX, avanceY) { 
        for (var i = 0; i < vehiculos.length; i++) {
            var vehiculo = new Vehiculo(vehiculos[i], ctx, pInicio, avanceX, avanceY);
            vehiculo.flashIndex = i;

            this.listaVehiculos.push(vehiculo);
            
        }     
    }
}