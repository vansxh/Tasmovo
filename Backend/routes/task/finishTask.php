<?php
require('../../config.inc.php');
$postdata = file_get_contents("php://input");

$task = new Task();

if(isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    if (isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata);

        $TAID = htmlspecialchars($request->{'TAID'});
        
        $gotTask = json_decode($task->getTask($TAID));

        if (!empty($TAID) && $gotTask->{'created_by'} === $_SESSION['UID']) {
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
