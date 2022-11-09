<?php

require('config.inc.php');
require('functions.inc.php');
session_start();

spl_autoload_register(function ($class) {
    require_once 'classes/' . $class . '.class.php';
});

Database::init();
$auth = new Auth();
$input = new Input();
