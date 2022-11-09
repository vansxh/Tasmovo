<?php
require('../../config.inc.php');
$TAID = $_GET['TAID'];

$task = new Task();

if (isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    if (!empty($TAID)) {
        try {
            $gotTask = $task->getTask($TAID);
            if ($gotTask['created_by'] === $_SESSION['UID']) echo(json_encode($gotTask));
            else echo(json_encode('falscher Benutzer'));
        } catch (PDOException $e) {
            http_response_code(404);
        }
    }
}


