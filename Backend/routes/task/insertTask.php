<?php
// required file
require('../../bootstrap.inc.php');

// check if Input is empty
if (Input::isEmpty()) {
    (new Response([
        'error' => true,
        'message' => 'Input is empty.'
    ]))->send(HttpCode::BAD_REQUEST);
}

// check if user is logged in
$auth->check();

$task = new Task();

// get different values from input
$tName = htmlspecialchars(Input::read('task_name'));
$notes = htmlspecialchars(Input::read('notes'));
$deadline = htmlspecialchars(Input::read('deadlineDay')) . " " . htmlspecialchars(Input::read('deadlineHour'));

$item = $task->insertTask($tName, $notes, $deadline, $_SESSION['UID']/*, $gid, $caid*/);

// check if task was inserted
if(!$item) {
    (new Response([
        'error' => true,
        'message' => 'task could not be added'
    ]))->send(HttpCode::BAD_REQUEST);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::CREATED);