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

//Check if user is logged in
$auth->check();

$timer = new Timer();

$hours = Input::read('hours');
$minutes = Input::read('minutes');
$duration = ($hours * 60) + $minutes;

if ($timer->createTimer(Input::read('rewardID'), $duration)) {
    (new Response([
        'error' => false,
        'message' => 'Timer erfolgreich erstellt.'
    ]))->send(HttpCode::CREATED);
} else {
    (new Response([
        'error' => true,
        'message' => 'Timer anlegen fehlgeschlagen.'
    ]))->send(HttpCode::BAD_REQUEST);
}

