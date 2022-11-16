<?php
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$category = new Category();

$item = $category->getCategoriesByUser($_SESSION['UID']);

// check if categories were returned
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Keine Kategorien gefunden.'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);