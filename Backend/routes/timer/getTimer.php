<?php
//Required file
require('../../bootstrap.inc.php');

//Check if user is logged in
$auth->check();

$timer = new Timer();
$now = date("Y-m-d H:i:s", time());

$data = $timer->getTimer();
//print_r($data);
$sec = $data['duration'] * 60;
//$endDate = $data[0]['start_time'] /*+ strtotime("+$sec sec")*/;
$endDate = date("Y-m-d H:i:s", (strtotime(date($data['start_time'])) + $sec));
//print_r($endDate);
if (!$data || $now > $endDate){
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
