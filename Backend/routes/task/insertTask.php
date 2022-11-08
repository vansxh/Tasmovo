<?php
require('../../config.inc.php');
$postdata = file_get_contents("php://input");

$task = new Task();

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $tName = htmlspecialchars($request->{'task'}->{'task_name'});
    $notes = htmlspecialchars($request->{'task'}->{'notes'});
    $deadline = htmlspecialchars($request->{'task'}->{'deadlineDay'})." ".htmlspecialchars($request->{'task'}->{'deadlineHour'});
    $created_by = htmlspecialchars($request->{'created_by'});
    /*$gid = htmlspecialchars($request->{'groupID'});
    $caid = htmlspecialchars($request->{'categoryID'});*/

    if (!empty($tName) && !empty($deadline)) {
        try {
            if($task->insertTask($tName, $notes, $deadline, $created_by/*, $gid, $caid*/)) {
                echo(json_encode("done"));
                http_response_code(201);
            } else http_response_code(422);
        } catch (PDOException $e) {
            http_response_code(422);
        }
    }
}
