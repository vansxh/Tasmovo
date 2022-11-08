<?php
require('../../config.inc.php');
$postdata = file_get_contents("php://input");

$category = new Category();

if (isset($postdata) && !empty($postdata)) {
    $request = json_decode($postdata);

    $cName = htmlspecialchars($request->{'category'}->{'category_name'});
    $userID = htmlspecialchars($request->{'userID'});
    /*$parent_categoryID = htmlspecialchars($request->{'category'}->{'parent_categoryID'});
    $gid = htmlspecialchars($request->{'groupID'});*/

    if (!empty($cName) && !empty($userID)) {
        try {
            if($category->insertCategory($cName, $userID/*, $parent_categoryID, $gid*/)) {
                echo(json_encode("done"));
                http_response_code(201);
            } else http_response_code(422);
        } catch (PDOException $e) {
            http_response_code(422);
        }
    }
}
