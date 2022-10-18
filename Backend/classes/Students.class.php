<?php

class Students{
    private $db;

    function __construct()
    {

        try {
            $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PW);
        } catch (PDOException $e) {
            //echo $e;
            echo "Verbindung fehlgeschlagen";
            die();
        }
    }

    function showStudents(){
        $stmt = $this->db->prepare("SELECT * FROM students");
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($result);
    }

    function deleteStudent($sId){
        $stmt = $this->db->prepare("DELETE FROM students WHERE sId=:studentID LIMIT 1");
        $stmt->bindValue(":studentID", $sId);
        $stmt->execute();
    }

    function insert($fName, $lName, $email){
        $stmt = $this->db->prepare("INSERT INTO students(fName, lName, email) VALUES(:firstname, :lastname, :mail)");
        $stmt->bindValue(":firstname", $fName);
        $stmt->bindValue(":lastname", $lName);
        $stmt->bindValue(":mail", $email);

        $stmt->execute();
    }
}