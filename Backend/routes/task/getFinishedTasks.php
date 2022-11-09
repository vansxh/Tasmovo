<?php
require('../../bootstrap.inc.php');

$task = new Task();

if (isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    try {
        echo($task->getFinishedTasks($_SESSION['UID']));
    } catch (PDOException $e) {
        http_response_code(404);
    }
}


