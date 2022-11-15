<?php
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$category = new Category();
$CAID = $_GET['CAID'];

// get category that should be deleted
$compareCat = $category->getCategory($CAID);

// check if user is allowed to delete category
if($compareCat['userID'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $category->deleteCategory($CAID);

// check if category was deleted
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'category could not be deleted'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);