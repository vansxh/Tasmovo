<?php

/*require ('connect.php');
$id = $_GET['id'];

$sql = "DELETE FROM students WHERE sId = {$id} LIMIT 1";

if (mysqli_query($con, $sql)) {
    http_response_code(204);
}else{
    http_response_code(422);
}*/
require('config.inc.php');
$id = $_GET['id'];

$students = new Students();

try {
    $students->deleteStudent($id);
    http_response_code(204);
} catch (PDOException $e) {
    echo("Fehler aufgetreten");
    http_response_code(422);
}
