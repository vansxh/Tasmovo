<?php
// required file
require('../../bootstrap.inc.php');

// get input
Input::init();
// check if input is empty
if (Input::isEmpty()) die();

// check if user is logged in
$auth->check();

$task = new Task();

// get different values from input
$TAID = htmlspecialchars(Input::read('TAID'));
$tName = htmlspecialchars(Input::read('task_name'));
$notes = htmlspecialchars(Input::read('notes'));
$deadline = htmlspecialchars(Input::read('deadlineDay')) . " " . htmlspecialchars(Input::read('deadlineHour'));

// get task that should be updated
$compareTask = $task->getTask($TAID);

// check if user is allowed to update task
if($compareTask['created_by'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $task->updateTask($TAID, $tName, $notes, $deadline/*, $createdby, $gid, $caid*/);

// check if category was updated
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'task could not be updated'
    ]))->send(HttpCode::BAD_REQUEST);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);