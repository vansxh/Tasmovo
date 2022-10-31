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

  public tasks!: Task[];
  public dailyQuote!: Quote;

  constructor(private taskService: TaskService, private quoteService: QuoteService) { }

  ngOnInit(): void {

    this.taskService.getNextTasks(1).subscribe((data: Task[]) => {
      this.tasks = data;
    });

    this.quoteService.getQuote().subscribe((data: Quote) => {
      this.dailyQuote = data;
    });

  }

  deleteTask(task: Task): void{
    this.taskService.deleteTask(task.TAID).subscribe(data => {
      this.tasks = this.tasks.filter(t => t !== task);
    });
  }

  editTask(task: Task): void{
    this.taskService.editTask(task.TAID);
  }

}
