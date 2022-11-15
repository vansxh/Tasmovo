<?php
// required file
require('../../bootstrap.inc.php');

// get input
Input::init();
// check if input is empty
if (Input::isEmpty()) die();

// check if user is logged in
$auth->check();

$category = new Category();

// get different values from input
$CAID = htmlspecialchars(Input::read('CAID'));
$cName = htmlspecialchars(Input::read('category_name'));

$item = $category->insertCategory($cName, $_SESSION['UID']/*, $parent_categoryID, $gid*/);

// check if category was inserted
if(!$item) {
    (new Response([
        'error' => true,
        'message' => 'task could not be added'
    ]))->send(HttpCode::BAD_REQUEST);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::CREATED);