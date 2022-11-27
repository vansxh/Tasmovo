import { Component, ChangeDetectionStrategy} from '@angular/core';
import { CalendarEvent, CalendarView} from 'angular-calendar';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";

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

  public clickedDate: Date | undefined;

  public openTasks!: Task[];

  constructor(private taskService: TaskService, private general: GeneralService) {
  }

  ngOnInit(): void {

    // load next tasks
    this.loadTasks();
  }



  loadTasks(): void {
    // get  next tasks
    this.taskService.getNextTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.openTasks = <Task[]>data['data'];
        // fix deadline for input form
        for (let t of this.openTasks) {
          let deadline = t.deadline.split(" ");
          t.deadlineDay = deadline[0];
          //t.deadlineHour = deadline[1].slice(0, -3);
        }
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  openCalendarDetail(): void {
    this.taskService.openCalendarDetail();
  }

  openSingleTask(task: Task): void {
    //this.taskService.getTaskToDeadline(task.TAID);
  }

}


