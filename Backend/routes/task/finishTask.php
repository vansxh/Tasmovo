<?php
require('../../bootstrap.inc.php');

Input::init();
if (Input::isEmpty()) die();

$auth->check();

$task = new Task();
$TAID = htmlspecialchars(Input::read('TAID'));

$compareTask = $task->getTask($TAID);

if($compareTask['created_by'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $task->finishTask($TAID);

if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'task could not be finished'
    ]))->send(HttpCode::NOT_FOUND);
}

(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);

/*
if (isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    if (isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata);

        $TAID = htmlspecialchars($request->{'TAID'});

        $gotTask = json_decode($task->getTask($TAID));

        if (!empty($TAID) && $gotTask->{'created_by'} === $_SESSION['UID']) {
            try {
                if ($task->finishTask($TAID)) {
                    echo(json_encode("done"));
                    http_response_code(201);
                } else http_response_code(422);
            } catch (PDOException $e) {
                http_response_code(422);
            }
        }
    }
}*/
