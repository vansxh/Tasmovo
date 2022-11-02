<?php
require('../../config.inc.php');
$userID = $_GET['userID'];

$task = new Task();

try {
    echo($task->getFinishedTasks($userID));
} catch (PDOException $e) {
    echo("Fehler aufgetreten");
    http_response_code(404);
}


