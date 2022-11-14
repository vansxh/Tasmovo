<?php
//Required file
require('../../bootstrap.inc.php');

//Get the input
Input::init();

//Check if Input is empty
if (Input::isEmpty()) die();

//Check if login is allowed
if ($auth->login(Input::read('username'), Input::read('password'))) {
    $result = $auth->getUserID(Input::read('username'));

    $_SESSION['loggedIn'] = true;
    $_SESSION['UID'] = $result['UID'];

    (new Response([
        'message' => 'Login successful.',
        'data' => $result
    ]))->send(HttpCode::OKAY);

} else {
    unset($_SESSION['loggedIn']);

    (new Response([
        'error' => true,
        'message' => 'Login failed.',
    ]))->send(HttpCode::BAD_REQUEST);
}