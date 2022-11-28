import { Component, ChangeDetectionStrategy} from '@angular/core';
import { CalendarEvent, CalendarView, CalendarMonthViewDay,} from 'angular-calendar';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {Router, Params, ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {LOCALE_ID} from '@angular/core';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {
  isSameMonth,
  isSameDay,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  startOfDay,
  endOfDay,
  format,
} from 'date-fns';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush
})

export class CalendarComponent {

  view: CalendarView = CalendarView.Month;
  CalendarView = CalendarView;
  viewDate: Date = new Date();
  events: CalendarEvent[] = [];
  clickedDate: Date = new Date();
  public openTasks!: Task[];
  activeDayIsOpen: boolean = true;
  insertEvent!: CalendarEvent;

  constructor(private taskService: TaskService, private general: GeneralService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe, private authService: AuthenticationService) {}

  ngOnInit(): void {


  }

  changeToDayView() {
    this.taskService.changeToDayView(this.datePipe.transform(this.clickedDate,'yyyy-MM-dd', 'de-AT')||'');
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  setViewDate(viewDate: Date) {
    this.viewDate = viewDate;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }


}


