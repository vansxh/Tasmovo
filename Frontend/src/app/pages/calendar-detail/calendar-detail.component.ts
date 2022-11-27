import { Component, OnInit } from '@angular/core';
import {Task} from "../../services/task/task";
import {Router, ActivatedRoute} from '@angular/router';
import {TaskService} from "../../services/task/task.service";
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {GeneralService} from "../../services/general/general.service";
import { CalendarEvent, CalendarView} from 'angular-calendar';


@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-detail.component.html',
  styleUrls: ['./calendar-detail.component.scss']
})
export class CalendarDetailComponent implements OnInit {

  view: CalendarView = CalendarView.Week;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  events: CalendarEvent[] = [];

  constructor(private taskService: TaskService, private router: Router, private route: ActivatedRoute, private authService: AuthenticationService, private general: GeneralService) { }

  selectedTask!: Task;

  ngOnInit(): void {

    const routeParams = this.route.snapshot.params;

    // if DATE is transmitted get task and display values
    if (routeParams['DATE']) {
      this.taskService.getTask(routeParams['DATE']).subscribe(
        (data: any = []) => {
          // get task from data
          this.selectedTask = <Task>data['data'];
        },
        (error: any = []) => {
          if(error['error']['message']) {
            this.general.specificErrorResponse(error['error']['message'], "dashboard");
            return;
          }
          this.general.errorResponse(error['status']);
        });
    }
  }


}
