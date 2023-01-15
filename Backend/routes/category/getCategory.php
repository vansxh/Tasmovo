<?php
/**
 * @var Auth $auth
 */
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$category = new Category();
$item = $category->getCategory($_GET['CAID']);

// check if category was returned
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Kategorie wurde nicht gefunden.'
    ]))->send(HttpCode::NOT_FOUND);
}

// check if user is allowed to get category
if ($item['userID'] !== $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'Der User darf diese Kategorie nicht ansehen.'
    ]))->send(HttpCode::FORBIDDEN);
}

// if everything was successful
(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);