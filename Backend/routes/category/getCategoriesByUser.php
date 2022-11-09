<?php
require('../../config.inc.php');

$category = new Category();

if (isset($_SESSION['loggedIn']) && isset($_SESSION['UID'])) {
    try {
        echo($category->getCategoriesByUser($_SESSION['UID']));
    } catch (PDOException $e) {
        http_response_code(404);
    }
}


