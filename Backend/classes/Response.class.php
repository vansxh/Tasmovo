<?php

interface HttpCode
{
    const OKAY = 200;
    const BAD_REQUEST = 400;
    const FORBIDDEN = 403;
    const NOT_FOUND = 404;
}

class Response
{
    public function __construct(array $data)
    {
        $this->data = array_merge([
            'error' => false,
            'message' => '',
            'data' => null
        ], $data);
    }

    public function send($code = 200)
    {
        echo json_encode($this->data);
        http_response_code($code);
        exit;
    }
}