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
import {Router} from '@angular/router';
import {MyDayService} from "../../services/my-day/my-day.service";
import {DatePipe} from "@angular/common";
import {faCirclePlus} from '@fortawesome/free-solid-svg-icons';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})

export class DashboardComponent implements OnInit {

  public openTasks!: Task[];
  public plannedTasks!: Task[];
  public dailyQuote!: Quote;
  dailyStresslevel!: number;
  stressLimit!: number;

  faCircleX = faCirclePlus;

  constructor(private datePipe: DatePipe, private myDayService: MyDayService, private router: Router, private taskService: TaskService, private quoteService: QuoteService, private authService: AuthenticationService, private general: GeneralService, private dialog: MatDialog, private stress: StresstrackingService) {
  }

  ngOnInit(): void {
    // modify heading
    let h1 = document.getElementsByTagName("h1");
    for (let i = 0; i < h1.length; i++) {
      h1[i].innerText = "";
    }

    // load next tasks
    this.loadTasks();

    this.getQuote();
    this.getDailyStresslevel();
    this.getStresslimit();
  }

  getQuote() {
    // get random quote
    this.quoteService.getQuote().subscribe(
      (data: any = []) => {
        this.dailyQuote = <Quote>data['data'];
      },
      (error: any = []) => {
        if (error['error']['message']) {
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  loadTasks(): void {
    // get planned tasks
    this.taskService.getPlannedTasks(this.datePipe.transform(new Date(), 'yyyy-MM-dd', 'de-AT') || '').subscribe(
      (data: any = []) => {
        // get tasks from data
        this.plannedTasks = <Task[]>data['data'];
        this.plannedTasks.forEach((task) => {
          task.start_time = task.start_time.slice(0, -3);
          task.end_time = task.end_time.slice(0, -3);
          task.task_name = this.general.decodeHtmlCharCodes(task.task_name);
          task.notes = this.general.decodeHtmlCharCodes(task.notes);
          task.category = this.general.decodeHtmlCharCodes(task.category);
        });
      },
      (error: any = []) => {
        if (error['error']['message']) {
          return;
        }
        this.general.errorResponse(error['status']);
      });

    // get next tasks
    this.taskService.getNextTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.openTasks = <Task[]>data['data'];
        this.openTasks.forEach((task)=>{
          task.task_name = this.general.decodeHtmlCharCodes(task.task_name);
          task.notes = this.general.decodeHtmlCharCodes(task.notes);
          task.category = this.general.decodeHtmlCharCodes(task.category);
        });
      },
      (error: any = []) => {
        if (error['error']['message']) {
          this.openTasks = [];
          return;
        }
        this.general.errorResponse(error['status']);
      });
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
      this.dailyStresslevel = data['data']['daily_stresslevel'];
      if (this.dailyStresslevel == 10.00) {
        this.dailyStresslevel = 10;
      } else if (this.dailyStresslevel == 0.00 || this.dailyStresslevel == null) {
        this.dailyStresslevel = 0;
      }
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

  onBreakOpen() {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupReminderComponent, dialogConfig);
  }

  myCategories() {
    this.router.navigate(['/my-categories']);
  }

  myDay() {
    this.router.navigate(['/my-day']);
  }
}
