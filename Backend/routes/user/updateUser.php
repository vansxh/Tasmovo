<?php
//Required file
require('../../bootstrap.inc.php');

//Check if Input is empty
if (Input::isEmpty()) {
    (new Response([
        'error' => true,
        'message' => 'Eingabefelder sind leer.'
    ]))->send(HttpCode::BAD_REQUEST);
}

//Check if user is logged in
$auth->check();

if ($auth->updateUser(Input::read('firstName'), Input::read('lastName'), Input::read('username'), Input::read('stressLimit'))) {
    (new Response([
        'error' => false,
        'message' => 'User erfolgreich geupdated.'
    ]))->send(HttpCode::OKAY);
} else {
    (new Response([
        'error' => true,
        'message' => 'Update fehlgeschlagen.'
    ]))->send(HttpCode::BAD_REQUEST);
}