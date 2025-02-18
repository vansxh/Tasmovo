import {Component, OnInit} from '@angular/core';
import {Task} from "../../services/task/task";
import {Router, ActivatedRoute, ParamMap} from '@angular/router';
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {DatePipe} from "@angular/common";
import {PopupFinishComponent} from "../../popups/popup-finish/popup-finish.component";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';

@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-detail.component.html',
  styleUrls: ['./calendar-detail.component.scss']
})

export class CalendarDetailComponent implements OnInit {

  public deadlineTasks!: Task[];
  public today!: number;
  public year!: number;
  public month!: number;
  public daysInMonth!: number;
  public selectedDate!: Date;
  calendar!: HTMLElement;
  date!: string;

  loadAllTasks = 5;
  loadFinishedTasks = 5;


  constructor(private dialog: MatDialog, private taskService: TaskService, private general: GeneralService, private router: Router, private datePipe: DatePipe, private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    // modify heading
    let h1 = document.getElementsByTagName("h1");
    for (let i = 0; i < h1.length; i++) {
      h1[i].innerText = "Kalender";
    }

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.date = params.get('date')!;
      this.loadDay();
    });
  }

  loadDay() {
    // if deadline is transmitted get tasks
    this.selectedDate = new Date(this.date);
    this.loadTasks();

    // get day, month and year from selected date
    this.today = this.selectedDate.getDate();
    this.year = this.selectedDate.getFullYear();
    this.month = this.selectedDate.getMonth();

    // get number of days in month
    this.daysInMonth = new Date(this.year, this.month + 1, 0).getDate();

    //  clear calendar
    this.calendar = document.getElementById('calendar') || document.createElement('div');
    this.calendar.innerHTML = '';

    // create a div for each day of the month
    for (let date = 1; date <= this.daysInMonth; date++) {
      const div = document.createElement('div');
      div.classList.add('day');
      div.classList.add(date + '');
      const p1 = document.createElement('p');
      // set the text in the div to the weekday and day
      const p1Text = document.createTextNode(new Date(this.year, this.month, date).toLocaleString('de-at', {weekday: 'short'}));
      p1.classList.add('day');
      p1.classList.add(date + '');
      const p2 = document.createElement('p');
      const p2Text = document.createTextNode(date + '');
      p2.classList.add('day');
      p2.classList.add(date + '');
      // add everything to the calendar
      p1.appendChild(p1Text);
      p2.appendChild(p2Text);
      div.appendChild(p1);
      div.appendChild(p2);
      this.calendar.appendChild(div);
    }

    // add selected class to day that was selected in calendar overview
    const selected = document.getElementsByClassName(this.today.toString());
    for (let i = 0; i < selected.length; i++) {
      selected[i].classList.add('selected');
    }

    // put selected day in center
    selected[0].scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'center'
    });

    const classname = document.getElementsByClassName('day');

    // function for event listener
    const newSelectedEvent = (e: any) => {
      // set the date clicked
      this.selectedDate.setDate(parseInt(e.target.className.slice(4), 10));
      this.taskService.changeToDayView(this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd', 'de-AT') || '');
    }

    // add event listener
    for (let i = 0; i < classname.length; i++) {
      classname[i].addEventListener('click', newSelectedEvent, false);
    }
  }

  rightScroll() {
    this.calendar.scrollBy(570, 0);
  }

  leftScroll() {
    this.calendar.scrollBy(-570, 0);
  }

  prevMonth() {
    this.taskService.changeToDayView(this.datePipe.transform(this.selectedDate.setMonth(this.month - 1), 'yyyy-MM-dd', 'de-AT') || '');
  }

  nextMonth() {
    this.taskService.changeToDayView(this.datePipe.transform(this.selectedDate.setMonth(this.month + 1), 'yyyy-MM-dd', 'de-AT') || '');
  }

  loadTasks(): void {
    // get tasks that are due on selected day
    this.taskService.getTasksByDeadline(this.datePipe.transform(this.selectedDate, 'yyyy-MM-dd', 'de-AT') || '').subscribe(
      (data: any = []) => {
        // get tasks from data
        this.deadlineTasks = <Task[]>data['data'];
      },
      (error: any = []) => {
        if (error['error']['message']) {
          this.deadlineTasks = [];
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  detailsTask(task: Task): void {
    this.taskService.detailsTask(task.TAID);
  }

  finishTask(task: Task): void {
    this.taskService.terminateTask = task;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupFinishComponent, dialogConfig);
  }

  decodeSpecialCharacters(str: string){
    return this.general.decodeHtmlCharCodes(str);
  }
}
