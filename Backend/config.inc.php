<?php

if($_SERVER['REQUEST-METHOD'] === 'OPTIONS'){
    http_response_code(200);
    die();
}

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Access-Control-Max-Age: 600');
session_start();

//session_name('pfuiteifi');

require('functions.inc.php');

/*define("DB_HOST","mysql5");
define("DB_NAME","db_mt201064_1");
define("DB_USER","mt201064");
define("DB_PW","4W8ETMCwJpym");*/

define("DB_HOST","mysql5");
define("DB_NAME","db_flock-1902_1");
define("DB_USER","flock-1902");
define("DB_PW","r_TaA3LBaBev");