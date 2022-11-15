<?php

class Category
{

    function insertCategory($cName, $userID/*, $parent_categoryID, $gid*/)
    {
        $stmt = Database::getDb()->prepare("INSERT INTO Category(category_name, userID) VALUES(:cName, :userID)");
        $stmt->bindValue(":cName", $cName);
        $stmt->bindValue(":userID", $userID);
        /*$stmt->bindValue(":parent_categoryID", $parent_categoryID);
        $stmt->bindValue(":gid", $gid);*/

        if ($stmt->execute()) return true;
        else return false;
    }

    function getCategory($CAID)
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Category WHERE CAID=:CAID LIMIT 1");
        $stmt->bindValue(":CAID", $CAID);

        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    function getCategoriesByUser($userID)
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Category WHERE userID=:userID LIMIT 2");
        $stmt->bindValue(":userID", $userID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    function deleteCategory($CAID)
    {
        $stmt = Database::getDb()->prepare("DELETE FROM Category WHERE CAID=:CAID LIMIT 1");
        $stmt->bindValue(":CAID", $CAID);
        if ($stmt->execute()) return true;
        else return false;
    }

    function updateCategory($CAID, $cName/*, $parent_categoryID, $gid*/)
    {
        $stmt = Database::getDb()->prepare("UPDATE Category SET category_name=:cName WHERE CAID=:CAID LIMIT 1");
        $stmt->bindValue(":CAID", $CAID);
        $stmt->bindValue(":cName", $cName);
        /*$stmt->bindValue(":parent_categoryID", $parent_categoryID);
        $stmt->bindValue(":gid", $gid);*/

        if ($stmt->execute()) return true;
        else return false;
    }

}