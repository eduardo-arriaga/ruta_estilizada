<?php 
      class User
       {
          public $nombre;
          public $activo = 0;
          public $permisos;
          public $aplicaciones;
      }
        require_once './con_db.php'; //libreria de conexion a la base
        $paramId = $_POST['id'];

        /*Abrimos la conexión a la bd*/
         $con = conDb();
            if(!$con) {
              die("<br/>Sin conexi&oacute;n.");
            }
        $sql = "SELECT Nombre, Activado, Permisos, Aplicaciones FROM beaonline.clientes WHERE id = $paramId ORDER BY nombre";
        $query = mysqli_query($con, $sql);
        $row = mysqli_fetch_array ( $query, MYSQLI_ASSOC );
        $user = new User();
        if ($row) {
          $user->nombre = $row["Nombre"];
          $user->activo = $row["Activado"];
          $user->permisos = $row["Permisos"];
          $user->aplicaciones = $row["Aplicaciones"];
        } 
          if ($user->activo == 0) {
            //Aquí se reenvía a página de error indicando que el usuario no está activo
          } else {
            // Se revisa que el usuario tenga permisos para usar la ruta estilizada
            if (boolval($user->aplicaciones & 0x01) == false) {
              //Aquí se reenvía a página de error indicando que el usuario no tiene permisos para la ruta estilizada
            } 
          }
          switch($user->permisos) {
            case 15: // Administrador
              $sql = "SELECT id, nombre FROM beaonline.grupos WHERE id > 0 ORDER BY nombre";
            break;
            case 4: // Supervisor
              $sql = "SELECT beaonline.grupos.id, beaonline.grupos.nombre FROM beaonline.asignaciones INNER JOIN beaonline.grupos ON beaonline.asignaciones.grupo = beaonline.grupos.id WHERE beaonline.asignaciones.clientid = $paramId ORDER BY beaonline.grupos.nombre";
            break;
            default: // Cliente
            $sql = "SELECT id, nombre FROM beaonline.grupos WHERE nombre = (SELECT grupo FROM beaonline.clientes WHERE id = $paramId) ORDER BY nombre";
            break;
          }
            /*obtenemos los datos del primer select (grupos)*/  
            $query = mysqli_query($con, $sql);
            $filas = mysqli_fetch_all($query, MYSQLI_ASSOC); 
            if (count($filas) > 0) {
              /*obtenemos los datos del primer select (rutas)*/
              $sql = "SELECT ID, Nombre FROM " . $filas[0]['nombre']  . ".rutas ORDER BY Nombre";
              $query = mysqli_query($con, $sql);
              $rutas = mysqli_fetch_all($query, MYSQLI_ASSOC);
              if (count($rutas) > 0) {
                /*obtenemos los datos de los nodos de la ruta seleccionada*/
                $sql = "SELECT * FROM " . $filas[0]['nombre'] . ".nodos_ruta WHERE RutaID = " . $rutas[0]['ID'];
                $query = mysqli_query($con, $sql);
                $nodos = mysqli_fetch_all($query, MYSQLI_ASSOC);
              }
            }
            /*Cerramos la conexión*/
            mysqli_close($con);
?>
<!DOCTYPE html>
<html>
  <head>    
    <meta charset="utf-8">
    <title>Ruta Estilizada</title>
    <link rel="icon" href="descarga.png">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/css/bootstrap.min.css" integrity="sha384-Vkoo8x4CGsO3+Hhxv8T/Q5PaXtkKtu6ug5TOeNV6gBiFeWPGFN9MuhOf23Q9Ifjh" crossorigin="anonymous">    
    <link href="index.css" rel="stylesheet" type="text/css">
    <script type="text/javascript" src="http://code.jquery.com/jquery-3.5.1.min.js"></script> 
    <script src="graph.js"></script>
    <script src="nodo.js"></script>
    <script src="tramo.js"></script>
    <script src="estado.js"></script>
    <script src="encierro.js"></script>
    <script src="vehiculo.js"></script>
    <script src="rutaestilizada.js"></script>
    <script type="text/javascript"></script>      
    <script src="index.js"></script>   
   </head>
  <body style="background-color: #FFFFFF;" >
    <header class="page-header pt-1 fixed-top" style="background-color: #FFFFFF;">
    <section id="oculta">
      <div class="jumbotron text-center hoverable p-1" style="background-color: #FFFFFF;">
        <div class="row">
          <div class="col-md-1 offset-md-1 mx-1 my-1"> 
            <div class="">
              <img src="descarga.png" width="30" height="30" >
            </div>
          </div> 
          <div class="col-md-5 text-md-left ml-1 mt-1">  
            <h1 class="h3 mb-1" style="width: 200px;">Bea Web Suite</h>
            <h6 class="h6 mb-1">Bienvenid@ <?php echo $user->nombre;  ?></h6>
          </div>
        </div>

        <div class="p-1 mb-1 " style="background-color: orange;"></div>
      </div>
      <div  class="d-flex justify-content-center">
        <div class="row">
          <a id="inicio" href="http://monitoreatubus.com" class="btn btn-info" role="button" style="position:absolute; top:10px; left:800px; background-color: orange;">Inicio</a>
          <div class="col-sm text-md-right">
            <label for="grupos">Grupo:</label>
          </div>
          <div class="col-sm">
            <select class="form-control" id="grupos" style="width:auto;">     
              <?php foreach ($filas as $op):  ?>
                <option value="<?= $op['id'] ?>"><?= $op['nombre'] ?></option>  
              <?php endforeach; ?>
            </select>
          </div>
          <div class="col-sm text-md-right">
            <label for="rutas">Ruta:</label>
          </div>
          <div class="col-sm">
            <select class="form-control" id="rutas" style="width:auto;">
              <?php foreach ($rutas as $op):  ?>
                <option value="<?= $op['ID'] ?>"><?= $op['Nombre'] ?></option>
              <?php endforeach; ?>
            </select> 
          </div>
          <button id="mostrar" class="btn btn-primary">Mostrar</button>
        </div>                            
      </div></section>
     <br>
      </div>
      <div id='todo'>
    <div class="topnav">
      <div class="search-container">
            <div  class="d-flex">
                  <input class="form-control" id="txtBuscar" placeholder="Autobús a buscar" style="width: 200px; margin-top:5px; margin-left:5px">
                  <button id="buscar"  class="btn btn-light" style="margin-left: 15px; margin-top:5px;"><i class="fa fa-search"></i></button>
                  <button id="borrar"  class="btn btn-light" style="margin-top:5px;"><i class="fa fa-trash-o"></i></button>  
                  <button  class="btn btn-light" id="mano" style="margin-top:5px;"><i class="fa fa-hand-paper-o"></i></button>
                  <button class="btn btn-light" id="zoomin" style="margin-top:5px;"><i class="fa fa-search-plus"></i></button>  
                  <button  class="btn btn-light" id="zoomount" style="margin-top:5px;"><i class="fa  fa-search-minus"></i></button>  
                  <button  class="btn btn-light" id="regresar" style="margin-top:5px;">1:1</button>  
                  <button class="btn btn-light" id="puntero" style="margin-top:5px;"><i class="fa fa-mouse-pointer"></i></button>
                  <button class="btn btn-light" id="hide" style="margin-top:5px;"><i id="eye" class="fa fa-eye-slash"></i></button>
                  <button  class="btn btn-light" id="expandir" style="margin-top:5px; margin-left: 500px;"><i class="fa fa-expand"></i></button>             
            </div>
     </div>
 <br><br>
    </header>
    <section>
      <div  class="d-flex justify-content-center" id='expande'>
            <div  id='canvas1' style="position:absolute; top:70px; left:10px; width:100%;" >
              <canvas  id="linea1"  class="d-flex justify-content-center" width="100%" height="800">Navegador no soporta canvas :( </canvas>
            </div>
            <div  id='canvas2' style="position:absolute; top:70px; left:10px; width:100%;">
              <canvas id="linea2"  class="d-flex justify-content-center" width="100%" height="800">Navegador no soporta canvas :( </canvas>
            </div>
            <div id="iDatosBus" class = "info" style="position:absolute; top:0px; left:0px; display: none;"> 
            </div> 
      </div>
      </div>
      <section>
    </div>
</div>


    <!-- Footer -->
    <footer class="page-footer font-small blue pt-1 fixed-bottom" id="foo"  style="margin-top: 70px;">
      <div class="container" id="global">
        <div class="row row-cols-4">
          <div class="punteado" id="global" name = "divEncierro">
            <canvas id="Encierro" width="200" height="600">Navegador no soporta canvas :( </canvas>
          </div>
          <div class="punteado" id="global" name = "divFueraRuta">
            <canvas id="FueraRuta" width="200" height="600">Navegador no soporta canvas :( </canvas>
          </div>
          <div class="punteado" id="global" name = "divMantenimiento">
            <canvas id="Mantenimiento" width="200" height="600">Navegador no soporta canvas :( </canvas>
          </div>
          <div class="punteado" id="global" name = "divExceso">
            <canvas id="Exceso" width="200" height="600">Navegador no soporta canvas :( </canvas>
          </div>
          <div class="punteado" id="global" name = "divBloqueos">
            <canvas id="Bloqueos" width="200" height="600">Navegador no soporta canvas :( </canvas>
          </div>    
          <div class="punteado" id="global">
            <canvas id="Estatus" width="200" height="600">Navegador no soporta canvas :( </canvas>
          </div>
          <div class="punteado" id="global" name = "divSinCom">
            <canvas id="SinCom" width="200" height="600">Navegador no soporta canvas :( </canvas>
          </div>
          <div id="iDatosBusFueraRuta" class = "info" style="position:absolute; top:0px; left:0px; display: none;"> 
          </div>   
          <div id="iDatosBusEncierro" class = "info" style="position:absolute; top:0px; left:0px; display: none;"> 
          </div>  
          <div id="iDatosBusMantenimiento" class = "info" style="position:absolute; top:0px; left:0px; display: none;"> 
          </div>  
          <div id="iDatosBusExceso" class = "info" style="position:absolute; top:0px; left:0px; display: none;"> 
          </div>  
          <div id="iDatosBusBloqueos" class = "info" style="position:absolute; top:0px; left:0px; display: none;"> 
          </div>  
          <div id="iDatosBusSinCom" class = "info" style="position:absolute; top:0px; left:0px; display: none;"> 
          </div>  
        </div>
      </div>    
      <div class="p-1 mb-0 bg-primary text-white">   
        <div class="footer-copyright text-center py-1">  COPYRIGHT  SISTEMA BEA V2.0 | DESARROLLO DE SOFTWARE |  |   
        </div>
      </div>
    </footer>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.16.0/dist/umd/popper.min.js" integrity="sha384-Q6E9RHvbIyZFJoft+2mJbHaEWldlvI9IOYy5n3zV9zzTtmI3UksdQRVvoxMfooAo" crossorigin="anonymous"></script>
    <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.4.1/js/bootstrap.min.js" integrity="sha384-wfSDF2E50Y2D1uUdj0O3uMBJnjuUD4Ih7YwaYd1iqfktj0Uod8GCExl3Og8ifwB6" crossorigin="anonymous"></script>
  </body>  
</html>

