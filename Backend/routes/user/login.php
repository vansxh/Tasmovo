<?php

require('../../bootstrap.inc.php');

//$auth = new Auth();
$postdata = file_get_contents("php://input");


if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    //print_r($request);

    $usernameORmail = htmlspecialchars($request->{'username'});
    $password = htmlspecialchars($request->{'password'});

    if (!empty($usernameORmail) && !empty($password)) {
        $canAccess = $auth->login($usernameORmail, $password);
        $result = $auth->getUserID($usernameORmail);
        $json = json_decode($result);

        if ($canAccess) {
            $_SESSION['loggedIn'] = true;
            $_SESSION['UID'] = $json->{'UID'};
            //print_r($_SESSION);
            //print_r($json->{'UID'});
            echo($auth->getUserID($usernameORmail));
        } else {
            unset($_SESSION['loggedIn']);
            echo("Fehler aufgetreten");
        }
    }
}