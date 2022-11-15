<?php
require('../../bootstrap.inc.php');

Input::init();
if (Input::isEmpty()) die();

$auth->check();

$category = new Category();

$CAID = htmlspecialchars(Input::read('CAID'));
$cName = htmlspecialchars(Input::read('category_name'));

$compareCat = $category->getCategory($CAID);

if($compareCat['userID'] != $_SESSION['UID']) {
    (new Response([
        'error' => true,
        'message' => 'wrong user'
    ]))->send(HttpCode::FORBIDDEN);
}

$item = $category->updateCategory($CAID, $cName/*, $parent_categoryID, $gid*/);

if (!$item) {
    (new Response([
        'error' => true,
        'message' => 'category could not be updated'
    ]))->send(HttpCode::BAD_REQUEST);
}

(new Response([
    'error' => false,
]))->send(HttpCode::OKAY);





/*
if (isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    if (isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata);

        $CAID = htmlspecialchars($request->{'CAID'});
        $cName = htmlspecialchars($request->{'category_name'});
        $userID = htmlspecialchars($request->{'userID'});
        /*$parent_categoryID = htmlspecialchars($request->{'category'}->{'parent_categoryID'});
        $gid = htmlspecialchars($request->{'groupID'});

        if (!empty($cName) && !empty($deadline) && $userID === $_SESSION['UID']) {
            try {
                if ($category->updateCategory($CAID, $cName/*, $parent_categoryID, $gid)) {
                    echo(json_encode("done"));
                    http_response_code(201);
                } else http_response_code(422);
            } catch (PDOException $e) {
                http_response_code(422);
            }
        }
    }
}*/
