<?php

class Task
{

    // function for inserting a new task
    function insertTask($tName, $notes, $deadline, $created_by, $caid/*, $gid*/)
    {
        $stmt = Database::getDb()->prepare("INSERT INTO Task(task_name, notes, deadline, created_by, categoryID) VALUES(:tName, :notes, :deadline, :created_by, :caid)");
        $stmt->bindValue(":tName", $tName);
        $stmt->bindValue(":notes", $notes);
        $stmt->bindValue(":deadline", $deadline);
        $stmt->bindValue(":created_by", $created_by);
        $stmt->bindValue(":caid", $caid);
        /*$stmt->bindValue(":gid", $gid);*/

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

    // function for getting all tasks of a user
    function getUserTasks($userID)
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Task WHERE created_by=:userID");
        $stmt->bindValue(":userID", $userID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        //print_r($result);

        return $result;
    }

    // function for getting all single tasks of a user (not in a category)
    function getSingleTasks($userID)
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Task WHERE created_by=:userID AND categoryID IS NULL");
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
        $stmt = Database::getDb()->prepare("SELECT * ,(SELECT parent_categoryID from Category as c WHERE c.CAID = t.categoryID) as 'parent_categoryID' FROM `Task` as t WHERE TAID=:TAID LIMIT 1");
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
    function updateTask($TAID, $tName, $notes, $deadline, $caid/*, $gid*/)
    {
        $stmt = Database::getDb()->prepare("UPDATE Task SET task_name=:tName, notes=:notes, deadline=:deadline, categoryID=:caid WHERE TAID=:TAID LIMIT 1");
        $stmt->bindValue(":TAID", $TAID);
        $stmt->bindValue(":tName", $tName);
        $stmt->bindValue(":notes", $notes);
        $stmt->bindValue(":deadline", $deadline);
        $stmt->bindValue(":caid", $caid);
        /*$stmt->bindValue(":createdby", $createdby);
        $stmt->bindValue(":gid", $gid);*/

        if ($stmt->execute()) return true;
        else return false;
    }

    // // function for finishing a task via ID
    function finishTask($TAID, $expenseID, $stress_factor)
    {
        $stmt = Database::getDb()->prepare("UPDATE Task SET statusID=2, end_date=now(), expenseID=:expenseID, stress_factor=:stressFactor WHERE TAID=:TAID LIMIT 1");
        $stmt->bindValue(":TAID", $TAID);
        $stmt->bindValue(":expenseID", $expenseID);
        $stmt->bindValue(":stressFactor", $stress_factor);

        if ($stmt->execute()) return true;
        else return false;
    }

    // function for getting Tasks according to Deadline
    function getTasksByDeadline($userID, $deadline)
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Task WHERE Date(deadline)=:deadline AND created_by=:userID");
        $stmt->bindValue(":deadline", $deadline);
        $stmt->bindValue(":userID", $userID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    // function for getting tasks planned for My Day
    function getPlannedTasks($userID, $date)
    {
        $stmt = Database::getDb()->prepare("SELECT * ,(SELECT c.category_name from Category as c WHERE c.CAID=t.categoryID) as 'category' FROM MyDay as md INNER JOIN Task as t ON md.taskID=t.TAID WHERE md.planned_date=:date AND t.created_by=:userID");
        $stmt->bindValue(":date", $date);
        $stmt->bindValue(":userID", $userID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    // function for updating a planned task in My Day
    function updatePlannedTask($MID, $TAID, $start_time, $end_time, $planned_date)
    {
        $stmt = Database::getDb()->prepare("UPDATE MyDay SET taskID=:TAID, start_time=:start_time, end_time=:end_time, planned_date=:planned_date WHERE MID=:MID LIMIT 1");
        $stmt->bindValue(":MID", $MID);
        $stmt->bindValue(":TAID", $TAID);
        $stmt->bindValue(":start_time", $start_time);
        $stmt->bindValue(":end_time", $end_time);
        $stmt->bindValue(":planned_date", $planned_date);

        if ($stmt->execute()) return true;
        else return false;
    }

    // function for deleting a planned task from My Day
    function deletePlannedTask($MID)
    {
        $stmt = Database::getDb()->prepare("DELETE FROM MyDay WHERE MID=:MID LIMIT 1");
        $stmt->bindValue(":MID", $MID);
        if ($stmt->execute()) return true;
        else return false;
    }

    // function for inserting a new planned task in My Day
    function insertPlannedTask($TAID, $start_time, $end_time, $planned_date)
    {
        $stmt = Database::getDb()->prepare("INSERT INTO MyDay(taskID, start_time, end_time, planned_date) VALUES(:TAID, :start_time, :end_time, :planned_date)");
        $stmt->bindValue(":TAID", $TAID);
        $stmt->bindValue(":start_time", $start_time);
        $stmt->bindValue(":end_time", $end_time);
        $stmt->bindValue(":planned_date", $planned_date);

        if ($stmt->execute()) return true;
        else return false;
    }

}