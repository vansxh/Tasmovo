<?php

class Students
{


    function showStudents()
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM students");
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($result);
    }

    function deleteStudent($sId)
    {
        $stmt = Database::getDb()->prepare("DELETE FROM students WHERE sId=:studentID LIMIT 1");
        $stmt->bindValue(":studentID", $sId);
        $stmt->execute();
    }

    function insert($fName, $lName, $email)
    {
        $stmt = Database::getDb()->prepare("INSERT INTO students(fName, lName, email) VALUES(:firstname, :lastname, :mail)");
        $stmt->bindValue(":firstname", $fName);
        $stmt->bindValue(":lastname", $lName);
        $stmt->bindValue(":mail", $email);

        $stmt->execute();
    }
}