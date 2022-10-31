<?php

class Task{
    private $db;

    function __construct()
    {

        try {
            $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PW);
        } catch (PDOException $e) {
            echo "Verbindung fehlgeschlagen";
            die();
        }
    }

    function insertTask($tName, $notes, $deadline/*, $createdby, $gid, $caid*/){
        $stmt = $this->db->prepare("INSERT INTO Task(task_name, notes, deadline) VALUES(:tName, :notes, :deadline)");
        $stmt->bindValue(":tName", $tName);
        $stmt->bindValue(":notes", $notes);
        $stmt->bindValue(":deadline", $deadline);
        /*$stmt->bindValue(":createdby", $createdby);
        $stmt->bindValue(":gid", $gid);
        $stmt->bindValue(":caid", $caid);*/

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($result);
    }

    function getNextTasks($userID) {
        $stmt = $this->db->prepare("SELECT * FROM Task WHERE created_by = :userID ORDER BY deadline ASC LIMIT 3");
        $stmt->bindValue(":userID", $userID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($result);
    }

    function deleteTask($TAID){
        $stmt = $this->db->prepare("DELETE FROM Task WHERE TAID=:TAID LIMIT 1");
        $stmt->bindValue(":TAID", $TAID);
        $stmt->execute();
    }

}