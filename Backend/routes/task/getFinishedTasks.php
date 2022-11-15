<?php
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$task = new Task();

$item = $task->getFinishedTasks($_SESSION['UID']);

// check if tasks were returned
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'tasks not found'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);