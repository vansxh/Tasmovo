<?php
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$quote = new Quote();
$item = $quote->getQuote();

// check if quote was returned
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'no quote found'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);