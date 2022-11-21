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
$tName = Input::read('task_name');
$notes = Input::read('notes');
$deadlineDay = date_create(Input::read('deadlineDay'));
$deadlineDayFormat = date_format($deadlineDay, "Y-m-d");
$deadline = $deadlineDayFormat . " " . Input::read('deadlineHour');
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