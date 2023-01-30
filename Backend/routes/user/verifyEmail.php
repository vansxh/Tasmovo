<?php
/**
 * @var Auth $auth
 */
//Required file
require('../../bootstrap.inc.php');

if (empty($_GET['rand']) || empty($_GET['us'])) {
    exit();
}

if ($auth->verifyUser($_GET['rand'], $_GET['us'])) {
    header("Location: www.tasmovo.at/login");
} else {
    exit();
}


