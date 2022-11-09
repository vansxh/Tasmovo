<?php
require('../../config.inc.php');
$TAID = $_GET['TAID'];

$task = new Task();

if (isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    if (!empty($TAID)) {
        $gotTask = json_decode($task->getTask($TAID));
        if ($gotTask->{'created_by'} === $_SESSION['UID']) {
            try {
                if ($task->deleteTask($TAID)) {
                    echo(json_encode("done"));
                    http_response_code(202);
                } else http_response_code(422);
            } catch (PDOException $e) {
                http_response_code(422);
            }
        }
    }
}
