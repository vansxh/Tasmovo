<?php
require('../../bootstrap.inc.php');

$auth->check();

$task = new Task();

$item = $task->getFinishedTasks($_SESSION['UID']);

if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'tasks not found'
    ]))->send(HttpCode::NOT_FOUND);
}

(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);

