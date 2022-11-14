<?php

class Input
{
    //Decoding the JSON from the input of the frontend
    public function __construct()
    {
        $this->data = json_decode(file_get_contents("php://input") ?? '{}');
    }

    //Function for checking if the data is empty
    public function isEmpty(): bool
    {
        return empty($this->data);
    }

    //Function for reading the JSON data
    public function read($name)
    {
        return $this->data->{$name} ?? null;
    }


}