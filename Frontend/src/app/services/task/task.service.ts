import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Task } from './task';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient) { }

  insertTask(task: Task){
    return this.http.post('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/insertTask.php', task);
  }

  getNextTasks() {
    return this.http.get<Task[]>('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/getNextTasks.php?userID=1');
  }

  deleteTask(TAID: number){
    return this.http.delete<Task[]>('http://flock-1902.students.fhstp.ac.at/Backend/delete.php?TAID='+ TAID);
  }

}
