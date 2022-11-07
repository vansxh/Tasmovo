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
        $stmt = $this->db->prepare("SELECT * FROM Task WHERE created_by=:userID AND statusID=1 ORDER BY deadline ASC LIMIT 3");
        $stmt->bindValue(":userID", $userID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        //echo(json_encode($result));
        //return $result;

        return json_encode($result);
    }

    function test($id){
        $stmt = $this->db->prepare("SELECT * FROM Task WHERE created_by = :id AND statusID = 1 ORDER BY deadline ASC LIMIT 3");
        $stmt->bindValue(":id", $id);
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return json_encode($result);
    }

    function getFinishedTasks($userID) {
        $stmt = $this->db->prepare("SELECT * FROM Task WHERE created_by=:userID AND statusID=2");
        $stmt->bindValue(":userID", $userID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        //print_r($result);

        return json_encode($result);
    }    

    function getTask($TAID) {
        $stmt = $this->db->prepare("SELECT * FROM Task WHERE TAID=:TAID LIMIT 1");
        $stmt->bindValue(":TAID", $TAID);

        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return json_encode($result);
    }

    function deleteTask($TAID){
        $stmt = $this->db->prepare("DELETE FROM Task WHERE TAID=:TAID LIMIT 1");
        $stmt->bindValue(":TAID", $TAID);
        $stmt->execute();
    }

    function updateTask($TAID, $tName, $notes, $deadline/*, $createdby, $gid, $caid*/){
        $stmt = $this->db->prepare("UPDATE Task SET task_name=:tName, notes=:notes, deadline=:deadline WHERE TAID=:TAID LIMIT 1");
        $stmt->bindValue(":TAID", $TAID);
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

    function finishTask($TAID){
        $stmt = $this->db->prepare("UPDATE Task SET statusID=2, end_date=now() WHERE TAID=:TAID LIMIT 1");
        $stmt->bindValue(":TAID", $TAID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($result);
    }

}