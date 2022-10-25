<?php
require('config.inc.php');
$postdata = file_get_contents("php://input");

$task = new Task();

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $tName = htmlspecialchars($request->{'tName'});
    $notes = htmlspecialchars($request->{'notes'});
    $deadline = htmlspecialchars($request->{'deadline'});
    $createdby = htmlspecialchars($request->{'createdby'});
    $gid = htmlspecialchars($request->{'gid'});
    $caid = htmlspecialchars($request->{'caid'});

    if (!empty($tName) && !empty($notes) && !empty($deadline) && !empty($createdby) && !empty($gid) && !empty($caid)) {
        try {
            $students->insert($tName, $notes, $deadline, $createdby, $gid, $caid);
            http_response_code(201);
        } catch (PDOException $e) {
            echo ("Fehler aufgetreten");
            http_response_code(422);
        }
    }
}
