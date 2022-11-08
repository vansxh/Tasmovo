<?php
require('../../config.inc.php');
$TAID = $_GET['TAID'];

$task = new Task();

if (!empty($TAID)) {
    try {
        $gotTask = $task->getTask($TAID);
        $decodedTask = json_decode($gotTask);
        print_r($_SESSION);
        if($decodedTask->{'created_by'} === $_SESSION['UID']) echo($gotTask);
        else echo('falscher Benutzer');
    } catch (PDOException $e) {
        http_response_code(404);
    }
}


