<?php

//Interface for the response codes
use JetBrains\PhpStorm\NoReturn;

interface HttpCode
{
    const OKAY = 200;
    const CREATED = 201;
    const BAD_REQUEST = 400;
    const FORBIDDEN = 403;
    const NOT_FOUND = 404;
}

class Response
{
    //array for the response
    public function __construct(array $data)
    {
        $this->data = array_merge([
            'error' => false,
            'message' => '',
            'data' => null
        ], $data);
    }

    //Function for encoding the array and sending a response code
    /**
     * Function for sending JSON encoded data with a http response code.
     */
    #[NoReturn] public function send($code = 200): void
    {
        echo json_encode($this->data);
        http_response_code($code);
        exit;
    }
}