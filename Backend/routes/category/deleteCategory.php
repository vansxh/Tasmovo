<?php
require('../../bootstrap.inc.php');

$auth->check();

$category = new Category();
$CAID = $_GET['CAID'];

$compareCat = $category->getCategory($CAID);

if($compareCat['userID'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $category->deleteCategory($CAID);

if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'category could not be deleted'
    ]))->send(HttpCode::NOT_FOUND);
}

(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);


/*
if (isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    if (!empty($CAID)) {
        try {
            if ($category->deleteCategory($CAID)) {
                echo(json_encode("done"));
                http_response_code(202);
            } else http_response_code(422);
        } catch (PDOException $e) {
            http_response_code(422);
        }
    }
}
*/