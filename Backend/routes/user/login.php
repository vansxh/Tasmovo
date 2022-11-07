<?php
session_start();

require('../../config.inc.php');

$auth = new Auth();
$postdata = file_get_contents("php://input");



if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    //print_r($request);

    $usernameORmail = htmlspecialchars($request->{'username'});
    $password = htmlspecialchars($request->{'password'});

    if(!empty($usernameORmail) && !empty($password)){
            $canAccess = $auth->login($usernameORmail, $password);

            if($canAccess){
                $_SESSION['loggedIn'] = true;
                echo ($auth->getUserID($usernameORmail));            
            }else{
                unset($_SESSION['loggedIn']);
                echo("Fehler aufgetreten"); 
            }
    }
}