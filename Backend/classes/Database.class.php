<?php

/**
 * The database singleton
 */
class Database
{
    private static PDO $db;

    /**
     * Function for initializing the database.
     */
    static function init(): void
    {
        try {
            static::$db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PW);
        } catch (PDOException $e) {
            //echo $e;
            echo "Connection failed";
            die();
        }
    }

    static function getDb(): PDO
    {
        return static::$db;
    }
}