<?php
require('../../bootstrap.inc.php');

$auth->check();

$task = new Task();
$TAID = $_GET['TAID'];

$compareTask = $task->getTask($TAID);

if($compareTask['created_by'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $task->deleteTask($TAID);

if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'task could not be deleted'
    ]))->send(HttpCode::NOT_FOUND);
}

(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);
