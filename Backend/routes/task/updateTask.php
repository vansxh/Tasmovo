<?php
require('../../bootstrap.inc.php');

Input::init();
if (Input::isEmpty()) die();

$auth->check();

$task = new Task();

$TAID = htmlspecialchars(Input::read('TAID'));
$tName = htmlspecialchars(Input::read('task_name'));
$notes = htmlspecialchars(Input::read('notes'));
$deadline = htmlspecialchars(Input::read('deadlineDay')) . " " . htmlspecialchars(Input::read('deadlineHour'));

$compareTask = $task->getTask($TAID);

if($compareTask['created_by'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $task->updateTask($TAID, $tName, $notes, $deadline/*, $createdby, $gid, $caid*/);

if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'task could not be updated'
    ]))->send(HttpCode::BAD_REQUEST);
}

(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);