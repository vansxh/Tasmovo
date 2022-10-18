<?php
/*require('connect.php');
$students = [];
$sql = "SELECT * FROM students";

if ($result = mysqli_query($con, $sql)) {
    $cr = 0;

    while($row = mysqli_fetch_assoc($result)){
        $students[$cr]['sId'] = $row['sId'];
        $students[$cr]['fName'] = $row['fName'];
        $students[$cr]['lName'] = $row['lName'];
        $students[$cr]['email'] = $row['email'];
        $cr++;
    }

    echo json_encode($students);
    //print_r($students);
}else{
    http_response_code(404);
}*/
require('config.inc.php');

$students = new Students();

try {
    echo($students->showStudents());
} catch (PDOException $e) {
    echo("Fehler aufgetreten");
    http_response_code(404);
}


