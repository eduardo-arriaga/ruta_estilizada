<?php
  require_once './con_db.php'; //libreria de conexion a la base
  
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
 
  $nombre = filter_input(INPUT_POST, 'nombre');//obtenemos el parametro que viene de ajax
  $id = filter_input(INPUT_POST, 'id');

  if($id > 0) {
    $con = conDb();
    if(!$con) {
      die("<br/>Sin conexi&oacute;n.");
    }
    $vis=1;
    // Obtenemos la consulta de los buses y su última posición actual
    $sql = "SELECT u.id, u.IMEI, u.Nombre, up.Latitud, up.Longitud, up.Altitud, up.Fecha, up.Direccion, up.Velocidad, up.Pasajeros, up.Acumulado, u.PasajerosCredencial, u.PasajerosMax, up.BanderaRtc, up.Estatus, " .
           "IFNULL(e.bea, 0) bea, IFNULL(e.gps, 0) gps, IFNULL(e.sac, 0) sac, IFNULL(e.puerta1, 0) puerta1, IFNULL(e.puerta2, 0) puerta2, IFNULL(e.scom, 0) scom, IFNULL(up.fecha, e.Fecha) FechaComunicacion, now() FechaServidor " .
           "FROM " . $nombre . ".ultimasposiciones up LEFT JOIN " . $nombre . ".usuarios u ON up.UserId = u.id LEFT JOIN " . $nombre . ".estados e ON e.vehiculo = up.UserId " . 
           //"WHERE u.RutaID = " . $id . " AND u.Nombre IN ('012') ORDER BY u.Nombre";
           "WHERE u.RutaID = " . $id . " ORDER BY u.Nombre";
    $query = mysqli_query($con, $sql); 
    $filas = mysqli_fetch_all($query, MYSQLI_ASSOC);       
    $buses = [];
    $i = 0;      
 
    foreach($filas as $op): 
      $bus =  new Vehiculo();
      $bus->nombre = $op['Nombre'];
      $bus->id = $op['id'];
      $bus->IMEI = $op['IMEI'];
      $bus->latitud = $op['Latitud'];
      $bus->longitud = $op['Longitud'];
      $bus->altitud = $op['Altitud'];
      $bus->velocidad = $op['Velocidad'];
      $bus->direccion = $op['Direccion'];
      
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
      $bus->bea = $op['bea'];   
      $buses[$i] = $bus;
      $i++;
    endforeach; 
   
    // Cerramos la conexión
    mysqli_close($con);  

    $data = array();
    $data['vehiculos'] = $buses;
    echo json_encode($data);
  }
          
?>