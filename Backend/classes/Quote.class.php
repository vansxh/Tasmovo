<?php

class Quote
{


    function getQuote()
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Quote ORDER BY RAND() LIMIT 1");

        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return json_encode($result);
    }

}