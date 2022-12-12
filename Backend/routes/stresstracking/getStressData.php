<?php
/**
 * @var Auth $auth
 */
require('../../bootstrap.inc.php');

//Check if user is logged in
$auth->check();

$stress = new Stresstracking();

$result = $stress->getStressData();

(new Response([
    'message' => 'Average erfolgreich bekommen.',
    'data' => $result
]))->send(HttpCode::OKAY);
