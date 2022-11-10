<?php

require('../../bootstrap.inc.php');

if ($input->isEmpty()) die();

if ($auth->login($input->read('username'), $input->read('password'))) {
    $result = $auth->getUserID($input->read('username'));

    $_SESSION['loggedIn'] = true;
    $_SESSION['UID'] = $result['UID'];

    (new Response([
        'message' => 'Du hast dich erfolgreich eingeloggt.',
        'data' => $result
    ]))->send(HttpCode::OKAY);

} else {
    unset($_SESSION['loggedIn']);

    (new Response([
        'error' => true,
        'message' => 'Login fehlgeschlagen',
    ]))->send(HttpCode::BAD_REQUEST);
}