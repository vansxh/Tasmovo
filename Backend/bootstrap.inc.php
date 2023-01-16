<?php

//Required files
require('config.inc.php');

//Start sessions for access
session_start();

//Require the classes in the classes-folder
spl_autoload_register(function ($class) {
    require_once 'classes/' . $class . '.class.php';
});

//Initialize the database
Database::init();
mb_internal_encoding('UTF-8');
mb_http_output('UTF-8');

//Check if there is a reset
TimerReset::resetDailyStress();

//Declaring objects
$auth = new Auth();
Input::init();
