<?php
require('../../bootstrap.inc.php');

$quote = new Quote();

try {
    echo($quote->getQuote());
} catch (PDOException $e) {
    echo("Fehler aufgetreten");
    http_response_code(404);
}


