<?php
session_start();
require('../../config.inc.php');
$userID = $_GET['userID'];

$category = new Category();

if (!empty($CAID)) {
    try {
        echo($category->getCategoriesByUser($userID));
    } catch (PDOException $e) {
        http_response_code(404);
    }
}


