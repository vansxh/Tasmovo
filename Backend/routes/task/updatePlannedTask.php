<?php
// required file
require('../../bootstrap.inc.php');

// check if Input is empty
if (Input::isEmpty()) {
    (new Response([
        'error' => true,
        'message' => 'Geplanter Task konnte nicht bearbeitet werden.'
    ]))->send(HttpCode::BAD_REQUEST);
}

// check if user is logged in
$auth->check();

$task = new Task();

// get different values from input
$TAID = Input::read('TAID');
$start_time =  Input::read('start_time');
$end_time =  Input::read('end_time');

$item = $task->updatePlannedTask($TAID, $start_time, $end_time);

// check if category was updated
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Geplanter Task konnte nicht bearbeitet werden.'
    ]))->send(HttpCode::BAD_REQUEST);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);