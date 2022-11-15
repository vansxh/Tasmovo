<?php
require('../../bootstrap.inc.php');

$auth->check();

$category = new Category();
$item = $category->getCategory($_GET['CAID']);

if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'category not found'
    ]))->send(HttpCode::NOT_FOUND);
}

if ($item['userID'] !== $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

(new Response([
    'error' => false,
    'data' => $item
]))->send(HttpCode::OKAY);






require('../../config.inc.php');
$CAID = $_GET['CAID'];

$category = new Category();

if (isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    if (!empty($CAID)) {
        try {
            echo($category->getCategory($CAID));
        } catch (PDOException $e) {
            http_response_code(404);
        }
    }
}


