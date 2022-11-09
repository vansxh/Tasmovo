<?php
require('../../config.inc.php');
$postdata = file_get_contents("php://input");

$category = new Category();

if(isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    if (isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata);

        $CAID = htmlspecialchars($request->{'CAID'});
        $cName = htmlspecialchars($request->{'category_name'});
        $userID = htmlspecialchars($request->{'userID'});
        /*$parent_categoryID = htmlspecialchars($request->{'category'}->{'parent_categoryID'});
        $gid = htmlspecialchars($request->{'groupID'});*/

        if (!empty($cName) && !empty($deadline) && $userID === $_SESSION['UID']) {
            try {
                if($category->updateCategory($CAID, $cName/*, $parent_categoryID, $gid*/)){
                    echo(json_encode("done"));
                    http_response_code(201);
                } else http_response_code(422);
            } catch (PDOException $e) {
                http_response_code(422);
            }
        }
    }
}