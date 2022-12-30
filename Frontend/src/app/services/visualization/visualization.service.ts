import { Injectable } from '@angular/core';
import {Task} from "../task/task";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class VisualizationService {

  constructor(private http: HttpClient) { }

  getTaskExpenses() {
    return this.http.get('/Backend/routes/visualization/getTaskExpenses.php');
  }

}
