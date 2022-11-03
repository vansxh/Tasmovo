<?php
require('../../config.inc.php');
$TAID = $_GET['TAID'];

$task = new Task();

if (!empty($TAID)) {
    try {
        $task->deleteTask($TAID);
        echo("done");
        http_response_code(204);
    } catch (PDOException $e) {
        http_response_code(422);
    }
}
