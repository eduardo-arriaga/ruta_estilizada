<?php
  require_once './con_db.php'; //libreria de conexion a la base

  class Nodo {
    public $id;
    public $nombre; 
    public $latitud;
    public $longitud;
    public $x;
    public $y;
    public $icono;
    public $orden;
    public $radio;
    public $visitado;
    public $velocidad;
    public $visible;
  }

  class Tramo {
    public $nodoIni;
    public $nodoFin;
    public $direccion;
    public $direccionxy;
    public $distancia;
    public $distanciaxy;
    public $invisible;
    public $derrotero;
  }

  class Vehiculo {
    public $nombre;
    public $id;
    public $IMEI;
    public $latitud;
    public $longitud;
    public $altitud;
    public $fecha;
    public $fechaText;
    public $horaText;
    public $velocidad;
    public $direccion;
    public $pasajeros;
    public $acumulado;
    public $credenciales;
    public $banderaRTC;
    public $estatus;
    public $bea;
    public $gps;
    public $sac;
    public $puerta1;
    public $puerta2;
    public $scom;
    public $fechaComunicacion;
    public $fechaServidor;
    public $conectado;
  }

  class Encierro {
    public $id;
    public $nombre;
    public $latitud;
    public $longitud;
    public $tiempo;
    public $radio;
  }
  $minX = 0;
  $maxX = 0;
  $minY = 0;
  $maxY = 0;
  $nombre = filter_input(INPUT_POST, 'nombre');//obtenemos el parametro que viene de ajax
  $id = filter_input(INPUT_POST, 'id');

  if($id > 0) {
    $con = conDb();
    if(!$con) {
      die("<br/>Sin conexi&oacute;n.");
    }
    $vis=1;
    // Obtenemos las consultas de los nodos y tramos
    $sql = "SELECT t.SubRuta, n.ID ID1, n.Nombre Nombre1, n.Latitud Latitud1, n.Longitud Longitud1, n.PuntoX PuntoX1, n.PuntoY PuntoY1, n.Icono Icono1, n.Orden Orden1, n.Radio Radio1, n.Direccion Direccion1, IFNULL(n.Visible, 0) Visible1, n.Velocidad Velocidad1, " . 
           "nd.ID ID2, nd.Nombre Nombre2, nd.Latitud Latitud2, nd.Longitud Longitud2, IFNULL(nd.PuntoX, -1) PuntoX2, IFNULL(nd.PuntoY, -1) PuntoY2, nd.Icono Icono2, nd.Orden Orden2, nd.Radio Radio2, nd.Direccion Direccion2, IFNULL(nd.Visible, 0) Visible2, nd.Velocidad Velocidad2 " . 
           "FROM " . $nombre . ".nodos_ruta n LEFT JOIN " . $nombre . ".tramos t ON t.Ruta = n.RutaID AND t.Origen = n.Orden " . 
           "LEFT JOIN " . $nombre . ".nodos_ruta nd ON nd.RutaID = n.RutaID AND nd.Orden = t.Destino WHERE n.RutaID = " . $id . " ORDER BY n.Orden";
    $query = mysqli_query($con, $sql); 
    $filas = mysqli_fetch_all($query, MYSQLI_ASSOC); 
    // Obtenemos la consulta de los buses y su última posición actual
    $sql = "SELECT u.id, u.IMEI, u.Nombre, up.Latitud, up.Longitud, up.Altitud, up.Fecha, up.Direccion, up.Velocidad, up.Pasajeros, up.Acumulado, u.PasajerosCredencial, u.PasajerosMax, up.BanderaRtc, up.Estatus, " .
           "IFNULL(e.bea, 0) bea, IFNULL(e.gps, 0) gps, IFNULL(e.sac, 0) sac, IFNULL(e.puerta1, 0) puerta1, IFNULL(e.puerta2, 0) puerta2, IFNULL(e.scom, 0) scom, IFNULL(up.fecha, e.Fecha) FechaComunicacion, now() FechaServidor " .
           "FROM " . $nombre . ".ultimasposiciones up LEFT JOIN " . $nombre . ".usuarios u ON up.UserId = u.id LEFT JOIN " . $nombre . ".estados e ON e.vehiculo = up.UserId " . 
           //"WHERE u.RutaID = " . $id . " AND u.Nombre  IN ('012') ORDER BY u.Nombre";
           "WHERE u.RutaID = " . $id . " ORDER BY u.Nombre";
    $query = mysqli_query($con, $sql); 
    $filas2 = mysqli_fetch_all($query, MYSQLI_ASSOC);  
    // Obtenemos los datos de los encierros
    $sql = "SELECT ID, Nombre, Latitud, Longitud, Tiempo, Radio " .
           "FROM " . $nombre . ".encierros WHERE Ruta = " . $id . " ORDER BY ID";
    $query = mysqli_query($con, $sql); 
    $filas3 = mysqli_fetch_all($query, MYSQLI_ASSOC);      
    // Obtenemos los datos de los max/min
    $sql = "SELECT min(PuntoX) as minx, max(PuntoX) as maxx, min(PuntoY) as miny, max(PuntoY) as maxy from " . $nombre . ".nodos_ruta nr where RutaID = " . $id;
    $query = mysqli_query($con, $sql); 
    $filas4 = mysqli_fetch_all($query, MYSQLI_ASSOC);      

    $nodos = [];
    $tramos = [];
    $i = 0;
 
    foreach($filas as $op): 
      $nodoIni =  new Nodo();
      $nodoIni->id = $op['ID1'];
      $nodoIni->nombre = $op['Nombre1'];
      $nodoIni->latitud = $op['Latitud1'];
      $nodoIni->longitud = $op['Longitud1'];
      $nodoIni->x = $op['PuntoX1'];
      $nodoIni->y = $op['PuntoY1'];
      $nodoIni->icono = $op['Icono1'];
      $nodoIni->orden = $op['Orden1'];
      $nodoIni->radio = $op['Radio1'];
      $nodoIni->velocidad = $op['Velocidad1'];
      $nodoIni->visible = $op['Visible1'];
      $nodos[$i] = $nodoIni;

      $tramo = new Tramo();
      $tramo->nodoIni = $nodoIni;
      $tramo->derrotero = $op['SubRuta'];
      if ($op['PuntoX2'] != -1) {
        $nodoFin =  new Nodo();
        $nodoFin->id = $op['ID2'];
        $nodoFin->nombre = $op['Nombre2'];
        $nodoFin->latitud = $op['Latitud2'];
        $nodoFin->longitud = $op['Longitud2'];
        $nodoFin->x = $op['PuntoX2'];
        $nodoFin->y = $op['PuntoY2'];
        $nodoFin->icono = $op['Icono2'];
        $nodoFin->orden = $op['Orden2'];
        $nodoFin->radio = $op['Radio2'];
        $nodoFin->velocidad = $op['Velocidad2'];
        $nodoFin->visible = $op['Visible2'];
        $tramo->nodoFin = $nodoFin;
      }
      $tramos[$i] = $tramo;
      $i++;
    endforeach;  
    
    $buses = [];
    $i = 0;
    foreach($filas2 as $op): 
      $bus =  new Vehiculo();
      $bus->nombre = $op['Nombre'];
      $bus->id = $op['id'];
      $bus->IMEI = $op['IMEI'];
      $bus->latitud = $op['Latitud'];
      $bus->longitud = $op['Longitud'];
      $bus->altitud = $op['Altitud'];
      $bus->velocidad = $op['Velocidad'];
      $bus->direccion = $op['Direccion'];
      $bus->pasajeros = $op['Pasajeros'];
      $bus->acumulado = $op['Acumulado']; 
      $bus->credenciales = $op['PasajerosCredencial']; 
      $bus->estatus = $op['Estatus']; 
      // El dato pasajeros se representa como el porcentaje que se lleva de la capacidad de pasajeros
      $iPercent = intval($op['PasajerosMax']);
      if ($iPercent > 0) {
        $iPercent = (intval($op["Pasajeros"]) * 100) / $iPercent;
      }
      if ($iPercent > 100) {
        $iPercent = 100;
      }
      $bus->pasajeros = strval($iPercent);
      $bus->banderaRTC = $op['BanderaRtc'];
      $bus->fecha = $op['Fecha'];
      $bus->bea = $op['bea']; 
      $bus->gps = $op['gps']; 
      $bus->sac = $op['sac']; 
      $bus->puerta1 = $op['puerta1']; 
      $bus->puerta2 = $op['puerta2']; 
      $bus->scom = $op['scom']; 
      $bus->fechaComunicacion = $op['FechaComunicacion']; 
      $bus->fechaServidor = $op['FechaServidor'];
      $f = $bus->fechaComunicacion;
      if (date('Y-m-d H:i:s', strtotime('+30 minutes', strtotime($f))) > $bus->fechaServidor) {
        $bus->conectado = 1;
      } else {
        $bus->conectado = 0;
      }
      $buses[$i] = $bus;
      $i++;
    endforeach; 

    $encierros = [];
    $i = 0;
    foreach($filas3 as $op): 
      $encierro =  new Encierro();
      $encierro->nombre = $op['Nombre'];
      $encierro->id = $op['ID'];
      $encierro->latitud = $op['Latitud'];
      $encierro->longitud = $op['Longitud'];
      $encierro->tiempo = $op['Tiempo'];
      $encierro->radio = $op['Radio'];      
      $encierros[$i] = $encierro;
      $i++;
    endforeach; 

    foreach($filas4 as $op): 
      $minX = $op['minx'];
      $maxX = $op['maxx'];
      $minY = $op['miny'];
      $maxY = $op['maxy'];
    endforeach; 
   
    // Cerramos la conexión
    mysqli_close($con);  

    $data = array();
    $data['nodos'] = $nodos;
    $data['tramos'] = $tramos;
    $data['vehiculos'] = $buses;
    $data['encierros'] = $encierros;
    $data['minx'] = $minX;
    $data['maxx'] = $maxX;
    $data['miny'] = $minY;
    $data['maxy'] = $maxY;
    echo json_encode($data);
  }
          
?>