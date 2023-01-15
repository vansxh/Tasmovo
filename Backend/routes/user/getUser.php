<?php
/**
 * @var Auth $auth
 */
//Required file
require('../../bootstrap.inc.php');

//Check if user is logged in
$auth->check();

$result = $auth->user();

(new Response([
    'message' => 'User erfolgreich abgefragt.',
    'data' => [
        'firstName' => $result['first_name'],
        'lastName' => $result['last_name'],
        'username' => $result['username'],
        'stress_limit' => $result['stress_limit']
    ]
]))->send(HttpCode::OKAY);