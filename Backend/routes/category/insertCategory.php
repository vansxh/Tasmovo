<?php
require('../../config.inc.php');
$postdata = file_get_contents("php://input");

$category = new Category();

if (isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    if (isset($postdata) && !empty($postdata)) {
        $request = json_decode($postdata);

        $cName = strip_tags($request->{'category_name'});
        /*$parent_categoryID = htmlspecialchars($request->{'category'}->{'parent_categoryID'});
        $gid = htmlspecialchars($request->{'groupID'});*/

        if (!empty($cName) && !empty($_SESSION['UID'])) {
            try {
                if ($category->insertCategory($cName, $_SESSION['UID']/*, $parent_categoryID, $gid*/)) {
                    echo(json_encode("done"));
                    http_response_code(201);
                } else http_response_code(422);
            } catch (PDOException $e) {
                http_response_code(422);
            }
        }
    }
}
