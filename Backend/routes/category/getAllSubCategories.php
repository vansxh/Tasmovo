<?php
/**
 * @var Auth $auth
 */
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$category = new Category();

$item = $category->getAllSubCategories($_GET['CAID']);

// check if categories were returned
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Keine Subkategorien gefunden.'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);