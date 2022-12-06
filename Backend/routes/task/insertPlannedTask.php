<?php
// required file
require('../../bootstrap.inc.php');

// check if Input is empty
if (Input::isEmpty()) {
    (new Response([
        'error' => true,
        'message' => 'Eingabefelder sind leer.'
    ]))->send(HttpCode::BAD_REQUEST);
}

// check if user is logged in
$auth->check();

$task = new Task();

// get different values from input
$TAID = Input::read('TAID');
$start_time = Input::read('start_time');
$end_time = Input::read('end_time');
$planned_date = Input::read('planned_date');

$item = $task->insertPlannedTask($TAID, $start_time, $end_time, $planned_date);

// check if planned task was inserted
if(!$item) {
    (new Response([
        'error' => true,
        'message' => 'Task konnte nicht hinzugefügt werden.'
    ]))->send(HttpCode::BAD_REQUEST);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::CREATED);