<?php
require('../../config.inc.php');
$userID = $_GET['userID'];

$task = new Task();

if (!empty($userID)) {
    try {
        echo($task->getNextTasks($userID));
    } catch (PDOException $e) {
        echo("Fehler aufgetreten");
        http_response_code(404);
    }
}


