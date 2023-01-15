<?php

class Input
{
    private static $input;

    //Decoding the JSON from the input of the frontend
    /**
     * Function for decoding the JSON from input fields.
     */
    static function init(): void
    {
        static::$input = json_decode(file_get_contents("php://input") ?? '{}');
    }

    /**
     * Function for checking if the input is empty.
     */
    static function isEmpty(): bool
    {
        return empty(static::$input);
    }

    /**
     * Function for reading the JSON data.
     */
    static function read($name): ?string
    {
        if(static::$input->{$name} == '' || static::$input->{$name} == null) return null;
        return htmlspecialchars(static::$input->{$name}) ?? null;
    }

}