<?php
// required file
require('../../bootstrap.inc.php');

$quote = new Quote();
$allQuotes = $quote->getQuote();

$random = array_rand($allQuotes, 1);
$item = $allQuotes[$random];
$item['quote'] = utf8_encode($item['quote']);

// check if quote was returned
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Es wurde kein Zitat gefunden.'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);