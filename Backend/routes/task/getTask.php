<?php
require('../../config.inc.php');
$TAID = $_GET['TAID'];

$task = new Task();

if(isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    if (!empty($TAID)) {
        try {
            $gotTask = $task->getTask($TAID);
            $decodedTask = json_decode($gotTask);
            if($decodedTask->{'created_by'} === $_SESSION['UID']) echo($gotTask);
            else echo(json_encode('falscher Benutzer'));
        } catch (PDOException $e) {
            http_response_code(404);
        }
    }
}


