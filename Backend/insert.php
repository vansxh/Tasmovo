<?php
/*require ('connect.php');

$postdata = file_get_contents("php://input");

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);
    

    $fName = mysqli_real_escape_string($con, trim($request->fName));
    $lName = mysqli_real_escape_string($con, trim($request->lName));
    $email = mysqli_real_escape_string($con, $request->email);

    $sql = "INSERT INTO students (fName,lName,email) VALUES('$fName','$lName','$email')";

    if (mysqli_query($con, $sql)) {
        http_response_code(201);
    } else {
        http_response_code(422);      
    }
}*/
require('config.inc.php');
$postdata = file_get_contents("php://input");

$students = new Students();

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $fName = htmlspecialchars($request->{'fName'});
    $lName = htmlspecialchars($request->{'lName'});
    $email = htmlspecialchars($request->{'email'});

    if (!empty($fName) || !empty($lName) || !empty($email)) {
        try {
            $students->insert($fName, $lName, $email);
            http_response_code(201);
        } catch (PDOException $e) {
            echo ("Fehler aufgetreten");
            http_response_code(422);
        }
    }
}
