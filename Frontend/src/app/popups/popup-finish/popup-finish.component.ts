import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {DashboardComponent} from "../../pages/dashboard/dashboard.component";
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {MatButtonToggleModule} from '@angular/material/button-toggle';
import {GeneralService} from "../../services/general/general.service";
import {StresstrackingService} from "../../services/stresstracking/stresstracking.service";

@Component({
  selector: 'app-popup-finish',
  templateUrl: './popup-finish.component.html',
  styleUrls: ['./popup-finish.component.scss']
})
export class PopupFinishComponent implements OnInit {

  constructor(private dialogRefFinish: MatDialogRef<PopupFinishComponent>, private taskService: TaskService, private formBuilder: FormBuilder, private general: GeneralService, private stress: StresstrackingService) {
  }

  finishForm!: FormGroup;
  terminateTask!: Task;
  name!: number;

  //accept!: boolean;

  ngOnInit(): void {
    this.terminateTask = this.taskService.terminateTask;
    this.name = this.terminateTask.TAID;

    this.finishForm = this.formBuilder.group({
      expenseID: ['', Validators.required],
      stress_factor: ['', Validators.required]
    });
  }

  onFinishSubmit() {

    this.terminateTask.expenseID = this.finishForm.value.expenseID;
    this.terminateTask.stress_factor = this.finishForm.value.stress_factor;
    console.log(this.terminateTask);
    //console.log("expenseID: " + this.terminateTask.expenseID);
    //console.log("stress_factor: " + this.terminateTask.stress_factor);
    this.taskService.finishTask(this.terminateTask).subscribe(
      (data: any = []) => {
        // update view if finishing was successful
        //this.loadTasks();
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

    this.stress.updateDailyStresslevel(this.terminateTask).subscribe(
      (data: any = []) => {
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
