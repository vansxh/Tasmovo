<?php

class Category
{
    private $db;

    function __construct()
    {

        try {
            $this->db = new PDO('mysql:host=' . DB_HOST . ';dbname=' . DB_NAME, DB_USER, DB_PW);
        } catch (PDOException $e) {
            echo "Verbindung fehlgeschlagen";
            die();
        }
    }

    function insertCategory($cName, $userID/*, $parent_categoryID, $gid*/)
    {
        $stmt = $this->db->prepare("INSERT INTO Category(category_name, userID) VALUES(:cName, :userID)");
        $stmt->bindValue(":cName", $cName);
        $stmt->bindValue(":userID", $userID);
        /*$stmt->bindValue(":parent_categoryID", $parent_categoryID);
        $stmt->bindValue(":gid", $gid);*/

        if ($stmt->execute()) return true;
        else return false;
    }

    function getCategory($CAID)
    {
        $stmt = $this->db->prepare("SELECT * FROM Category WHERE CAID=:CAID LIMIT 1");
        $stmt->bindValue(":CAID", $CAID);

        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return json_encode($result);
    }

    function getCategoriesByUser($userID)
    {
        $stmt = $this->db->prepare("SELECT * FROM Category WHERE userID=:userID LIMIT 2");
        $stmt->bindValue(":userID", $userID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return json_encode($result);
    }

    function deleteCategory($CAID)
    {
        $stmt = $this->db->prepare("DELETE FROM Category WHERE CAID=:CAID LIMIT 1");
        $stmt->bindValue(":CAID", $CAID);
        if ($stmt->execute()) return true;
        else return false;
    }

    function updateCategory($CAID, $cName/*, $parent_categoryID, $gid*/)
    {
        $stmt = $this->db->prepare("UPDATE Category SET category_name=:cName WHERE CAID=:CAID LIMIT 1");
        $stmt->bindValue(":CAID", $CAID);
        $stmt->bindValue(":cName", $cName);
        /*$stmt->bindValue(":parent_categoryID", $parent_categoryID);
        $stmt->bindValue(":gid", $gid);*/

        if ($stmt->execute()) return true;
        else return false;
    }

}