<?php
/**
 * @var Auth $auth
 */
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$task = new Task();

$item = $task->getSingleTasks($_SESSION['UID']);

// check if tasks were returned
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Keine Einzeltasks gefunden.'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);