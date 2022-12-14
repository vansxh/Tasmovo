import { Component, OnInit } from '@angular/core';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {PopupFinishComponent} from "../../popups/popup-finish/popup-finish.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";

@Component({
  selector: 'app-single-tasks',
  templateUrl: './single-tasks.component.html',
  styleUrls: ['./single-tasks.component.scss']
})
export class SingleTasksComponent implements OnInit {

  constructor(private taskService: TaskService, private general: GeneralService, private dialog: MatDialog) { }

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

  detailsTask(task: Task): void {
    this.taskService.detailsTask(task.TAID);
  }

  finishTask(task: Task): void {
    this.taskService.terminateTask = task;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupFinishComponent, dialogConfig);
  }

}
