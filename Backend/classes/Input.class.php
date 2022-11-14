<?php

class Input
{
    private static $input;

    //Decoding the JSON from the input of the frontend
    static function init()
    {
        static::$input = json_decode(file_get_contents("php://input") ?? '{}');
    }

    //Function for checking if the data is empty
    static function isEmpty(): bool
    {
        return empty(static::$input);
    }

    //Function for reading the JSON data
    static function read($name)
    {
        return htmlspecialchars(static::$input->{$name}) ?? null;
    }

}