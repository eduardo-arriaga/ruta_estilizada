<?php
  require_once './con_db.php'; //libreria de conexion a la base
 
  $grupo_id = filter_input(INPUT_POST, 'grupo_id'); //obtenemos el parametro que viene de ajax
  $nombre = filter_input(INPUT_POST, 'nombre'); //obtenemos el parametro que viene de ajax
 
  if($grupo_id != '') { //verificamos nuevamente que sea una opcion valida
    $con = conDb();
    if(!$con) {
      die("<br/>Sin conexi&oacute;n.");
    }
  
    $sql = "SELECT ID, Nombre FROM " . $nombre . ".rutas ORDER BY Nombre" ;  
    $query = mysqli_query($con, $sql);
    $filas = mysqli_fetch_all($query, MYSQLI_ASSOC); 
    mysqli_close($con);    
  }
?>
 
<?php foreach($filas as $op): //creamos las opciones a partir de los datos obtenidos ?>
<option value="<?= $op['ID'] ?>"><?= $op['Nombre'] ?></option>
<?php endforeach; ?>