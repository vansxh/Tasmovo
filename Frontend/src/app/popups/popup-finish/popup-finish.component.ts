import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialogRef} from "@angular/material/dialog";
import {DashboardComponent} from "../../pages/dashboard/dashboard.component";
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-popup-finish',
  templateUrl: './popup-finish.component.html',
  styleUrls: ['./popup-finish.component.scss']
})
export class PopupFinishComponent implements OnInit {

  constructor(private dialogRefFinish: MatDialogRef<PopupFinishComponent>, private taskService: TaskService, private formBuilder: FormBuilder) {
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
    console.log("expenseID: " + this.terminateTask.expenseID);
    console.log("stress_factor: " + this.terminateTask.stress_factor);

    this.onClose();
  }

  onClose() {
    //this.accept = false;
    this.dialogRefFinish.close();
  }

}
