<?php
/**
 * @var Auth $auth
 */
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$visualization = new Visualization();

$item = $visualization->getTaskExpenses($_SESSION['UID']);

// check if tasks were returned
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Keine abgeschlossenen Tasks in der letzten Woche gefunden.'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);