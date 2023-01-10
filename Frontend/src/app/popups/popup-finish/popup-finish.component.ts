import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {MatDialog, MatDialogConfig, MatDialogRef} from "@angular/material/dialog";
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {StresstrackingService} from "../../services/stresstracking/stresstracking.service";
import {PopupReminderComponent} from "../popup-reminder/popup-reminder.component";

@Component({
  selector: 'app-popup-finish',
  templateUrl: './popup-finish.component.html',
  styleUrls: ['./popup-finish.component.scss']
})
export class PopupFinishComponent implements OnInit {

  constructor(private dialogRefFinish: MatDialogRef<PopupFinishComponent>, private taskService: TaskService, private formBuilder: FormBuilder, private general: GeneralService, private stress: StresstrackingService, private dialog: MatDialog) {
  }

  finishForm!: FormGroup;
  terminateTask!: Task;
  name!: number;
  dailyStresslevel!: number;
  stressLimit!: number;


  ngOnInit(): void {
    this.terminateTask = this.taskService.terminateTask;
    this.name = this.terminateTask.TAID;

    this.finishForm = this.formBuilder.group({
      expenseID: ['', Validators.required],
      stress_factor: ['', Validators.required]
    });
    this.finishForm.setValue({
      expenseID: '',
      stress_factor: 3
    });

    this.onButtonClicked();
  }

  onButtonClicked() {
    let toggleBtnOne = document.getElementById("toggle-btn-1");
    let toggleBtnTwo = document.getElementById("toggle-btn-2");
    let toggleBtnThree = document.getElementById("toggle-btn-3");
    toggleBtnOne?.addEventListener('click', function onClick() {
      if (toggleBtnOne && toggleBtnTwo && toggleBtnThree) {
        toggleBtnOne.style.backgroundColor = '#D0C7EC';
        toggleBtnOne.style.color = 'white';
        toggleBtnTwo.style.backgroundColor = 'white';
        toggleBtnTwo.style.color = 'black';
        toggleBtnThree.style.backgroundColor = 'white';
        toggleBtnThree.style.color = 'black';
      }
    });
    toggleBtnTwo?.addEventListener('click', function onClick() {
      if (toggleBtnOne && toggleBtnTwo && toggleBtnThree) {
        toggleBtnOne.style.backgroundColor = 'white';
        toggleBtnOne.style.color = 'black';
        toggleBtnTwo.style.backgroundColor = '#9F92C6';
        toggleBtnTwo.style.color = 'white';
        toggleBtnThree.style.backgroundColor = 'white';
        toggleBtnThree.style.color = 'black';
      }
    });
    toggleBtnThree?.addEventListener('click', function onClick() {
      if (toggleBtnOne && toggleBtnTwo && toggleBtnThree) {
        toggleBtnOne.style.backgroundColor = 'white';
        toggleBtnOne.style.color = 'black';
        toggleBtnTwo.style.backgroundColor = 'white';
        toggleBtnTwo.style.color = 'black';
        toggleBtnThree.style.backgroundColor = '#634C9A';
        toggleBtnThree.style.color = 'white';
      }
    });
  }

  onFinishSubmit() {
    this.terminateTask.expenseID = this.finishForm.value.expenseID;
    this.terminateTask.stress_factor = this.finishForm.value.stress_factor;
    this.taskService.finishTask(this.terminateTask).subscribe(
      (data: any = []) => {
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
        this.stress.getStressData().subscribe((data: any = []) => {
          this.dailyStresslevel = data['data']['daily_stresslevel'];
          this.stressLimit = data['data']['stress_limit'];
          if (this.dailyStresslevel > this.stressLimit) {
            const dialogConfig = new MatDialogConfig();
            dialogConfig.disableClose = true;
            dialogConfig.autoFocus = true;
            this.dialog.open(PopupReminderComponent, dialogConfig);
          } else {
            this.onClose();
          }
        }, (error: any = []) => {
          if (error['error']['message']) {
            alert(error['error']['message']);
            return;
          }
          this.general.errorResponse(error['status']);
        });
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
    this.dialogRefFinish.close();
    if (this.dailyStresslevel < this.stressLimit) {
      window.location.href = window.location.href;
    }
  }

}
