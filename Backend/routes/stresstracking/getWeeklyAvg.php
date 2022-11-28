<?php
//Required file
require('../../bootstrap.inc.php');

//Check if user is logged in
$auth->check();

$stress = new Stresstracking();

$result = $stress->getWeeklyAvg('01.01.2022','07.01.2022');

(new Response([
    'message' => 'Average erfolgreich bekommen.',
    'data' => $result
]))->send(HttpCode::OKAY);