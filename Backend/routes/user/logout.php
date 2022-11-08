<?php

require('../../config.inc.php');

$postdata = file_get_contents("php://input");
//print_r($postdata);
//print_r($_SESSION);
//print_r($_SESSION['UID']);



if (isset($postdata) && !empty($postdata) && $_SESSION['loggedIn'] === true && isset($_SESSION['UID'])) {
    unset($_SESSION['loggedIn']);
    unset($_SESSION['UID']);
    $message = json_encode("Erfolgreich abgemeldet");
    echo($message);
}else{
    //echo($_SESSION['loggedIn']);
    //echo($_SESSION['UID']);
    echo("Fehler aufgetreten");
}