<?php
/**
 * @var Auth $auth
 */
//Required file
require('../../bootstrap.inc.php');

//Check if user is logged in
$auth->check();

$reward = new Reward();
$result = $reward->getAllRewards();

(new Response([
    'message' => 'Rewards erfolgreich geladen.',
    'data' => $result
]))->send(HttpCode::OKAY);