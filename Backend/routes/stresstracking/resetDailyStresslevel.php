<?php
// required file
require('../../bootstrap.inc.php');

// check if Input is empty
if (Input::isEmpty()) {
    (new Response([
        'error' => true,
        'message' => 'Stresslimit konnte nicht geändert werden.'
    ]))->send(HttpCode::BAD_REQUEST);
}

// check if user is logged in
$auth->check();

$stress = new Stresstracking();

// get different values from input
$daily_stresslevel =  Input::read('stress_factor');

$item = $stress->resetDailyStresslevel($daily_stresslevel);

// check if stress limit was updated
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Stresslimit konnte nicht geändert werden.'
    ]))->send(HttpCode::BAD_REQUEST);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);