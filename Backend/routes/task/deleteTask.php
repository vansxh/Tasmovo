<?php
require('../../config.inc.php');
$TAID = $_GET['TAID'];

$task = new Task();

if (!empty($TAID)) {
    try {
        $task->deleteTask($TAID);
        http_response_code(204);
    } catch (PDOException $e) {
        echo("Fehler aufgetreten");
        http_response_code(422);
    }
}
