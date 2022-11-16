<?php

class Task
{

    // function for inserting a new task
    function insertTask($tName, $notes, $deadline, $created_by/*, $gid, $caid*/)
    {
        $stmt = Database::getDb()->prepare("INSERT INTO Task(task_name, notes, deadline, created_by) VALUES(:tName, :notes, :deadline, :created_by)");
        $stmt->bindValue(":tName", $tName);
        $stmt->bindValue(":notes", $notes);
        $stmt->bindValue(":deadline", $deadline);
        $stmt->bindValue(":created_by", $created_by);
        /*$stmt->bindValue(":gid", $gid);
        $stmt->bindValue(":caid", $caid);*/

        if ($stmt->execute()) return true;
        else return false;
    }

    // function for getting the next tasks of a user
    function getNextTasks($userID)
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Task WHERE created_by=:userID AND statusID=1 ORDER BY deadline ASC LIMIT 3");
        $stmt->bindValue(":userID", $userID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        //echo(json_encode($result));
        //return $result;

        return $result;
    }

    // function for getting the finished tasks of a user
    function getFinishedTasks($userID)
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Task WHERE created_by=:userID AND statusID=2");
        $stmt->bindValue(":userID", $userID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        //print_r($result);

        return $result;
    }

    // function for getting the finished tasks of a user
    function getCategoryTasks($CAID, $userID)
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Task WHERE categoryID=:CAID AND created_by=:userID");
        $stmt->bindValue(":CAID", $CAID);
        $stmt->bindValue(":userID", $userID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    // function for getting one task via ID
    function getTask($TAID)
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Task WHERE TAID=:TAID LIMIT 1");
        $stmt->bindValue(":TAID", $TAID);

        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    // function for deleting a task via ID
    function deleteTask($TAID)
    {
        $stmt = Database::getDb()->prepare("DELETE FROM Task WHERE TAID=:TAID LIMIT 1");
        $stmt->bindValue(":TAID", $TAID);
        if ($stmt->execute()) return true;
        else return false;
    }

    // function for updating a task via ID
    function updateTask($TAID, $tName, $notes, $deadline/*, $createdby, $gid, $caid*/)
    {
        $stmt = Database::getDb()->prepare("UPDATE Task SET task_name=:tName, notes=:notes, deadline=:deadline WHERE TAID=:TAID LIMIT 1");
        $stmt->bindValue(":TAID", $TAID);
        $stmt->bindValue(":tName", $tName);
        $stmt->bindValue(":notes", $notes);
        $stmt->bindValue(":deadline", $deadline);
        /*$stmt->bindValue(":createdby", $createdby);
        $stmt->bindValue(":gid", $gid);
        $stmt->bindValue(":caid", $caid);*/

        if ($stmt->execute()) return true;
        else return false;
    }

    // // function for finishing a task via ID
    function finishTask($TAID)
    {
        $stmt = Database::getDb()->prepare("UPDATE Task SET statusID=2, end_date=now() WHERE TAID=:TAID LIMIT 1");
        $stmt->bindValue(":TAID", $TAID);

        if ($stmt->execute()) return true;
        else return false;
    }

}