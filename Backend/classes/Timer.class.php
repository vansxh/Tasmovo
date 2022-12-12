<?php

class Timer
{
    function createTimer($rewardID, $duration)
    {
        $stmt = Database::getDb()->prepare("INSERT INTO Timer (userID, rewardID, duration) VALUES (:userID, :rewardID, :duration)");
        $stmt->bindValue(":userID", $_SESSION['UID']);
        $stmt->bindValue(":rewardID", $rewardID);
        $stmt->bindValue(":duration", $duration);

        if ($stmt->execute()) {
            return true;
        } else {
            return false;
        }
    }

    function deleteTimer($TIID)
    {

    }

    function getTimer()
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Timer INNER JOIN Reward ON rewardID = RID WHERE userID = :userID ORDER BY TIID LIMIT 1");
        $stmt->bindValue(":userID", $_SESSION['UID']);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }
}