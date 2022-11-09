<?php

class Database{

    private static $db;

    static function init()
    {

        try {
           static::$db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PW);
        } catch (PDOException $e) {
            //echo $e;
            echo "Verbindung fehlgeschlagen";
            die();
        }
    }
    static function getDb(){
        return static::$db;
    }
}