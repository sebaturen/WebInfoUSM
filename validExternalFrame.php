<?php

//CREDITOS! http://stackoverflow.com/questions/21263418/detect-x-frame-options
//Analizaz la cabezara en busca de si puede hacerse un iframe.

$error=false;
$urlhere=$_GET['url'];
$ch = curl_init();

$options = array(
        CURLOPT_URL            => $urlhere,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HEADER         => true,
        CURLOPT_FOLLOWLOCATION => true,
        CURLOPT_ENCODING       => "",
        CURLOPT_AUTOREFERER    => true,
        CURLOPT_CONNECTTIMEOUT => 120,
        CURLOPT_TIMEOUT        => 120,
        CURLOPT_MAXREDIRS      => 10,
);
curl_setopt_array($ch, $options);
$response = curl_exec($ch);
$httpCode = curl_getinfo($ch);
$headers=substr($response, 0, $httpCode['header_size']);
if(strpos($headers, 'X-Frame-Options: deny')>-1||strpos($headers, 'X-Frame-Options: SAMEORIGIN')>-1) {
        $error=true;
}
$httpcode= curl_getinfo($ch, CURLINFO_HTTP_CODE);
curl_close($ch);
echo json_encode(array('httpcode'=>$httpcode, 'error'=>$error));

?>
