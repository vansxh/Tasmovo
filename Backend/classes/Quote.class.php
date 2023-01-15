<?php

class Quote
{

    // function for getting one random quote
    function getQuote(): bool|array
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Quote");
        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

}