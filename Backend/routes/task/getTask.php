<?php
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$task = new Task();
$item = $task->getTask($_GET['TAID']);

// check if task was returned
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Task wurde nicht gefunden.'
    ]))->send(HttpCode::NOT_FOUND);
}

// check if user is allowed to get task
if ($item['created_by'] !== $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'Der User darf diesen Task nicht ansehen.'
    ]))->send(HttpCode::FORBIDDEN);
}

// if everything was successful
(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);