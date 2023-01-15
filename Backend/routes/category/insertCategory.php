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

$item = $category->insertCategory($cName, $_SESSION['UID'], $parent_categoryID);

// check if category was inserted
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Kategorie konnte nicht hinzugefügt werden.'
    ]))->send(HttpCode::BAD_REQUEST);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::CREATED);