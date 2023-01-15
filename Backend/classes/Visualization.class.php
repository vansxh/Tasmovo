<?php

class Visualization
{

    function getTaskExpenses($userID): bool|array
    {
        $stmt = Database::getDb()->prepare("SELECT CAST(end_date as DATE) as 'date', expenseID, COUNT(TAID) as 'number' FROM Task WHERE created_by=:userID AND end_date BETWEEN DATE_SUB(NOW(), INTERVAL 7 DAY) and NOW() GROUP BY CAST(end_date as DATE), expenseID ORDER BY date ASC");
        $stmt->bindValue(":userID", $userID);
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }
}