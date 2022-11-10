<?php
require('../../bootstrap.inc.php');

$auth->check();

$task = new Task();
$item = $task->getTask($_GET['TAID']);

if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'task not found'
    ]))->send(HttpCode::NOT_FOUND);
}

if ($item['created_by'] !== $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);




