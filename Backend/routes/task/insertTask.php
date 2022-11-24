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
$tName = Input::read('task_name');
$notes = Input::read('notes');
$deadlineDay = Input::read('deadlineDay');
$deadlineHour = Input::read('deadlineHour');
$deadline = $deadlineDay . " " . $deadlineHour;
if(Input::read('subcategoryID')) $caid = Input::read('subcategoryID');
else $caid = Input::read('categoryID');

$item = $task->insertTask($tName, $notes, $deadline, $_SESSION['UID'], $caid/*, $gid*/);

// check if task was inserted
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