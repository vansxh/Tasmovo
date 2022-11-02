<?php
require('../../config.inc.php');
$TAID = $_GET['TAID'];

$task = new Task();

if (!empty($TAID)) {
    try {
        echo($task->getTask($TAID));
    } catch (PDOException $e) {
        echo("Fehler aufgetreten");
        http_response_code(404);
    }
}


