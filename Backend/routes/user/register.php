<?php

require('../../bootstrap.inc.php');

//$auth = new Auth();
$postdata = file_get_contents("php://input");


if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $uid = $request->{'UID'};
    $firstname = htmlspecialchars($request->{'firstName'});
    $lastname = htmlspecialchars($request->{'lastName'});
    $username = htmlspecialchars($request->{'username'});
    $password = htmlspecialchars($request->{'password'});
    $passwordHash = password_hash($password, PASSWORD_DEFAULT);
    $mail = htmlspecialchars($request->{'mail'});
    //$usernameORmail = htmlspecialchars($request->{'usernameORmail'});
    //$password = htmlspecialchars($request->{'password'});

    if (!empty($uid) && !empty($firstname) && !empty($lastname) && !empty($username) && !empty($password) && !empty($mail)) {
        try {
            $register = $auth->register($uid, $firstname, $lastname, $username, $passwordHash, $mail);
            if ($register) {
                $authdata = [
                    'UID' => $uid,
                    'firstName' => $firstname,
                    'lastName' => $lastname,
                    'username' => $username,
                    'password' => '',
                    'mail' => $mail
                ];
                //print_r($authdata);
                echo json_encode($authdata);
                http_response_code(201);
            } else {
                echo("Fehler aufgetreten");
                http_response_code(422);
            }
        } catch (PDOException $e) {
            echo("Fehler aufgetreten");
            http_response_code(422);
        }
    }
    //print_r($request);
}
