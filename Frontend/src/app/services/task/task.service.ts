import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Task} from './task';
import {Router} from '@angular/router';
import {AuthenticationService} from '../authentication/authentication.service';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(private http: HttpClient, private router: Router, private authService: AuthenticationService) {
  }

  terminateTask!: Task;

  insertTask(task: Task) {
    return this.http.post('/Backend/routes/task/insertTask.php', task);
  }

  getNextTasks() {
    return this.http.get<Task[]>('/Backend/routes/task/getNextTasks.php');
  }

  getFinishedTasks() {
    return this.http.get<Task[]>('/Backend/routes/task/getFinishedTasks.php');
  }

  deleteTask(TAID: number) {
    return this.http.delete('/Backend/routes/task/deleteTask.php?TAID=' + TAID);
  }

  editTask(TAID: number) {
    this.router.navigate(['/insert-task/' + TAID]);
  }

  addTask() {
    this.router.navigate(['/insert-task']);
  }

  getTask(TAID: number) {
    return this.http.get('/Backend/routes/task/getTask.php?TAID=' + TAID);
  }

  getTasksByDeadline(deadline: string) {
    return this.http.get('/Backend/routes/task/getTasksByDeadline.php?deadline=' + deadline);
  }

  changeToDayView(date: string) {
    this.router.navigate(['/calendar-detail/' + date]);
  }

  updateTask(task: Task) {
    return this.http.put('/Backend/routes/task/updateTask.php', task);
  }

  finishTask(task: Task) {
    return this.http.put('/Backend/routes/task/finishTask.php', task);
  }

  getCategoryTasks(CAID: number) {
    return this.http.get('/Backend/routes/task/getCategoryTasks.php?CAID=' + CAID);
  }

  getSingleTasks() {
    return this.http.get('/Backend/routes/task/getSingleTasks.php');
  }

  getAllTasks() {
    return this.http.get('/Backend/routes/task/getAllTasks.php');
  }
}
