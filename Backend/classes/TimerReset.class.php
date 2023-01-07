<?php

class TimerReset{

    const lastResetDate = "last_reset_date";

    static function resetDailyStress(){
        $today = date("Y-m-d", time());

        $stmt = Database::getDb()->prepare("SELECT * FROM Settings WHERE record = :record");
        $stmt->bindValue(":record", self::lastResetDate);
        $stmt->execute();
        $result = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($result['value'] >= $today){
            return;
        }else{
            $setting = Database::getDb()->prepare("UPDATE Settings SET value = :today WHERE record = :record");
            $setting->bindValue(":today", $today);
            $setting->bindValue(":record", self::lastResetDate);
            $setting->execute();

            $reset = Database::getDb()->prepare("UPDATE User SET daily_stresslevel = 0");
            $reset->execute();
        }


    }
}