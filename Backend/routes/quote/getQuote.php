<?php
require('../../bootstrap.inc.php');

$auth->check();

$quote = new Quote();
$item = $quote->getQuote();

if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'no quote found'
    ]))->send(HttpCode::NOT_FOUND);
}

(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);

/*
try {
    echo($quote->getQuote());
} catch (PDOException $e) {
    echo("Fehler aufgetreten");
    http_response_code(404);
}*/


