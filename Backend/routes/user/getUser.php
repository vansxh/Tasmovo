<?php
//Required file
require('../../bootstrap.inc.php');

//Check if user is logged in
$auth->check();

$result = $auth->user();

(new Response([
    'message' => 'User erfolgreich abgefragt.',
    'data' => $result
]))->send(HttpCode::OKAY);