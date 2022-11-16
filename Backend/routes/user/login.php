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

//Check if login is allowed
if ($auth->login(Input::read('username'), Input::read('password'))) {
    $result = $auth->getUserID(Input::read('username'));

    $_SESSION['UID'] = $result['UID'];

    (new Response([
        'message' => 'Erfolgreich eingeloggt.',
        'data' => $result
    ]))->send(HttpCode::OKAY);

} else {
    unset($_SESSION['UID']);

    (new Response([
        'error' => true,
        'message' => 'Username oder Passwort ist falsch.',
    ]))->send(HttpCode::BAD_REQUEST);
}