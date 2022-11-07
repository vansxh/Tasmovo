<?php
require('../../config.inc.php');
$userID = $_GET['userID'];

$task = new Task();

if (!empty($userID)) {
    try {
        echo($task->getNextTasks($userID));
    } catch (PDOException $e) {
        http_response_code(404);
    }
}
//$result = $task->getNextTasks(1);
//echo($result);
//$json = json_encode($result);
//echo($result);


