import {Component, ChangeDetectionStrategy, OnInit, Inject} from '@angular/core';
import {CalendarEvent, CalendarView, CalendarEventAction,} from 'angular-calendar';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {Router, ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {Observable} from 'rxjs';
import {CategoryService} from "../../services/category/category.service";
import {MatDialog} from "@angular/material/dialog";
import {NgbModal} from "@ng-bootstrap/ng-bootstrap";
import {ChangeDetectorRef} from '@angular/core';
import {EventColor} from 'calendar-utils';
import {CalendarNativeDateFormatter, DateFormatterParams} from 'angular-calendar';
import * as Hammer from 'hammerjs';
import * as moment from "moment";
import {DOCUMENT} from '@angular/common';

class CustomDateFormatter extends CalendarNativeDateFormatter {
  public override dayViewHour({date, locale}: DateFormatterParams): string {
    // change this to return a different date format
    return new Intl.DateTimeFormat(locale, {hour: 'numeric'}).format(date);
  }

}

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
  activeDayIsOpen: boolean = true;
  events$!: Observable<CalendarEvent<{ task: Task }>[]>;
  actions!: CalendarEventAction[];
  allTasks!: Task[];
  swipeDiv!: HTMLElement;

  private readonly tasmovoThemeClass = 'tasmovo-theme';

  constructor(@Inject(DOCUMENT) private document: any, private taskService: TaskService, private categoryService: CategoryService, private general: GeneralService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe, private authService: AuthenticationService, private modal: NgbModal,
              public dialog: MatDialog, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.document.body.classList.add(this.tasmovoThemeClass);
    this.swipeDiv = document.getElementById("swipeDiv")!;

    var mc = new Hammer.Manager(this.swipeDiv, {
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
    this.getAllNextTasks();
  }

  getAllNextTasks() {
    this.taskService.getAllTasks().subscribe(
      (data: any = []) => {
        this.allTasks = <Task[]>data['data'];
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
          //alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  changeToDayView() {
    this.taskService.changeToDayView(this.datePipe.transform(this.clickedDate, 'yyyy-MM-dd', 'de-AT') || '');
  }

  setViewDate(viewDate: number) {
    this.viewDate = moment(this.viewDate).add(viewDate, 'months').toDate();
  }

}


