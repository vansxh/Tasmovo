<?php
require('../../config.inc.php');
$postdata = file_get_contents("php://input");

$task = new Task();

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    print_r($postdata);

    $tName = htmlspecialchars($request->{'taskName'});
    $notes = htmlspecialchars($request->{'notes'});
    $deadline = htmlspecialchars($request->{'deadline'});
    /*$createdby = htmlspecialchars($request->{'createdby'});
    $gid = htmlspecialchars($request->{'groupID'});
    $caid = htmlspecialchars($request->{'categoryID'});*/

    if (!empty($tName) && !empty($deadline)) {
        try {
        $task->insertTask($tName, $notes, $deadline/*, $createdby, $gid, $caid*/);
            http_response_code(201);
        } catch (PDOException $e) {
            echo ("Fehler aufgetreten");
            http_response_code(422);
        }
    }
}
