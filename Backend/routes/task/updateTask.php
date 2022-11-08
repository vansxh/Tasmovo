<?php
require('../../config.inc.php');
$postdata = file_get_contents("php://input");

$task = new Task();

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $TAID = htmlspecialchars($request->{'task'}->{'TAID'});
    $tName = htmlspecialchars($request->{'task'}->{'task_name'});
    $notes = htmlspecialchars($request->{'task'}->{'notes'});
    $deadline = htmlspecialchars($request->{'task'}->{'deadlineDay'})." ".htmlspecialchars($request->{'task'}->{'deadlineHour'});
    $createdby = htmlspecialchars($request->{'task'}->{'created_by'});
    $loggedIn = htmlspecialchars($request->{'loggedIn'});
    /*$gid = htmlspecialchars($request->{'groupID'});
    $caid = htmlspecialchars($request->{'categoryID'});*/

    if (!empty($tName) && !empty($deadline) && $createdby === $loggedIn) {
        try {
            if($task->updateTask($TAID, $tName, $notes, $deadline/*, $createdby, $gid, $caid*/)){
                echo(json_encode("done"));
                http_response_code(201);
            } else http_response_code(422);
        } catch (PDOException $e) {
            http_response_code(422);
        }
    }
}
