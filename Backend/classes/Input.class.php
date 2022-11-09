<?php

class Input
{
    //private $data;

    public function __construct()
    {
        $this->data = json_decode(file_get_contents("php://input") ?? '{}');
    }

    public function isEmpty(): bool {
        return empty($this->data);
    }

    public function read($name){
        return $this->data[$name] ?? null;
    }


}