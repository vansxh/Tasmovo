import { Component, ChangeDetectionStrategy} from '@angular/core';
import { CalendarEvent, CalendarView, CalendarMonthViewDay,} from 'angular-calendar';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {Router, Params, ActivatedRoute} from '@angular/router';
import {DatePipe} from '@angular/common';
import {LOCALE_ID} from '@angular/core';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import { Observable } from 'rxjs';
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
import {colors} from "@angular-devkit/build-angular/src/utils/color";
import { map } from 'rxjs/operators';


function getTimezoneOffsetString(date: Date): string {
  const timezoneOffset = date.getTimezoneOffset();
  const hoursOffset = String(
    Math.floor(Math.abs(timezoneOffset / 60))
  ).padStart(2, '0');
  const minutesOffset = String(Math.abs(timezoneOffset % 60)).padEnd(2, '0');
  const direction = timezoneOffset > 0 ? '-' : '+';

  return `T00:00:00${direction}${hoursOffset}:${minutesOffset}`;
}

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
  events$!: Observable<CalendarEvent<{ task: Task }>[]>;

  constructor(private taskService: TaskService, private general: GeneralService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe, private authService: AuthenticationService) {}

  ngOnInit(): void {
    /*this.events$=this.taskService.getAllTasks().pipe(
      map(({ results }: { results: Task[] }) => {
        return results.map((task: Task) => {
          return {
            title: task.task_name,
            start: new Date(
              task.deadline + getTimezoneOffsetString(this.viewDate)
            ),
            color: colors.yellow,
            allDay: true,
            meta: {
              task,
            },
          };
        });
      })
    );*/
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


