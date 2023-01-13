import {Component, ChangeDetectionStrategy, OnInit, Inject} from '@angular/core';
import {CalendarEvent, CalendarView} from 'angular-calendar';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {Router, ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {CategoryService} from "../../services/category/category.service";
import {MatDialog} from "@angular/material/dialog";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ChangeDetectorRef} from '@angular/core';
import {EventColor} from 'calendar-utils';
import * as Hammer from 'hammerjs';
import * as moment from "moment";
import {DOCUMENT} from '@angular/common';

const colors: Record<string, EventColor> = {
  main: {
    primary: '#634C9A',
    secondary: '#ffffff',
  },
  done: {
    primary: '#9F92C6',
    secondary: '#ffffff',
  },
};

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class CalendarComponent implements OnInit {

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate!: Date;
  events: CalendarEvent[] = [];
  clickedDate: Date = new Date();
  allTasks!: Task[];
  swipeDiv!: HTMLElement;

  private readonly tasmovoThemeClass = 'tasmovo-theme';

  constructor(@Inject(DOCUMENT) private document: any, private taskService: TaskService, private categoryService: CategoryService, private general: GeneralService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe, private authService: AuthenticationService, private modal: NgbModal,
              public dialog: MatDialog, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    // add custom calendar theme
    this.document.body.classList.add(this.tasmovoThemeClass);

    // make it possible to swipe between months
    this.swipeDiv = document.getElementById("swipeDiv")!;

    new Hammer.Manager(this.swipeDiv, {
      recognizers: [
        [Hammer.Swipe, {direction: Hammer.DIRECTION_HORIZONTAL}],
      ]
    });

    // modify heading
    let h1 = document.getElementsByTagName("h1");
    for (let i = 0; i < h1.length; i++) {
      h1[i].innerText = "Kalender";
    }

    this.viewDate = new Date();
    this.getDueTasks();
  }

  getDueTasks() {
    this.taskService.getAllTasks().subscribe(
      (data: any = []) => {
        this.allTasks = <Task[]>data['data'];
        // sort tasks by status for displaying not done tasks in front of done tasks as dots
        this.allTasks.sort(function (a, b) {
          return a.statusID - b.statusID
        });
        this.allTasks.forEach((item) => {
          this.events.push({
            id: item.TAID,
            start: new Date(item.deadline),
            end: new Date(item.deadline),
            title: item.task_name,
            color: item.statusID == 1 ? colors['main'] : colors['done'],
          })
        });
        this.viewDate = new Date();
        this.cd.detectChanges();
      },
      (error: any = []) => {
        if (error['error']['message']) {
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  changeToDayView() {
    this.taskService.changeToDayView(this.datePipe.transform(this.clickedDate, 'yyyy-MM-dd', 'de-AT') || '');
  }

  // for changing between months
  setViewDate(viewDate: number) {
    // add or substract 1 month from viewDate for changing to next or previous month
    this.viewDate = moment(this.viewDate).add(viewDate, 'months').toDate();
  }

}


