<?php

class Reward
{
    function getAllRewards(){
       $stmt = Database::getDb()->prepare("SELECT * FROM Reward");
       $stmt->execute();

       $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

       return $result;
    }
}