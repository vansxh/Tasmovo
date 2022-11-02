import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../services/task/task.service';
import { Task } from 'src/app/services/task/task';
import { QuoteService } from 'src/app/services/quote/quote.service';
import { Quote } from 'src/app/services/quote/quote';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public openTasks!: Task[];
  public finishedTasks!: Task[];
  public dailyQuote!: Quote;

  constructor(private taskService: TaskService, private quoteService: QuoteService) { }

  ngOnInit(): void {

    this.loadTasks();

    this.quoteService.getQuote().subscribe((data: Quote) => {
      this.dailyQuote = data;
    });

  }

  loadTasks(): void {
    this.taskService.getNextTasks(1).subscribe((data: Task[]) => {
      this.openTasks = data;
    });

    this.taskService.getfinishedTasks(1).subscribe((data: Task[]) => {
      this.finishedTasks = data;
      console.log(this.finishedTasks);
    });
  }

  deleteTask(task: Task): void{
    this.taskService.deleteTask(task.TAID).subscribe(data => {
      this.loadTasks();
    });
  }

  editTask(task: Task): void{
    this.taskService.editTask(task.TAID);
  }

  finishTask(task: Task): void {
    this.taskService.finishTask(task).subscribe(data => {
      this.loadTasks();
    });;
  }

}
