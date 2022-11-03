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
      if(data != null) {
        this.openTasks = data;
        for(let t of this.openTasks) {
          let deadline = t.deadline.split(" ");
          t.deadlineDay = deadline[0];
          t.deadlineHour = deadline[1].slice(0, -3);
        }
      } else alert("Tasks konnten nicht geladen werden!")
    });

    this.taskService.getfinishedTasks(1).subscribe((data: Task[]) => {
      if(data != null) this.finishedTasks = data;
      else alert("Tasks konnten nicht geladen werden!")
    });
  }

  deleteTask(task: Task): void{
    this.taskService.deleteTask(task.TAID).subscribe(data => {
      if(data != null) this.loadTasks();
      else alert("Task konnte nicht gelöscht werden!")
    });
  }

  editTask(task: Task): void{
    this.taskService.editTask(task.TAID);
  }

  finishTask(task: Task): void {
    this.taskService.finishTask(task).subscribe(data => {
      if(data != null) this.loadTasks();
      else alert("Task konnte nicht abgeschlossen werden!")
    });;
  }

}
