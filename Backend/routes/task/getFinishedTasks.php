<?php
require('../../config.inc.php');
$userID = $_GET['userID'];

$task = new Task();

if (!empty($userID)) {
    try {
        echo($task->getFinishedTasks(1));
    } catch (PDOException $e) {
        http_response_code(404);
    }
}


