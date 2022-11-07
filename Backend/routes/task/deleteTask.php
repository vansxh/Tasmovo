<?php
require('../../config.inc.php');
$TAID = $_GET['TAID'];

$task = new Task();

if (!empty($TAID)) {
    try {
        if($task->deleteTask($TAID)) {
            echo(json_encode("done"));
            http_response_code(202);
        } else http_response_code(422);
    } catch (PDOException $e) {
        http_response_code(422);
    }
}
