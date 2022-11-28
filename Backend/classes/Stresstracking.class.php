<?php

class Stresstracking
{
    function getWeeklyAvg($today){
        //SELECT AVG(t.stress_factor) AS 'Average' FROM User AS u INNER JOIN Task AS t ON u.UID = t.created_by WHERE u.UID = '292e9f36-b177-4e31-9abb-2dfd54aa1904' AND t.end_date >= ('2022-11-28'-7) AND t.end_date <= '2022-11-28'
        //SELECT AVG(t.stress_factor) AS 'Average' FROM User AS u INNER JOIN Task AS t ON u.UID = t.created_by WHERE u.UID = '292e9f36-b177-4e31-9abb-2dfd54aa1904' AND t.end_date >= DATE_SUB("2022-11-28", INTERVAL 7 DAY) AND t.end_date <= '2022-11-28'
        $stmt = Database::getDb()->prepare("SELECT AVG(t.stress_factor) AS 'Average' FROM User AS u INNER JOIN Task AS t ON u.UID = t.created_by WHERE u.UID = :UID AND t.end_date >= DATE_SUB(:today, INTERVAL 7 DAY) AND t.end_date <= :today");
        $stmt->bindValue(":UID", $_SESSION['UID']);
        $stmt->bindValue(":today", $today);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }
}