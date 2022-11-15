<?php
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$task = new Task();
$TAID = $_GET['TAID'];

// get task that should be deleted
$compareTask = $task->getTask($TAID);

// check if user is allowed to delete task
if($compareTask['created_by'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $task->deleteTask($TAID);

// check if task was deleted
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'task could not be deleted'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);