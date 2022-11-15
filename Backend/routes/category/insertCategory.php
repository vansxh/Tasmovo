<?php
require('../../bootstrap.inc.php');

Input::init();
if (Input::isEmpty()) die();

$auth->check();

$category = new Category();

$CAID = htmlspecialchars(Input::read('CAID'));
$cName = htmlspecialchars(Input::read('category_name'));

$item = $category->insertCategory($cName, $_SESSION['UID']/*, $parent_categoryID, $gid*/);

if(!$item) {
    (new Response([
        'error' => true,
        'message' => 'task could not be added'
    ]))->send(HttpCode::BAD_REQUEST);
}

(new Response([
    'error' => false,
]))->send(HttpCode::CREATED);






/*
if (isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    if (isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata);

        $cName = strip_tags($request->{'category_name'});
        /*$parent_categoryID = htmlspecialchars($request->{'category'}->{'parent_categoryID'});
        $gid = htmlspecialchars($request->{'groupID'});

        if (!empty($cName) && !empty($_SESSION['UID'])) {
            try {
                if ($category->insertCategory($cName, $_SESSION['UID']/*, $parent_categoryID, $gid)) {
                    echo(json_encode("done"));
                    http_response_code(201);
                } else http_response_code(422);
            } catch (PDOException $e) {
                http_response_code(422);
            }
        }
    }
}*/
