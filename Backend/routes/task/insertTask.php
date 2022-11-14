<?php
require('../../bootstrap.inc.php');

Input::init();
if (Input::isEmpty()) die();

$auth->check();

$task = new Task();

$tName = htmlspecialchars(Input::read('task_name'));
$notes = htmlspecialchars(Input::read('notes'));
$deadline = htmlspecialchars(Input::read('deadlineDay')) . " " . htmlspecialchars(Input::read('deadlineHour'));

$item = $task->insertTask($tName, $notes, $deadline, $_SESSION['UID']/*, $gid, $caid*/);

if(!$item) {
    (new Response([
        'error' => true,
        'message' => 'task could not be added'
    ]))->send(HttpCode::BAD_REQUEST);
}

(new Response([
    'error' => false,
]))->send(HttpCode::CREATED);