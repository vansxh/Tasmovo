import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class TimerService {

  constructor(private http: HttpClient) { }

  getRewards(){
    return this.http.get('Backend/routes/reward/getAllRewards.php');
  }

}
