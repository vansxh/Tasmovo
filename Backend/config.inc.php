<?php
//Needed for allowing CORS
if ($_SERVER['REQUEST-METHOD'] === 'OPTIONS') {
    http_response_code(200);
    die();
}

header("Access-Control-Allow-Origin: http://localhost:4200");
header("Access-Control-Allow-Credentials: true");
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Access-Control-Max-Age: 600');

//Details for the flock (database)
define("DB_HOST", "mysql5");
define("DB_NAME", "db_flock-1902_1");
define("DB_USER", "flock-1902");
define("DB_PW", "r_TaA3LBaBev");