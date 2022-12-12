<?php

class Stresstracking
{
    function getWeeklyAvg($today){
        //SELECT AVG(t.stress_factor) AS 'Average' FROM User AS u INNER JOIN Task AS t ON u.UID = t.created_by WHERE u.UID = '292e9f36-b177-4e31-9abb-2dfd54aa1904' AND t.end_date >= ('2022-11-28'-7) AND t.end_date <= '2022-11-28'
        //SELECT AVG(t.stress_factor) AS 'Average' FROM User AS u INNER JOIN Task AS t ON u.UID = t.created_by WHERE u.UID = '292e9f36-b177-4e31-9abb-2dfd54aa1904' AND t.end_date >= DATE_SUB("2022-11-28", INTERVAL 7 DAY) AND t.end_date <= '2022-11-28'
        $tomorrow = $today + 1;
        $stmt = Database::getDb()->prepare("SELECT ROUND(AVG(t.stress_factor),2) AS 'Average' FROM User AS u INNER JOIN Task AS t ON u.UID = t.created_by WHERE u.UID = :UID AND t.end_date >= DATE_SUB(:today, INTERVAL 7 DAY) AND t.end_date < :tomorrow");
        $stmt->bindValue(":UID", $_SESSION['UID']);
        $stmt->bindValue(":today", $today);
        $stmt->bindValue(":tomorrow", $tomorrow);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    /*function getDailyAvg(){
        $stmt = Database::getDb()->prepare("SELECT SUM(stress_factor) AS 'Sum' FROM Task WHERE created_by=:UID AND DATE(end_date)= CURRENT_DATE LIMIT 1");
        $stmt->bindValue(":UID", $_SESSION['UID']);

        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }*/

    function getDailyStresslevel(){
        $stmt = Database::getDb()->prepare("SELECT daily_stresslevel FROM User WHERE UID=:UID LIMIT 1");
        $stmt->bindValue(":UID", $_SESSION['UID']);

        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    function getStresslimit(){
        $stmt = Database::getDb()->prepare("SELECT stress_limit FROM User WHERE UID=:UID LIMIT 1");
        $stmt->bindValue(":UID", $_SESSION['UID']);

        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    function updateDailyStresslevel($daily_stresslevel)
    {
        $stmt1 = Database::getDb()->prepare("SELECT daily_stresslevel FROM User WHERE UID=:UID LIMIT 1");
        $stmt1->bindValue(":UID", $_SESSION['UID']);
        $stmt1->execute();
        $result = $stmt1->fetch(PDO::FETCH_ASSOC);

       $daily_stresslevel += $result['daily_stresslevel'];

        $stmt2 = Database::getDb()->prepare("UPDATE User SET daily_stresslevel=:daily_stresslevel WHERE UID=:UID LIMIT 1");
        $stmt2->bindValue(":UID", $_SESSION['UID']);
        $stmt2->bindValue(":daily_stresslevel", $daily_stresslevel);

        if ($stmt2->execute()) return true;
        else return false;
    }

    function resetDailyStresslevel($daily_stresslevel){
        $stmt = Database::getDb()->prepare("UPDATE User SET daily_stresslevel=:daily_stresslevel WHERE UID=:UID LIMIT 1");
        $stmt->bindValue(":UID", $_SESSION['UID']);
        $stmt->bindValue(":daily_stresslevel", (int)$daily_stresslevel);

        if ($stmt->execute()) return true;
        else return false;
    }
}