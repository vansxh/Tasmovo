import { Component, ChangeDetectionStrategy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent, CalendarView } from 'angular-calendar';
import { EventColor } from 'calendar-utils';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {DatePipe} from '@angular/common';
import {GeneralService} from "../../services/general/general.service";
import { ChangeDetectorRef } from '@angular/core';

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

  plannedTasks!: Task[];
  updateTask!: Task;

  actions: CalendarEventAction[] = [
    {
      label: '<i class="fas fa-fw fa-pencil-alt"></i>',
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '<i class="fas fa-fw fa-trash-alt"></i>',
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  events: CalendarEvent[] = [];

  activeDayIsOpen: boolean = true;

  constructor(private taskService: TaskService, private datePipe: DatePipe, private general: GeneralService, private cd: ChangeDetectorRef) {}

  ngOnInit(): void{
    this.updateTask = new Task();
    this.viewDate = new Date();
    this.getAllPlannedTasks();
  }

  getAllPlannedTasks(){
    this.taskService.getPlannedTasks(this.datePipe.transform(this.viewDate,'yyyy-MM-dd', 'de-AT')||'').subscribe(
      (data: any = []) => {
        this.plannedTasks = <Task[]>data['data'];
        console.log(this.plannedTasks);
        this.plannedTasks.forEach((item)=>{
          this.events.push({
            id: item.TAID,
            start:new Date(item.planned_date + ' ' + item.start_time),
            end:new Date(item.planned_date + ' ' + item.end_time),
            title:item.task_name,
            color: colors['main'],
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

  changeDay() {
    this.viewDate.setDate(new Date().getDate()+1);
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

   // !!! FIX ME !!!
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
    this.taskService.updatePlannedTask(this.updateTask);

    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    console.log(action, event);
    if(action == 'Dropped or resized') {

    }
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }

}
