import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Task} from "../task/task";

@Injectable({
  providedIn: 'root'
})
export class StresstrackingService {

  constructor(private http: HttpClient) {
  }

  getWeeklyAvg() {
    return this.http.get('/Backend/routes/stresstracking/getWeeklyAvg.php');
  }

  getDailyStresslevel() {
    return this.http.get('/Backend/routes/stresstracking/getDailyStresslevel.php');
  }

  getStresslimit() {
    return this.http.get('/Backend/routes/stresstracking/getStresslimit.php');
  }

  updateDailyStresslevel(task: Task) {
    return this.http.put('/Backend/routes/stresstracking/updateDailyStresslevel.php', task);
  }

  resetDailyStresslevel(stresslevel: number) {
    return this.http.put('/Backend/routes/stresstracking/resetDailyStresslevel.php', stresslevel);
  }

}


