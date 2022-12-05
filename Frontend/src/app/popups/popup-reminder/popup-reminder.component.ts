import {Component, OnInit, VERSION} from '@angular/core';
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {Task} from "../../services/task/task";
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {StresstrackingService} from "../../services/stresstracking/stresstracking.service";


@Component({
  selector: 'app-popup-reminder',
  templateUrl: './popup-reminder.component.html',
  styleUrls: ['./popup-reminder.component.scss']
})
export class PopupReminderComponent implements OnInit {

  constructor(private dialogRefFinish: MatDialogRef<PopupReminderComponent>, private stress: StresstrackingService, private taskService: TaskService, private formBuilder: FormBuilder, private general: GeneralService) {
    this.timer(1);
  }
  name = "Angular " + VERSION.major;
  display: any;
  finishForm!: FormGroup;
  input = document.getElementById('reset-stress') as HTMLInputElement | null;
  //accept!: boolean;
  btnState: boolean=true;

  ngOnInit(): void {
    this.finishForm = this.formBuilder.group({
      expenseID: ['', Validators.required],
      stress_factor: ['', Validators.required]
    });
  }

  onClose() {
    //this.accept = false;
    this.dialogRefFinish.close();
    window.location.href = window.location.href;
  }

  resetDailyStresslevel(): void {
    this.stress.resetDailyStresslevel(0).subscribe(
      (data: any = []) => {
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  timer(minute: number) {
    // let minute = 1;
    let seconds: number = minute * 60;
    let textSec: any = "0";
    let statSec: number = 60;

    const prefix = minute < 10 ? "0" : "";

    const timer = setInterval(() => {
      seconds--;
      if (statSec != 0) statSec--;
      else statSec = 59;

      if (statSec < 10) {
        textSec = "0" + statSec;
      } else textSec = statSec;

      this.display = `${prefix}${Math.floor(seconds / 60)}:${textSec}`;

      if (seconds == 0) {
        console.log("finished");
        clearInterval(timer);
        this.btnState = false;
      } else {
        this.btnState = true;
      }
    }, 1000);
  }

}
