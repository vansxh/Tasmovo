<?php
/**
 * @var Auth $auth
 */
require('../../bootstrap.inc.php');

//Check if user is logged in
$auth->check();

$stress = new Stresstracking();
$today = date('Y-m-d');

$result = $stress->getWeeklyAvg($today);

(new Response([
    'message' => 'Average erfolgreich bekommen.',
    'data' => $result
]))->send(HttpCode::OKAY);