<?php
require('../../config.inc.php');
$postdata = file_get_contents("php://input");

$task = new Task();

if(isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    if (isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata);

        $TAID = htmlspecialchars($request->{'TAID'});

        if (!empty($TAID)) {
            try {
                if($task->finishTask($TAID)) {
                    echo(json_encode("done"));
                    http_response_code(201);
                } else http_response_code(422);
            } catch (PDOException $e) {
                http_response_code(422);
            }
        }
    }
}
