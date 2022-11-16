<?php
// required file
require('../../bootstrap.inc.php');

// check if Input is empty
if (Input::isEmpty()) {
    (new Response([
        'error' => true,
        'message' => 'Input is empty.'
    ]))->send(HttpCode::BAD_REQUEST);
}

// check if user is logged in
$auth->check();

$task = new Task();
$TAID = htmlspecialchars(Input::read('TAID'));

// get task that should be finished
$compareTask = $task->getTask($TAID);

// check if user is allowed to finish task
if($compareTask['created_by'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $task->finishTask($TAID);

// check if task was finished
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'task could not be finished'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);