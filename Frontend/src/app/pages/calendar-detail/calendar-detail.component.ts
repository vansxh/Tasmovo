import { Component, OnInit } from '@angular/core';
import {Task} from "../../services/task/task";
import {Router, Params, ActivatedRoute, ParamMap} from '@angular/router';
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {routes} from "../../app.module";
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


  constructor(private dialog: MatDialog, private taskService: TaskService, private general: GeneralService, private router: Router, private datePipe: DatePipe, private route: ActivatedRoute, private authService: AuthenticationService) {}

  ngOnInit(): void {

    let h1 = document.getElementsByTagName("h1");
    for (let i = 0; i < h1.length; i++) {  h1[i].innerText = "Kalender";}

    console.log("ngOnInit aufgerufen")

    this.route.paramMap.subscribe((params: ParamMap) => {
      this.date = params.get('date')!;
      this.loadDays();
    });


  }

  loadDays() {

    // if deadline is transmitted get task and display values
    this.selectedDate = new Date(this.date);
    this.loadTasks();

    // set the calendars year and month to the selected date
    this.today = this.selectedDate.getDate();
    this.year = this.selectedDate.getFullYear();
    this.month = this.selectedDate.getMonth();
    // get number of days in month
    this.daysInMonth = new Date(this.year, this.month+1, 0).getDate();

    this.calendar = document.getElementById('calendar') || document.createElement('div');
    //  clear calendar
    this.calendar.innerHTML = '';

    console.log(this.selectedDate);

    // create a div for each day of the month
    for (let date = 1; date <= this.daysInMonth; date++) {

      const div = document.createElement('div');

      div.classList.add('day');
      div.classList.add(date + '');
      const p1 = document.createElement('p');
      // set the text in the div to the weekday and day
      const p1Text = document.createTextNode(new Date(this.year, this.month, date).toLocaleString('de-at', {  weekday: 'short' }));
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

    selected[0].scrollIntoView({
      behavior: 'auto',
      block: 'center',
      inline: 'center'
    });

    const classname = document.getElementsByClassName('day');

    // function for event listener
    const newSelectedEvent = (e:any) => {
      // set the date clicked
      this.selectedDate.setDate(parseInt(e.target.className.slice(4), 10));
      this.taskService.changeToDayView(this.datePipe.transform(this.selectedDate,'yyyy-MM-dd', 'de-AT')||'');
    }

    // add event listener
    for (let i = 0; i < classname.length; i++) {
      classname[i].addEventListener('click', newSelectedEvent, false);
    }

  }

  rightScroll() {
    this.calendar.scrollBy(570,0);
  }

  leftScroll() {
    this.calendar.scrollBy(-570,0);
  }

  prevMonth() {
    this.taskService.changeToDayView(this.datePipe.transform(this.selectedDate.setMonth(this.month - 1),'yyyy-MM-dd', 'de-AT')||'');
    console.log('zu vorherigem Monat');
  }

  nextMonth() {
    this.taskService.changeToDayView(this.datePipe.transform(this.selectedDate.setMonth(this.month + 1),'yyyy-MM-dd', 'de-AT')||'');
    console.log('zu nächstem Monat');
  }

  loadTasks(): void {
    // get  next tasks
    this.taskService.getTasksByDeadline(this.datePipe.transform(this.selectedDate,'yyyy-MM-dd', 'de-AT')||'').subscribe(
      (data: any = []) => {
        // get tasks from data
        this.deadlineTasks = <Task[]>data['data'];
      },
      (error: any = []) => {
        if (error['error']['message']) {
          this.deadlineTasks = [];
          alert(error['error']['message']);
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

}
