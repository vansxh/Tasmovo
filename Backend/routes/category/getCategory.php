<?php
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
        'message' => 'category not found'
    ]))->send(HttpCode::NOT_FOUND);
}

// check if user is allowed to get category
if ($item['userID'] !== $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

// if everything was successful
(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);