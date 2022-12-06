import { Component, OnInit } from '@angular/core';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";

@Component({
  selector: 'app-single-tasks',
  templateUrl: './single-tasks.component.html',
  styleUrls: ['./single-tasks.component.scss']
})
export class SingleTasksComponent implements OnInit {

  constructor(private taskService: TaskService, private general: GeneralService) { }

  public singleTasks!: Task[];

  ngOnInit(): void {

      // get single tasks
      this.taskService.getSingleTasks().subscribe(
        (data: any = []) => {
          // get tasks from data
          this.singleTasks = <Task[]>data['data'];
        },
        (error: any = []) => {
          if(error['error']['message']) {
            alert(error['error']['message']);
            return;
          }
          this.general.errorResponse(error['status']);
        });

      document.getElementsByTagName("h1")[0].innerText = "Unkategorisiert";
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
