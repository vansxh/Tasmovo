<?php
require('../../config.inc.php');
$postdata = file_get_contents("php://input");

$task = new Task();

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $TAID = htmlspecialchars($request->{'TAID'});
    $tName = htmlspecialchars($request->{'task_name'});
    $notes = htmlspecialchars($request->{'notes'});
    $deadline = htmlspecialchars($request->{'deadlineDay'})." ".htmlspecialchars($request->{'deadlineHour'});
    /*$createdby = htmlspecialchars($request->{'createdby'});
    $gid = htmlspecialchars($request->{'groupID'});
    $caid = htmlspecialchars($request->{'categoryID'});*/

    if (!empty($tName) && !empty($deadline)) {
        try {
            $task->updateTask($TAID, $tName, $notes, $deadline/*, $createdby, $gid, $caid*/);
            echo(json_encode("done"));
            http_response_code(201);
        } catch (PDOException $e) {
            http_response_code(422);
        }
    }
}
