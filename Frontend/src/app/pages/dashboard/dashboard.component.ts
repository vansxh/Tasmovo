import {Component, OnInit} from '@angular/core';
import {TaskService} from '../../services/task/task.service';
import {Task} from 'src/app/services/task/task';
import {QuoteService} from 'src/app/services/quote/quote.service';
import {Quote} from 'src/app/services/quote/quote';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public openTasks!: Task[];
  public finishedTasks!: Task[];
  public dailyQuote!: Quote;

  constructor(private taskService: TaskService, private quoteService: QuoteService, private authService: AuthenticationService) {
  }

  ngOnInit(): void {

    this.loadTasks();

    this.quoteService.getQuote().subscribe(
      (data: any = []) => {
          if (data['error'] == false) {
            this.dailyQuote = <Quote>data['data'];
          }
    });

  }

  loadTasks(): void {
    this.taskService.getNextTasks().subscribe(
      (data: any = []) => {
        if (data['error'] == false) {
          this.openTasks = <Task[]>data['data'];
          for (let t of this.openTasks) {
            let deadline = t.deadline.split(" ");
            t.deadlineDay = deadline[0];
            t.deadlineHour = deadline[1].slice(0, -3);
          }
        } else alert("Tasks konnten nicht geladen werden!")
      },
        (error) => {
          if(error.status == 404) alert("Tasks konnten nicht geladen werden!");
        });

    this.taskService.getFinishedTasks().subscribe(
      (data: any = []) => {
        if (data['error'] == false) {
          this.finishedTasks = <Task[]>data['data'];
        } else alert("Tasks konnten nicht geladen werden!")
      },
    (error) => {
      if(error.status == 404) alert("Tasks konnten nicht geladen werden!");
    });
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.TAID).subscribe(
      (data: any = []) => {
        if (data['error'] == false) this.loadTasks();
        else alert("Task konnte nicht gelöscht werden!")
      },
      (error) => {

        if(error.status == 404) alert("Task konnte nicht gelöscht werden!");
    });
  }

  editTask(task: Task): void {
    this.taskService.editTask(task.TAID);
  }

  addTask(): void {
    this.taskService.addTask();
  }

  finishTask(task: Task): void {
    this.taskService.finishTask(task).subscribe(data => {
      if (data != null) this.loadTasks();
      else alert("Task konnte nicht abgeschlossen werden!")
    });
    ;
  }

}
