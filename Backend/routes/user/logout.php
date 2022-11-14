<?php
//Required file
require('../../bootstrap.inc.php');

//Get the input
Input::init();

//Check if Input is empty
if (Input::isEmpty()) die();

//Check if user is logged in
if ($_SESSION['loggedIn']) {
    unset($_SESSION['loggedIn']);

    (new Response([
        'error' => false,
        'message' => 'Logout successful.'
    ]))->send(HttpCode::OKAY);
} else {
    (new Response([
        'error' => true,
        'message' => 'Logout failed.'
    ]))->send(HttpCode::BAD_REQUEST);
}