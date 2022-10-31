import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task/task.service';
import { Task } from 'src/app/services/task/task';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public tasks!: Task[];

  constructor(private taskService: TaskService) { }

  ngOnInit(): void {
    this.taskService.getNextTasks().subscribe((data: Task[]) => {
      this.tasks = data;
      console.log(this.tasks);
    });
  }

  deleteTask(task: Task): void{
    this.taskService.deleteTask(task.TAID).subscribe(data => {
      this.tasks = this.tasks.filter(t => t !== task);
    });
  }

}
