import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Task } from './task';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, private router: Router) { }

  insertTask(task: Task){
    return this.http.post('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/insertTask.php', task);
  }

  getNextTasks(userID: number) {
    return this.http.get<Task[]>('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/getNextTasks.php?userID='+ userID);
  }

  getfinishedTasks(userID: number) {
    return this.http.get<Task[]>('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/getFinishedTasks.php?userID='+ userID);
  }

  deleteTask(TAID: number){
    return this.http.delete<Task[]>('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/deleteTask.php?TAID='+ TAID);
  }

  editTask(TAID: number){
    this.router.navigate(['/insert-task/' + TAID]);
  }

  getTask(TAID: number) {
    return this.http.get<Task>('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/getTask.php?TAID='+ TAID);
  }

  updateTask(task: Task) {
    return this.http.put('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/updateTask.php', task);
  }

  finishTask(task: Task) {
    return this.http.put('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/finishTask.php', task);
  }

}
