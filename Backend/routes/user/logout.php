<?php
//Required file
require('../../bootstrap.inc.php');

//Check if Input is empty
if (Input::isEmpty()) {
    (new Response([
        'error' => true,
        'message' => 'Input is empty.'
    ]))->send(HttpCode::BAD_REQUEST);
}

$auth->check(); // check() statt loggedIn()

//Unset the session and send a response
unset($_SESSION['loggedIn']);

(new Response([
    'error' => false,
    'message' => 'Logout successful.'
]))->send(HttpCode::OKAY);
