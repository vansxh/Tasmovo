<?php
require('../../config.inc.php');
$CAID = $_GET['CAID'];

$category = new Category();

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
