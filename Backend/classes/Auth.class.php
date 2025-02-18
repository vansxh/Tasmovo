<?php

class Auth
{
    /**
     * Function for inserting a user.
     */
    function register($uid, $firstname, $lastname, $username, $password, $mail): bool
    {
        //Check if variables are empty
        if (empty($username) || empty($password) || empty($firstname) || empty($lastname) || empty($mail)) {
            return false;
        } else {
            $stmt = Database::getDb()->prepare("SELECT * FROM User WHERE username = :username");
            $stmt->bindValue(":username", $username);
            $stmt->execute();
            $resultUser = $stmt->rowCount();

            $stmt2 = Database::getDb()->prepare("SELECT * FROM User WHERE mail = :mail");
            $stmt2->bindValue(":mail", $mail);
            $stmt2->execute();
            $resultMail = $stmt2->rowCount();

            //Check if username or mail exists already
            if ($resultUser > 0 || $resultMail > 0) {
                return false;
            } else {
                $rand_string = bin2hex(random_bytes(15));

                //Save in database
                $stmt3 = Database::getDb()->prepare("INSERT INTO User (UID, username, password, mail, first_name, last_name, random_string, isVerified) VALUES(:userid, :username, :pw, :mail, :firstname, :lastname, :random, 0)");
                $stmt3->bindValue(":userid", $uid);
                $stmt3->bindValue(":firstname", $firstname);
                $stmt3->bindValue(":lastname", $lastname);
                $stmt3->bindValue(":username", $username);
                $stmt3->bindValue(":pw", $password);
                $stmt3->bindValue(":mail", $mail);
                $stmt3->bindValue(":random", $rand_string);

                if ($stmt3->execute()) {
                    $to = $mail;
                    $subject = "Verify Email";

                    $link = "https://tasmovo.at/Backend/routes/user/verifyEmail.php?rand=" . $rand_string . "&us=" . $uid;
                    $message = "Please follow this link to verify your account: " . $link;

                    // To send HTML mail, the Content-type header must be set
                    $headers = "MIME-Version: 1.0" . "\r\n";
                    $headers .= "Content-type:text/html;charset=UTF-8" . "\r\n";

                    // Additional headers
                    $headers .= 'From: do-not-reply@tasmovo.at' . "\r\n";
                    $headers .= 'Reply-To: do-not-reply@tasmovo.at' . "\r\n";
                    $headers .= 'X-Mailer: PHP/' . phpversion();

                    // Send the email
                    mail($to, $subject, $message, $headers);
                }

                return true;
            }
        }
    }

    /**
     * Function for checking if you can login.
     */
    function login($usernameORmail, $password): bool
    {
        //Check if variables are empty
        if (empty($usernameORmail) || empty($password)) {
            return false;
        } else {
            $stmt = Database::getDb()->prepare("SELECT * FROM User WHERE username LIKE :usernameORmail && isVerified = 1 OR mail LIKE :usernameORmail && isVerified = 1");
            $stmt->bindValue(":usernameORmail", $usernameORmail);
            $stmt->execute();

            $resultUser = $stmt->rowCount();

            $stmt2 = Database::getDb()->prepare("SELECT * FROM User WHERE username = :usernameORmail && isVerified = 1 OR mail = :usernameORmail && isVerified = 1");
            $stmt2->bindValue(":usernameORmail", $usernameORmail);
            $stmt2->execute();

            $resultPW = $stmt2->fetchAll(PDO::FETCH_ASSOC);
            $hashedPW = $resultPW[0]['password'];

            $hashedPwString = strval($hashedPW);
            $PwString = strval($password);

            //Check if you get the right user and if the password is correct
            if ($resultUser == 1 && password_verify($PwString, $hashedPwString)) {
                return true;
            } else {
                return false;
            }
        }
    }

    //Function for getting the user
    function getUserID($usernameORmail)
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM User WHERE username = :usernameORmail OR mail = :usernameORmail LIMIT 1");
        $stmt->bindValue(":usernameORmail", $usernameORmail);
        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    //Function for getting the user of the current session
    function user()
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM User WHERE UID = :UID");
        $stmt->bindValue(":UID", $_SESSION['UID']);
        $stmt->execute();

        $result = $stmt->rowCount();

        if ($result == 1) {
            return $stmt->fetch(PDO::FETCH_ASSOC);
        } else {
            return null;
        }
    }

    /**
     * Function for checking if a user is logged in.
     */
    function check(): void
    {
        if (!$this->user()) {
            (new Response([
                'error' => true,
                'message' => 'Kein User eingeloggt.'
            ]))->send(HttpCode::FORBIDDEN);
        }
    }

    function updateUser($firstName, $lastName, $username, $stress_limit): bool
    {
        $stmt = Database::getDb()->prepare("UPDATE User SET first_name = :firstName, last_name = :lastName, username = :username, stress_limit = :stressLimit WHERE UID = :UID LIMIT 1");
        $stmt->bindValue(":UID", $_SESSION['UID']);
        $stmt->bindValue(":firstName", $firstName);
        $stmt->bindValue(":lastName", $lastName);
        $stmt->bindValue(":username", $username);
        $stmt->bindValue(":stressLimit", $stress_limit);

        $stmt->execute();

        $result = $stmt->rowCount();

        if ($result == 1) {
            return true;
        } else {
            return false;
        }
    }

    function verifyUser($random, $uid): bool
    {
        $stmt = Database::getDb()->prepare("UPDATE User SET isVerified = 1 WHERE UID = :UID AND random_string = :random LIMIT 1");
        $stmt->bindValue(":UID", $uid);
        $stmt->bindValue(":random", $random);
        $stmt->execute();

        $result = $stmt->rowCount();

        if ($result == 1) {
            return true;
        } else {
            return false;
        }
    }
}
