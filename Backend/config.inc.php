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


define("DB_HOST", "mysqlsvr77.world4you.com");
define("DB_NAME", "1374430db1");
define("DB_USER", "sql4695684");
define("DB_PW", "ev+vpaa4");