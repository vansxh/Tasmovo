<?php
/**
 * @var Auth $auth
 */
//Required file
require('../../bootstrap.inc.php');

//Check if user is logged in
$auth->check();

$timer = new Timer();

if ($timer->deleteTimer()) {
    (new Response([
        'error' => false,
        'message' => 'Timer erfolgreich gelöscht.'
    ]))->send(HttpCode::OKAY);
} else {
    (new Response([
        'error' => true,
        'message' => 'Timer löschen fehlgeschlagen.'
    ]))->send(HttpCode::BAD_REQUEST);
}