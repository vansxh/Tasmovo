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
$TAID = Input::read('TAID');

// get task that should be finished
$compareTask = $task->getTask($TAID);

// check if user is allowed to finish task
if($compareTask['created_by'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'Der User darf diesen Task nicht abschließen.'
    ]))->send(HttpCode::FORBIDDEN);
}

if (!Input::read('stress_factor')){
    $item = $task->finishTask($TAID, Input::read('expenseID'), 0);
}else{
    $item = $task->finishTask($TAID, Input::read('expenseID'), Input::read('stress_factor'));
}

// check if task was finished
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Task konnte nicht abgeschlossen werden.'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);