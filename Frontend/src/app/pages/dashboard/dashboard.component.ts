import {Component, OnInit} from '@angular/core';
import {TaskService} from '../../services/task/task.service';
import {Task} from 'src/app/services/task/task';
import {QuoteService} from 'src/app/services/quote/quote.service';
import {Quote} from 'src/app/services/quote/quote';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {GeneralService} from "../../services/general/general.service";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PopupFinishComponent} from "../../popups/popup-finish/popup-finish.component";
import {StresstrackingService} from "../../services/stresstracking/stresstracking.service";
import {PopupReminderComponent} from "../../popups/popup-reminder/popup-reminder.component";
import {PopupAddComponent} from "../../popups/popup-add/popup-add.component";
import {Router} from '@angular/router';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public openTasks!: Task[];
  public finishedTasks!: Task[];
  public dailyQuote!: Quote;
  dailyStresslevel!: number;
  stressLimit!: number;

  constructor(private router: Router, private taskService: TaskService, private quoteService: QuoteService, private authService: AuthenticationService, private general: GeneralService, private dialog: MatDialog, private stress: StresstrackingService) {
  }

  ngOnInit(): void {
    // load next and finished tasks
    this.loadTasks();

    // get random quote
    this.quoteService.getQuote().subscribe(
      (data: any = []) => {
          this.dailyQuote = <Quote>data['data'];
      },
      (error: any = []) => {
          if(error['error']['message']) {
            alert(error['error']['message']);
            return;
          }
          this.general.errorResponse(error['status']);
      });

    this.getDailyStresslevel();
    this.getStresslimit();
    //this.onBreakOpen();

    document.getElementsByTagName("h1")[0].innerText = "";

  }

  loadTasks(): void {
    // get  next tasks
    this.taskService.getNextTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.openTasks = <Task[]>data['data'];
        // fix deadline for input form
        for (let t of this.openTasks) {
          let deadline = t.deadline.split(" ");
          t.deadlineDay = deadline[0];
          //t.deadlineHour = deadline[1].slice(0, -3);
        }
      },
      (error: any = []) => {
          if(error['error']['message']) {
            alert(error['error']['message']);
            return;
          }
          this.general.errorResponse(error['status']);
        });

    this.taskService.getFinishedTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.finishedTasks = <Task[]>data['data'];
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
    });
  }

  deleteTask(task: Task): void {
    this.taskService.deleteTask(task.TAID).subscribe(
      (data: any = []) => {
        // update view if deleting was successful
        this.loadTasks();
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
    });
  }

  editTask(task: Task): void {
    this.taskService.editTask(task.TAID);
  }

  detailsTask(task: Task): void {
    this.taskService.detailsTask(task.TAID);
  }

  addTask(): void {
    this.taskService.addTask();
  }

  finishTask(task: Task): void {
    this.taskService.terminateTask = task;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupFinishComponent, dialogConfig);
  }

  getDailyStresslevel() {
    this.stress.getDailyStresslevel().subscribe((data: any = []) => {
      //console.log(data['data']['0']['Average']);
      this.dailyStresslevel = data['data']['daily_stresslevel'];
      if (this.dailyStresslevel == 10.00) {
        this.dailyStresslevel = 10;
      } else if (this.dailyStresslevel == 0.00 || this.dailyStresslevel == null) {
        this.dailyStresslevel = 0;
      }
      //console.log(this.dailyStresslevel);
    }, (error: any = []) => {
      if (error['error']['message']) {
        alert(error['error']['message']);
        return;
      }
      this.general.errorResponse(error['status']);
    });
  }

  getStresslimit() {
    this.stress.getStresslimit().subscribe((data: any = []) => {
      this.stressLimit = data['data']['stress_limit'];
      //console.log((this.dailyStresslevel/this.stressLimit)*100);
    }, (error: any = []) => {
      if (error['error']['message']) {
      alert(error['error']['message']);
      return;
    }
    this.general.errorResponse(error['status']);
    });
  }

  break(): void {
    this.onBreakOpen();
  }

  onBreakOpen(){
    //if (this.getDailyStresslevel() >= this.getStresslimit()) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      this.dialog.open(PopupReminderComponent, dialogConfig);
    //}
  }

  myCategories() {
    this.router.navigate(['/my-categories']);
  }

  myDay() {
    this.router.navigate(['/my-day']);
  }
}
