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
$deadlineDay = date_create(Input::read('deadlineDay'));
$deadlineDayFormat = date_format($deadlineDay, "Y-m-d");
$deadlineHour = Input::read('deadlineHour');
$deadline = $deadlineDayFormat . " " . $deadlineHour;
if(Input::read('subcategoryID')) $caid = Input::read('subcategoryID');
else $caid = Input::read('categoryID');

// get task that should be updated
$compareTask = $task->getTask($TAID);

// check if user is allowed to update task
if($compareTask['created_by'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $task->updateTask($TAID, $tName, $notes, $deadline, $caid/*, $gid*/);

// check if category was updated
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Der User darf diesen Task nicht bearbeiten.'
    ]))->send(HttpCode::BAD_REQUEST);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);