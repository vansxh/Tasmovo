import { Component, OnInit } from '@angular/core';
import {Task} from "../../services/task/task";
import {Router, Params, ActivatedRoute} from '@angular/router';
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {routes} from "../../app.module";

@Component({
  selector: 'app-calendar-detail',
  templateUrl: './calendar-detail.component.html',
  styleUrls: ['./calendar-detail.component.scss']
})
export class CalendarDetailComponent implements OnInit {

  public deadlineTasks!: Task[];


  constructor(private taskService: TaskService, private general: GeneralService, private router: Router, private route: ActivatedRoute, private authService: AuthenticationService) {}

  ngOnInit(): void {

    const routeParams = this.route.snapshot.params;

    // if deadline is transmitted get task and display values
    console.log(routeParams['date']);
    if (routeParams['date']) {
      // get  next tasks
      this.taskService.getTasksByDeadline(routeParams['date']).subscribe(
        (data: any = []) => {
          // get tasks from data
          this.deadlineTasks = <Task[]>data['data'];
        },
        (error: any = []) => {
          if (error['error']['message']) {
            alert(error['error']['message']);
            return;
          }
          this.general.errorResponse(error['status']);
        });
    }
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
