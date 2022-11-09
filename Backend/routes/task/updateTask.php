<?php
require('../../config.inc.php');
$postdata = file_get_contents("php://input");

$task = new Task();

if (isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    if (isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata);

        $TAID = htmlspecialchars($request->{'TAID'});
        $tName = htmlspecialchars($request->{'task_name'});
        $notes = htmlspecialchars($request->{'notes'});
        $deadline = htmlspecialchars($request->{'deadlineDay'}) . " " . htmlspecialchars($request->{'deadlineHour'});
        /*$gid = htmlspecialchars($request->{'groupID'});
        $caid = htmlspecialchars($request->{'categoryID'});*/

        $gotTask = json_decode($task->getTask($TAID));

        if (!empty($tName) && !empty($deadline) && $gotTask->{'created_by'} === $_SESSION['UID']) {
            try {
                if ($task->updateTask($TAID, $tName, $notes, $deadline/*, $createdby, $gid, $caid*/)) {
                    echo(json_encode("done"));
                    http_response_code(201);
                } else http_response_code(422);
            } catch (PDOException $e) {
                http_response_code(422);
            }
        }
    }
}
