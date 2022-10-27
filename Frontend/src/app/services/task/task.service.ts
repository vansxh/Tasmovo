import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  insertTask(task: Task){
    return this.http.post('http://flock-1902.students.fhstp.ac.at/Backend/insert.php', task);
  }
}
