<?php

class Auth
{
    private $db;

    function __construct()
    {

        try {
            $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PW);
        } catch (PDOException $e) {
            //echo $e;
            echo "Verbindung fehlgeschlagen";
            die();
        }
    }

    function register($uid, $firstname, $lastname, $username, $password, $mail)
    {
        if (empty($username) || empty($password) || empty($firstname) || empty($lastname) || empty($mail)) {
            //Felder sind leer
            //echo ("Felder sind leer!");
            return false;
        } else {
            $stmt = $this->db->prepare("SELECT * FROM User WHERE username = :username");
            $stmt->bindValue(":username", $username);
            $stmt->execute();
            $resultUser = $stmt->rowCount();

            $stmt2 = $this->db->prepare("SELECT * FROM User WHERE mail = :mail");
            $stmt2->bindValue(":mail", $mail);
            $stmt2->execute();
            $resultMail = $stmt2->rowCount();

            if ($resultUser > 0 || $resultMail > 0) {
                //User gibt es schon
                //echo("User gibt es bereits");
                return false;
            } else {
                //In DB speichern
                $stmt3 = $this->db->prepare("INSERT INTO User (UID, username, password, mail, first_name, last_name) VALUES(:userid, :username, :pw, :mail, :firstname, :lastname)");
                $stmt3->bindValue(":userid", $uid);
                $stmt3->bindValue(":firstname", $firstname);
                $stmt3->bindValue(":lastname", $lastname);
                $stmt3->bindValue(":username", $username);
                $stmt3->bindValue(":pw", $password);
                $stmt3->bindValue(":mail", $mail);
                $stmt3->execute();
                return true;
            }
        }
    }

    function login($usernameORmail, $password)
    {
        if (empty($usernameORmail) || empty($password)) {
            //Felder sind leer
        } else {
            $stmt = $this->db->prepare("SELECT * FROM User WHERE username LIKE :usernameORmail OR mail LIKE :usernameORmail");
            $stmt->bindValue(":usernameORmail", $usernameORmail);
            $stmt->execute();

            $resultUser = $stmt->rowCount();

            $stmt2 = $this->db->prepare("SELECT * FROM User WHERE username = :usernameORmail OR mail = :usernameORmail");
            $stmt2->bindValue(":usernameORmail", $usernameORmail);
            $stmt2->execute();

            $resultPW = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            $hashedPW = $resultPW[0]['password'];

            /*echo "<pre>";
            print_r($resultPW);
            echo "</pre>";*/

            $hashedPwString = strval($hashedPW);
            $PwString = strval($password);

            //print_r($hashedPwString);
            //print_r($PwString);

            if ($resultUser > 0 && $resultUser < 2 && password_verify($PwString, $hashedPwString)) {
                //Login erfolgreich
                return true;
            } else {
                //Login fehlgeschlagen
                return false;
            }
        }
    }

    function getUserID($usernameORmail)
    {
        $stmt = $this->db->prepare("SELECT * FROM User WHERE username = :usernameORmail OR mail = :usernameORmail LIMIT 1");
        $stmt->bindValue(":usernameORmail", $usernameORmail);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return json_encode($result);
    }
}