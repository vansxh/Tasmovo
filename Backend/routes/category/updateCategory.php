<?php
/**
 * @var Auth $auth
 */
// required file
require('../../bootstrap.inc.php');

// check if Input is empty
if (Input::isEmpty()) {
    (new Response([
        'error' => true,
        'message' => 'Eingabefelder sind leer.'
    ]))->send(HttpCode::BAD_REQUEST);
}

// check if user is logged in
$auth->check();

$category = new Category();

// get different values from input
$CAID = Input::read('CAID');
$cName = Input::read('category_name');
$parent_categoryID = Input::read('parent_categoryID');

// get category that should be updated
$compareCat = $category->getCategory($CAID);

// check if user is allowed to update category
if ($compareCat['userID'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'Der User darf diese Kategorie nicht bearbeiten.'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $category->updateCategory($CAID, $cName, $parent_categoryID);

// check if category was updated
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Kategorie konnte nicht bearbeitet werden.'
    ]))->send(HttpCode::BAD_REQUEST);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);