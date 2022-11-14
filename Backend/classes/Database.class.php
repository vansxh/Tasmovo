<?php

class Database
{
    private static $db;

    //Function for initializing the database
    static function init()
    {
        try {
            static::$db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PW);
        } catch (PDOException $e) {
            //echo $e;
            echo "Connection failed";
            die();
        }
    }

    //Getter for the database
    static function getDb()
    {
        return static::$db;
    }
}