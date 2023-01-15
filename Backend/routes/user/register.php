<?php
/**
 * @var Auth $auth
 */
//Required file
require('../../bootstrap.inc.php');

//Check if Input is empty
if (Input::isEmpty()) {
    (new Response([
        'error' => true,
        'message' => 'Eingabefelder sind leer.'
    ]))->send(HttpCode::BAD_REQUEST);
}

if ($auth->register(Input::read('UID'), Input::read('firstName'), Input::read('lastName'), Input::read('username'), password_hash(Input::read('password'), PASSWORD_DEFAULT), Input::read('mail'))) {
    (new Response([
        'error' => false,
        'message' => 'Erfolgreich registriert.',
        'data' => [
            'UID' => Input::read('UID'),
            'firstName' => Input::read('firstName'),
            'lastName' => Input::read('lastName'),
            'username' => Input::read('username'),
            'password' => '',
            'mail' => Input::read('mail')
        ]
    ]))->send(HttpCode::OKAY);
} else {
    (new Response([
        'error' => true,
        'message' => 'Registrieren fehlgeschlagen.'
    ]))->send(HttpCode::BAD_REQUEST);
}
