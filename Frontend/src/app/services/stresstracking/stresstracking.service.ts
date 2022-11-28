import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class StresstrackingService {

  constructor(private http: HttpClient) {
  }

  getWeeklyAvg() {
    return this.http.get('/Backend/routes/stresstracking/getWeeklyAvg.php');
  }

}


