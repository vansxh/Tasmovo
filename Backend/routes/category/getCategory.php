<?php
session_start();
require('../../config.inc.php');
$CAID = $_GET['CAID'];

$category = new Category();

if (!empty($CAID)) {
    try {
        echo($category->getCategory($CAID));
    } catch (PDOException $e) {
        http_response_code(404);
    }
}


