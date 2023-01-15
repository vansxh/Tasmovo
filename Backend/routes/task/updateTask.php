<?php
/**
 * @var Auth $auth
 */
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
if (Input::read('subcategoryID')) $caid = Input::read('subcategoryID');
else $caid = Input::read('categoryID');

// get task that should be updated
$compareTask = $task->getTask($TAID);

// check if user is allowed to update task
if ($compareTask['created_by'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $task->updateTask($TAID, $tName, $notes, $deadline, $caid/*, $gid*/);

// check if task was updated
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Der Task konnte nicht bearbeitet werden.'
    ]))->send(HttpCode::BAD_REQUEST);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);