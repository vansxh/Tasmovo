<?php
require('../../config.inc.php');
$TAID = $_GET['TAID'];

$task = new Task();

if (!empty($TAID)) {
    try {
        echo($task->getTask($TAID));
    } catch (PDOException $e) {
        http_response_code(404);
    }
}


