<?php
/**
 * @var Auth $auth
 */
// required file
require('../../bootstrap.inc.php');

// check if user is logged in
$auth->check();

$task = new Task();
$category = new Category();
$CAID = $_GET['CAID'];

// get category whose tasks should be displayed
$compareCategory = $category->getCategory($CAID);

// check if user is allowed to get tasks
if ($compareCategory['userID'] !== $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'Der User darf diese Tasks nicht ansehen.'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $task->getCategoryTasks($CAID, $_SESSION['UID']);

// check if tasks were returned
if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'Keine Tasks in dieser Kategorie gefunden.'
    ]))->send(HttpCode::NOT_FOUND);
}

// if everything was successful
(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);
