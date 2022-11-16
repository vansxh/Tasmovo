<?php
// required file
require('../../bootstrap.inc.php');

// check if input is empty
if (Input::isEmpty()) die();

// check if user is logged in
$auth->check();

$category = new Category();

// get different values from input
$CAID = htmlspecialchars(Input::read('CAID'));
$cName = htmlspecialchars(Input::read('category_name'));

// get category that should be updated
$compareCat = $category->getCategory($CAID);

// check if user is allowed to update category
if($compareCat['userID'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $category->updateCategory($CAID, $cName/*, $parent_categoryID, $gid*/);

// check if category was updated
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'category could not be updated'
    ]))->send(HttpCode::BAD_REQUEST);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);