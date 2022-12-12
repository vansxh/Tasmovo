import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Timer} from "./Timer";

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(private http: HttpClient) { }

  getRewards(){
    return this.http.get('Backend/routes/reward/getAllRewards.php');
  }

  createTimer(timer: Timer){
    return this.http.post('Backend/routes/timer/createTimer.php', timer);
  }

  getTimer(){
    return this.http.get('Backend/routes/timer/getTimer.php');
  }

}
