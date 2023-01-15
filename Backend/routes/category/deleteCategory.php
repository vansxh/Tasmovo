<?php
/**
 * @var Auth $auth
 */
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$category = new Category();
$CAID = $_GET['CAID'];

// get category that should be deleted
$compareCat = $category->getCategory($CAID);

// check if user is allowed to delete category
if ($compareCat['userID'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'Der User darf diese Kategorie nicht löschen.'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $category->deleteCategory($CAID);

// check if category was deleted
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Kategorie konnte nicht gelöscht werden.'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);