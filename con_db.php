
<?php

function conDb()
{
  $con = mysqli_connect('192.237.227.188', 'ds_tochoa', 'Tf47Lw#1', 'vueltas_fenix');
  
  if(!$con){
    print_r(mysqli_connect_error());
    return false;
  }else{
    $con->set_charset("utf8");
    return $con;
  }
}
?>

 
