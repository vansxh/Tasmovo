<?php
//Required file
require('../../bootstrap.inc.php');

//Check if Input is empty
if (Input::isEmpty()) {
    (new Response([
        'error' => true,
        'message' => 'Eingabefelder sind leer.'
    ]))->send(HttpCode::BAD_REQUEST);
}