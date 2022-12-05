<?php
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$task = new Task();
$TAID = $_GET['TAID'];
print_r($TAID);

$item = $task->deletePlannedTask($TAID);

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