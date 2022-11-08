import { Injectable } from '@angular/core';
import {HttpClient} from '@angular/common/http';
import { Task } from './task';
import { Router } from '@angular/router';
import { AuthenticationService } from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, private router: Router, private authService: AuthenticationService) { }

  insertTask(task: Task, created_by: string){
    return this.http.post('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/insertTask.php', {task, created_by});
  }

  getNextTasks(userID: string) {
    return this.http.get<Task[]>('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/getNextTasks.php?userID='+ userID);
  }

  getfinishedTasks(userID: string) {
    return this.http.get<Task[]>('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/getFinishedTasks.php?userID='+ userID);
  }

  deleteTask(TAID: number){
    return this.http.delete('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/deleteTask.php?TAID='+ TAID);
  }

  editTask(TAID: number){
    this.router.navigate(['/insert-task/' + TAID]);
  }

  addTask(){
    this.router.navigate(['/insert-task']);
  }

  getTask(TAID: number) {
    return this.http.get('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/getTask.php?TAID='+ TAID);
  }

  updateTask(task: Task, loggedIn: string) {
    return this.http.put('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/updateTask.php', {task, loggedIn});
  }

  finishTask(task: Task) {
    return this.http.put('http://flock-1902.students.fhstp.ac.at/Backend/routes/task/finishTask.php', task);
  }

}
