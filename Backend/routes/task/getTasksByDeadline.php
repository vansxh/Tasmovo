<?php
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$task = new Task();
$deadline = $_GET['deadline'];

$item = $task->getTasksByDeadline($deadline);

// check if tasks were returned
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Keine Tasks gefunden.'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);