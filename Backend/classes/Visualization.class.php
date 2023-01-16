<?php

class Visualization
{

    function getTaskExpenses($userID): bool|array
    {
        $stmt = Database::getDb()->prepare("SELECT CAST(end_date as DATE) as 'date', expenseID, COUNT(TAID) as 'number' FROM Task WHERE created_by=:userID AND end_date BETWEEN DATE_SUB(NOW(), INTERVAL 6 DAY) and NOW() GROUP BY CAST(end_date as DATE), expenseID ORDER BY date ASC");
        $stmt->bindValue(":userID", $userID);
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    function getNumberOfTimers($userID): bool|array
    {
        $stmt = Database::getDb()->prepare("SELECT COUNT(TIID) as 'timers' FROM Timer WHERE userID=:userID AND CAST(start_time as DATE) BETWEEN DATE_SUB(NOW(), INTERVAL 6 DAY) and NOW()");
        $stmt->bindValue(":userID", $userID);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    function getNumberOfDays($userID): bool|array
    {
        $stmt = Database::getDb()->prepare("SELECT COUNT(MID) as 'days' FROM MyDay as md INNER JOIN Task as t ON md.taskID=t.TAID WHERE t.created_by=:userID AND CAST(md.planned_date as DATE) BETWEEN DATE_SUB(NOW(), INTERVAL 6 DAY) and NOW()");
        $stmt->bindValue(":userID", $userID);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    function getStresslevels($userID): bool|array
    {
        $stmt = Database::getDb()->prepare("SELECT CAST(end_date as DATE) as 'date', SUM(stress_factor) as 'stresslevel' FROM Task WHERE created_by=:userID AND end_date BETWEEN DATE_SUB(NOW(), INTERVAL 6 DAY) and NOW() GROUP BY CAST(end_date as DATE) ORDER BY date ASC");
        $stmt->bindValue(":userID", $userID);
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    function getStresslimit($userID): bool|array
    {
        $stmt = Database::getDb()->prepare("SELECT stress_limit FROM User WHERE UID=:userID");
        $stmt->bindValue(":userID", $userID);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

}