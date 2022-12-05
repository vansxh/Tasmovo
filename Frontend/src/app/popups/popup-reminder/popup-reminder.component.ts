import { Component, OnInit } from '@angular/core';
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {Task} from "../../services/task/task";
import {MatDialogRef} from "@angular/material/dialog";
import {DashboardComponent} from "../../pages/dashboard/dashboard.component";
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-popup-reminder',
  templateUrl: './popup-reminder.component.html',
  styleUrls: ['./popup-reminder.component.scss']
})
export class PopupReminderComponent implements OnInit {

  constructor(private dialogRefFinish: MatDialogRef<PopupReminderComponent>, private taskService: TaskService, private general: GeneralService) {
  }
  terminateTask!: Task;
  name!: number;

  //accept!: boolean;

  ngOnInit(): void {
    this.terminateTask = this.taskService.terminateTask;
    this.name = this.terminateTask.TAID;
  }

  onFinishSubmit() {

    console.log(this.terminateTask);
    //console.log("expenseID: " + this.terminateTask.expenseID);
    //console.log("stress_factor: " + this.terminateTask.stress_factor);
    this.taskService.finishTask(this.terminateTask).subscribe(
      (data: any = []) => {
        // update view if finishing was successful
        //this.loadTasks();
        this.onClose();
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  onClose() {
    //this.accept = false;
    this.dialogRefFinish.close();
    window.location.href = window.location.href;
  }

}
