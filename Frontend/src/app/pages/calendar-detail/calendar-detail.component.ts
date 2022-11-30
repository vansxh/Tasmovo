import { Component, OnInit } from '@angular/core';
import {Task} from "../../services/task/task";
import {Router, Params, ActivatedRoute} from '@angular/router';
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {routes} from "../../app.module";
import {DatePipe} from "@angular/common";

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


  constructor(private taskService: TaskService, private general: GeneralService, private router: Router, private datePipe: DatePipe, private route: ActivatedRoute, private authService: AuthenticationService) {}

  ngOnInit(): void {

    const routeParams = this.route.snapshot.params;

    // if deadline is transmitted get task and display values
    if (routeParams['date']) {
      this.selectedDate = new Date(routeParams['date']);
      this.loadTasks();
    }

    // set the calendars year and month to todays date by default
    this.today = new Date(routeParams['date']).getDate();
    this.year = new Date(routeParams['date']).getFullYear();
    this.month = new Date(routeParams['date']).getMonth();
    // get number of days in month
    this.daysInMonth = new Date(this.year, this.month+1, 0).getDate();

    const calendar = document.getElementById('calendar') || document.createElement('div');
    //  clear calendar
    calendar.innerHTML = '';

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
      calendar.appendChild(div);
    }
    const classname = document.getElementsByClassName('day');

    // function for event listener
    const addEditEvent = (e:any) => {
      // remove selected class from all elements
      for (let i = 0; i < classname.length; i++) {
        classname[i].classList.remove('selected');
      }
      // set the date clicked for getting all tasks with this deadline
      this.selectedDate.setDate(parseInt(e.target.className.slice(4), 10));
      // set selected class for selected day
      const wholeDay = document.getElementsByClassName(e.target.className);
      for (let i = 0; i < wholeDay.length; i++) {
        wholeDay[i].classList.add('selected');
      }
      // load tasks of selected day
      this.loadTasks();
    }

    // add event listener
    for (let i = 0; i < classname.length; i++) {
      classname[i].addEventListener('click', addEditEvent, false);
    }

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

  finishTask(task: Task): void {
    this.taskService.finishTask(task).subscribe(
      (data: any = []) => {
        // update view if finishing was successful
        this.ngOnInit();
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

  }

}
