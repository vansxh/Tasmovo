import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {DatePipe} from '@angular/common';
import {GeneralService} from "../../services/general/general.service";
import { ChangeDetectorRef } from '@angular/core';
import { WeekViewHourSegment } from 'calendar-utils';
import { addDays, addMinutes, endOfWeek } from 'date-fns';
import { finalize, takeUntil } from 'rxjs/operators';
import { fromEvent } from 'rxjs';
import {PopupFinishComponent} from "../../popups/popup-finish/popup-finish.component";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PopupMydayComponent} from "../../popups/popup-myday/popup-myday.component";

function floorToNearest(amount: number, precision: number) {
  return Math.floor(amount / precision) * precision;
}

function ceilToNearest(amount: number, precision: number) {
  return Math.ceil(amount / precision) * precision;
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
  selector: 'app-my-day',
  templateUrl: './my-day.component.html',
  styleUrls: ['./my-day.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class MyDayComponent {

  view: CalendarView = CalendarView.Day;

  CalendarView = CalendarView;

  viewDate!: Date;
  dragToCreateActive = false;
  weekStartsOn: 0 = 0;
  dragToSelectEvent!: CalendarEvent;

  plannedTasks!: Task[];
  updateTask!: Task;
  newTask!: Task;
  mouseArea: any;

  actions: CalendarEventAction[] = [
    {
      label: '<p> löschen</p>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        console.log(event.id);
        this.taskService.deletePlannedTask(event.id).subscribe(
          (data: any = []) => {
          },
          (error: any = []) => {
            if(error['error']['message']) {
              alert(error['error']['message']);
              return;
            }
            this.general.errorResponse(error['status']);
          });
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  constructor(private dialog: MatDialog, private taskService: TaskService, private datePipe: DatePipe, private general: GeneralService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void{
    this.updateTask = new Task();
    this.newTask = new Task();
    this.viewDate = new Date();
    this.getAllPlannedTasks();

    document.getElementsByTagName('h1')[0].innerText = "Mein Tag";
    this.mouseArea =  document.getElementById('myDay');
  }

  getAllPlannedTasks(){
    this.taskService.getPlannedTasks(this.datePipe.transform(this.viewDate,'yyyy-MM-dd', 'de-AT')||'').subscribe(
      (data: any = []) => {
        this.plannedTasks = <Task[]>data['data'];
        console.log(this.plannedTasks);
        this.events = [];
        this.plannedTasks.forEach((item)=>{
          this.events.push({
            id: item.TAID,
            start:new Date(item.planned_date + ' ' + item.start_time),
            end:new Date(item.planned_date + ' ' + item.end_time),
            title:item.task_name,
            color: colors['main'],
            actions: this.actions,
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: true,
          })
        });
        this.viewDate = new Date();
        this.cd.detectChanges();
        console.log(this.events);
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  changeDay(day: number) {
    const todayBtn = document.getElementById('todayBtn');
    const tomorrowBtn = document.getElementById('tomorrowBtn');
    if(day === 1) {
      this.viewDate= new Date();
      if(todayBtn && tomorrowBtn) {
        todayBtn.classList.remove('btn-outline-primary');
        todayBtn.classList.add('btn-primary');
        tomorrowBtn.classList.remove('btn-primary');
        tomorrowBtn.classList.add('btn-outline-primary');
      }
    } else if(day === 2) {
      this.viewDate.setDate(new Date().getDate() + 1);
      if(todayBtn && tomorrowBtn) {
        todayBtn.classList.remove('btn-primary');
        todayBtn.classList.add('btn-outline-primary');
        tomorrowBtn.classList.remove('btn-outline-primary');
        tomorrowBtn.classList.add('btn-primary');
      }
    }
    this.getAllPlannedTasks();
  }

  eventTimesChanged({ event, newStart, newEnd,}: CalendarEventTimesChangedEvent): void {

   this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });

    if(event.id === undefined) this.updateTask.TAID = 0;
    else if(typeof event.id == 'number') this.updateTask.TAID = event.id;
    else if(typeof event.id == 'string') {
      this.updateTask.TAID = parseInt(event.id);
    }
    else this.updateTask.TAID = 0;
    //this.updateTask.TAID = event.id == undefined ? 0 : typeof event.id == 'number' ? event.id : 'string' ? parseInt(event.id) : 0;
    this.updateTask.start_time = this.datePipe.transform(newStart,'HH:mm', 'de-AT')||'';
    this.updateTask.end_time = this.datePipe.transform(newEnd,'HH:mm', 'de-AT')||'';
    console.log(this.updateTask);
    this.taskService.updatePlannedTask(this.updateTask).subscribe(
      (data: any = []) => {
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    this.dragToSelectEvent = {
      id: this.events.length,
      title: 'Task',
      start: segment.date,
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, this.dragToSelectEvent];
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    fromEvent(document, 'mousemove')
      .pipe(
        finalize(() => {
          delete this.dragToSelectEvent.meta.tmpEvent;
          this.dragToCreateActive = false;
          this.refreshEvents();
        }),
        takeUntil(fromEvent(document, 'mouseup'))
      )
      .subscribe((mouseMoveEvent: any) => {
        const minutesDiff = ceilToNearest(
          mouseMoveEvent.clientY - segmentPosition.top,
          30
        );

        const daysDiff =
          floorToNearest(
            mouseMoveEvent.clientX - segmentPosition.left,
            segmentPosition.width
          ) / segmentPosition.width;

        const newEnd = addDays(addMinutes(segment.date, minutesDiff), daysDiff);
        if (newEnd > segment.date && newEnd < endOfView) {
          this.dragToSelectEvent.end = newEnd;
        }
        this.refreshEvents();
      });

    fromEvent(this.mouseArea, 'mouseup').subscribe( () => {
      this.newTask.start_time = this.datePipe.transform(this.dragToSelectEvent.start, 'HH:mm', 'de-AT') || '';
      this.newTask.end_time = this.datePipe.transform(this.dragToSelectEvent.end, 'HH:mm', 'de-AT') || '';
      this.newTask.planned_date = this.datePipe.transform(this.viewDate, 'yyyy-MM-dd', 'de-AT') || '';
      this.onAddOpen(this.newTask);
    });
  }

  private refreshEvents() {
    this.events = [...this.events];
    this.cd.detectChanges();
  }

  onAddOpen(task: Task){
    this.taskService.addDailyTask = task;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupMydayComponent, dialogConfig);
  }

}
