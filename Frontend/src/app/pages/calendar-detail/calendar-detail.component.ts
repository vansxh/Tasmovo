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
    // using a 0 param in the day slot of Date() gives you the last day automatically. fantastic.
    this.daysInMonth = new Date(this.year, this.month+1, 0).getDate();

    const tbl = document.getElementById('calendar') || document.createElement('div');
    //  clear whatever table currently exists before creating the new one
    tbl.innerHTML = '';

    // create a div for each day of the month
    for (let date = 1; date <= this.daysInMonth; date++) {

      const div = document.createElement('div');

      div.setAttribute('id', 'day-' + date);

      div.classList.add('day');
      const span = document.createElement('span');
      // set the text in the div to the weekday and day
      const divText = document.createTextNode(new Date(this.year, this.month, date).toLocaleString('de-at', {  weekday: 'short' }) + date + '');
      span.appendChild(divText);
      div.appendChild(span);
      tbl.appendChild(div);
    }

    const classname = document.getElementsByClassName('day');
    const addEditEvent = (e:any) => {
      // set the date clicked for getting all tasks with this deadline
      console.log(e.target.innerHTML);
      this.selectedDate.setDate(parseInt(e.target.innerHTML.slice(2), 10));
      console.log(this.selectedDate);
      this.loadTasks();
    }

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
