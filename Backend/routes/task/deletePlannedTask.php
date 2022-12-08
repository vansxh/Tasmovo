<?php
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$task = new Task();
$MID = $_GET['MID'];

$item = $task->deletePlannedTask($MID);

// check if task was deleted
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Task konnte nicht entfernt werden.'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);