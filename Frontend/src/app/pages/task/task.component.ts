import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {PopupFinishComponent} from "../../popups/popup-finish/popup-finish.component";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor(private router: Router, private dialog: MatDialog, private route: ActivatedRoute, private taskService: TaskService, private general: GeneralService) { }

  task!: Task;

  ngOnInit(): void {

    const routeParams = this.route.snapshot.params;

    if (routeParams['TAID']) {

      // get task
      this.taskService.getTask(routeParams['TAID']).subscribe(
        (data: any = []) => {
          // get task from data
          this.task = <Task>data['data'];
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

  finishTask() {
    this.taskService.terminateTask = this.task;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupFinishComponent, dialogConfig);
  }

  unfinishTask() {

    // get task
    this.taskService.unfinishTask(this.task).subscribe(
      (data: any = []) => {
        window.location.reload();
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

  }

  editTask(): void {
    this.taskService.editTask(this.task.TAID);
  }

  deleteTask(): void {
    this.taskService.deleteTask(this.task.TAID).subscribe(
      (data: any = []) => {
        // update view if deleting was successful
        this.router.navigate(['/dashboard']);
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
