<?php

class Category
{
    // function for inserting a new category
    function insertCategory($cName, $userID, $parent_categoryID)
    {
        $stmt = Database::getDb()->prepare("INSERT INTO Category(category_name, userID, parent_categoryID) VALUES(:cName, :userID, :parent_categoryID)");
        $stmt->bindValue(":cName", $cName);
        $stmt->bindValue(":userID", $userID);
        $stmt->bindValue(":parent_categoryID", $parent_categoryID);

        if ($stmt->execute()) return true;
        else return false;
    }

    // function for getting one category via ID
    function getCategory($CAID)
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Category WHERE CAID=:CAID LIMIT 1");
        $stmt->bindValue(":CAID", $CAID);

        $stmt->execute();

        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        return $result;
    }

    // function for getting all categories of a user
    function getCategoriesByUser($userID)
    {
        $stmt = Database::getDb()->prepare("SELECT *,(SELECT COUNT(t.TAID) from Task as t WHERE t.categoryID = c.CAID) as 'numberOfTasks', (SELECT COUNT(t.TAID) from Task as t WHERE t.categoryID = c.CAID AND t.statusID = 2) as 'numberOfFinished' FROM Category as c WHERE c.userID=:userID");
        $stmt->bindValue(":userID", $userID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

    // function for deleting a category via ID
    function deleteCategory($CAID)
    {
        $stmt = Database::getDb()->prepare("DELETE FROM Category WHERE CAID=:CAID LIMIT 1");
        $stmt->bindValue(":CAID", $CAID);
        if ($stmt->execute()) return true;
        else return false;
    }

    // function for updating a category via ID
    function updateCategory($CAID, $cName, $parent_categoryID)
    {
        $stmt = Database::getDb()->prepare("UPDATE Category SET category_name=:cName, parent_categoryID=:parent_categoryID WHERE CAID=:CAID LIMIT 1");
        $stmt->bindValue(":CAID", $CAID);
        $stmt->bindValue(":cName", $cName);
        $stmt->bindValue(":parent_categoryID", $parent_categoryID);

        if ($stmt->execute()) return true;
        else return false;
    }

    function getAllCategories($userID)
    {
        $stmt = Database::getDb()->prepare("SELECT * FROM Category as c WHERE c.userID=:userID");
        $stmt->bindValue(":userID", $userID);

        $stmt->execute();

        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return $result;
    }

}