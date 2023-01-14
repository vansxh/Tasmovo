import {Component, ChangeDetectionStrategy} from '@angular/core';
import {Subject} from 'rxjs';
import {CalendarEvent, CalendarEventTimesChangedEvent, CalendarView} from 'angular-calendar';
import {EventColor} from 'calendar-utils';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {DatePipe} from '@angular/common';
import {GeneralService} from "../../services/general/general.service";
import {ChangeDetectorRef} from '@angular/core';
import {WeekViewHourSegment} from 'calendar-utils';
import {addDays, addMinutes, endOfWeek} from 'date-fns';
import {finalize, takeUntil} from 'rxjs/operators';
import {fromEvent} from 'rxjs';
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {PopupMydayComponent} from "../../popups/popup-myday/popup-myday.component";
import {PopupFinishComponent} from "../../popups/popup-finish/popup-finish.component";
import {MyDayService} from "../../services/my-day/my-day.service";
import * as Hammer from 'hammerjs';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {faXmark} from '@fortawesome/free-solid-svg-icons';


interface MyEvent extends CalendarEvent {
  deadline?: string;
  category?: string;
  taskID?: number;
  statusID?: number;
}

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
    secondaryText: '#634C9A',
  },
  done: {
    primary: '#ADADAD',
    secondary: '#ffffff',
    secondaryText: '#ADADAD'
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

  public viewDate!: Date;
  dragToCreateActive = false;
  weekStartsOn: 0 = 0;
  dragToSelectEvent!: MyEvent;

  plannedTasks!: Task[];
  updateTask!: Task;
  newTask!: Task;
  mouseArea: any;
  finishedTask!: Task;
  selectedTask!: Task;
  finish!: boolean;
  swipeDiv!: HTMLElement;

  faTrash = faTrash;
  faXmark = faXmark;

  // event action that will be added to all events to delete them from MyDay
  deleteEntry(id: any) {
    this.taskService.deletePlannedTask(id).subscribe(
      (data: any = []) => {
        window.location.reload();
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  refresh = new Subject<void>();

  events: MyEvent[] = [];

  constructor(private myDayService: MyDayService, private dialog: MatDialog, private taskService: TaskService, private datePipe: DatePipe, private general: GeneralService, private cd: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.updateTask = new Task();
    this.newTask = new Task();
    this.viewDate = this.myDayService.viewDate;
    this.finishedTask = new Task();
    this.selectedTask = new Task();
    this.getAllPlannedTasks();

    // add swiping gestures for changing between today and tomorrow
    this.swipeDiv = document.getElementById("swipeDiv")!;
    new Hammer(this.swipeDiv, {
      recognizers: [
        [Hammer.Swipe, {direction: Hammer.DIRECTION_HORIZONTAL}],
      ]
    });

    // modify heading
    let h1 = document.getElementsByTagName("h1");
    for (let i = 0; i < h1.length; i++) {
      h1[i].innerText = "Mein Tag";
    }

    // get area of calendar for adding events through mousemove and mouseup
    this.mouseArea = document.getElementById('myDay');
  }

  getAllPlannedTasks() {
    this.plannedTasks = [];
    this.finish = false;
    this.taskService.getPlannedTasks(this.myDayService.viewDateString()).subscribe(
      (data: any = []) => {
        // get planned tasks and push them into event array with all values needed
        this.plannedTasks = <Task[]>data['data'];
        this.events = [];
        this.plannedTasks.forEach((item) => {
          this.events.push({
            id: item.MID,
            start: new Date(item.planned_date + 'T' + item.start_time),
            end: new Date(item.planned_date + 'T' + item.end_time),
            title: item.task_name,
            color: (item.statusID == 1 ? colors['main'] : colors['done']),
            resizable: {
              beforeStart: true,
              afterEnd: true,
            },
            draggable: true,
            deadline: this.datePipe.transform(item.deadline, 'EEE, d.M. H:mm', 'de-AT') || '',
            category: item.category,
            taskID: item.TAID,
            statusID: item.statusID
          })
        });
        this.viewDate = this.myDayService.viewDate;
        this.cd.detectChanges();
      },
      (error: any = []) => {
        if (error['error']['message']) {
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  // change between today and tomorrow
  changeDay(day: number) {
    // get buttons for changing between days
    const todayBtn = document.getElementById('todayBtn');
    const tomorrowBtn = document.getElementById('tomorrowBtn');
    // if today was clicked
    if (day === 1) {
      if(this.datePipe.transform(new Date(), 'yyyy-MM-dd', 'de-AT') !== this.myDayService.viewDateString()) {
        this.myDayService.viewDate = new Date();
        if (todayBtn && tomorrowBtn) {
          todayBtn.classList.remove('btn-outline-primary');
          todayBtn.classList.remove('btn-light');
          todayBtn.classList.add('btn-primary');
          tomorrowBtn.classList.remove('btn-primary');
          tomorrowBtn.classList.add('btn-outline-primary');
          tomorrowBtn.classList.add('btn-light');
        }
      }
      // if tomorrow was clicked
    } else if (day === 2) {
      if(this.datePipe.transform(new Date().setDate(new Date().getDate() + 1), 'yyyy-MM-dd', 'de-AT') !== this.myDayService.viewDateString()) {
        this.myDayService.viewDate.setDate(new Date().getDate() + 1);
        if (todayBtn && tomorrowBtn) {
          todayBtn.classList.remove('btn-primary');
          todayBtn.classList.add('btn-outline-primary');
          todayBtn.classList.add('btn-light');
          tomorrowBtn.classList.remove('btn-outline-primary');
          tomorrowBtn.classList.add('btn-primary');
          tomorrowBtn.classList.remove('btn-light');

        }
      }
    }
    // reload tasks with changed date
    this.getAllPlannedTasks();
  }

  // if a planned task is dragged to another time
  eventTimesChanged({event, newStart, newEnd,}: CalendarEventTimesChangedEvent, newEvent: any): void {
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

    // get MID depending on type of event.id since it could be undefined, number or string
    if (event.id === undefined) this.updateTask.MID = 0;
    else if (typeof event.id == 'number') this.updateTask.MID = event.id;
    else if (typeof event.id == 'string') {
      this.updateTask.MID = parseInt(event.id);
    } else this.updateTask.MID = 0;
    this.updateTask.TAID = newEvent.event.taskID;
    // set new start and end time after event was dragged
    this.updateTask.start_time = this.datePipe.transform(newStart, 'HH:mm', 'de-AT') || '';
    this.updateTask.end_time = this.datePipe.transform(newEnd, 'HH:mm', 'de-AT') || '';
    this.updateTask.planned_date = this.myDayService.viewDateString();
    // update start and end time of planned task in database
    this.taskService.updatePlannedTask(this.updateTask).subscribe(
      (data: any = []) => {
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  // for adding new events through dragging
  startDragToCreate(
    segment: WeekViewHourSegment,
    mouseDownEvent: MouseEvent,
    segmentElement: HTMLElement
  ) {
    // add placeholder event for display while dragging
    this.dragToSelectEvent = {
      id: this.events.length,
      title: 'Task',
      start: segment.date,
      color: colors['main'],
      meta: {
        tmpEvent: true,
      },
    };
    this.events = [...this.events, this.dragToSelectEvent];
    const segmentPosition = segmentElement.getBoundingClientRect();
    this.dragToCreateActive = true;
    const endOfView = endOfWeek(this.myDayService.viewDate, {
      weekStartsOn: this.weekStartsOn,
    });

    // for updating start and end time of placeholder event while dragging
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

    // if mouseup while mouse is on calendar -> pop-up for inserting new planned task
    fromEvent(this.mouseArea, 'mouseup').subscribe(() => {
      // get all needed values
      this.newTask.TAID = 0;
      this.newTask.start_time = this.datePipe.transform(this.dragToSelectEvent.start, 'HH:mm', 'de-AT') || '';
      this.newTask.end_time = this.datePipe.transform(this.dragToSelectEvent.end, 'HH:mm', 'de-AT') || '';
      this.newTask.planned_date = this.myDayService.viewDateString();
      // open pop-up with selected values
      this.onAddOpen(this.newTask);
    });
  }

  private refreshEvents() {
    this.events = [...this.events];
    this.cd.detectChanges();
  }

  onAddOpen(task: Task) {
    // save selected values in service for displaying in pop-up
    this.taskService.plannedTask = task;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupMydayComponent, dialogConfig);
  }

  finishTask(event: any) {
    this.finish = true;
    this.finishedTask.TAID = event.taskID;
    this.onFinishOpen(this.finishedTask);
  }

  onFinishOpen(task: Task) {
    this.taskService.terminateTask = task;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupFinishComponent, dialogConfig);
  }

  editPlannedTask(event: any) {
    this.selectedTask.MID = event.event.id;
    this.selectedTask.TAID = event.event.taskID;
    this.selectedTask.start_time = this.datePipe.transform(event.event.start, 'HH:mm', 'de-AT') || '';
    this.selectedTask.end_time = this.datePipe.transform(event.event.end, 'HH:mm', 'de-AT') || '';
    this.selectedTask.planned_date = this.myDayService.viewDateString();
    this.onEditOpen(this.selectedTask);
  }

  onEditOpen(task: Task) {
    if (!this.finish) {
      // save values of selected task in service for displaying in pop-up
      this.taskService.plannedTask = task;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      this.dialog.open(PopupMydayComponent, dialogConfig);
    }
  }

  decodeSpecialCharacters(str: string){
    return this.general.decodeHtmlCharCodes(str);
  }

}
