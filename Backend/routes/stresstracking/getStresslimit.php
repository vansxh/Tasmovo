<?php
//Required file
require('../../bootstrap.inc.php');

//Check if user is logged in
$auth->check();

$stress = new Stresstracking();

$result = $stress->getStresslimit();

(new Response([
    'message' => 'Stresslimit erfolgreich bekommen.',
    'data' => $result
]))->send(HttpCode::OKAY);