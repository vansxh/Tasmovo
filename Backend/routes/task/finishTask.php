<?php
require('../../config.inc.php');
$postdata = file_get_contents("php://input");

$task = new Task();

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $TAID = $_GET['TAID'];

    if (!empty($TAID)) {
        try {
        $task->finishTask($TAID);
            http_response_code(201);
        } catch (PDOException $e) {
            echo ("Fehler aufgetreten");
            http_response_code(422);
        }
    }
}
