<?php
/**
 * @var Auth $auth
 */
//Required file
require('../../bootstrap.inc.php');

//Check if user is logged in
$auth->check();

$timer = new Timer();
$now = date("Y-m-d H:i:s", time());

$data = $timer->getTimer();
$sec = $data['duration'] * 60;
$endDate = date("Y-m-d H:i:s", (strtotime(date($data['start_time'])) + $sec));

if (!$data || $now > $endDate) {
    (new Response([
        'error' => true,
        'message' => 'Keine Daten vorhanden.',
        'data' => $data
    ]))->send(HttpCode::BAD_REQUEST);
}

$data['duration'] = strtotime($endDate) - strtotime($now);

(new Response([
    'error' => false,
    'message' => 'Timer geladen.',
    'data' => $data
]))->send(HttpCode::OKAY);
