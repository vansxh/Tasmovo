import {Component, OnInit, VERSION} from '@angular/core';
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {MatDialogRef} from "@angular/material/dialog";
import {FormBuilder} from "@angular/forms";
import {StresstrackingService} from "../../services/stresstracking/stresstracking.service";


@Component({
  selector: 'app-popup-reminder',
  templateUrl: './popup-reminder.component.html',
  styleUrls: ['./popup-reminder.component.scss']
})
export class PopupReminderComponent implements OnInit {

  constructor(private dialogRefFinish: MatDialogRef<PopupReminderComponent>, private stress: StresstrackingService, private taskService: TaskService, private formBuilder: FormBuilder, private general: GeneralService) {
  }
  name = "Angular " + VERSION.major;
  display: any;

  input = document.getElementById('reset-stress') as HTMLInputElement | null;
  btnState: boolean=true;
  weeklyAverage!: number;

  ngOnInit(): void {
    this.timer(1);
  }

  onClose() {
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
    this.dialogRefFinish.close();
    window.location.href = window.location.href
  }

  modifyDailyStresslevel(): void {
    this.stress.getDailyStresslevel().subscribe((data: any = []) => {
      this.weeklyAverage = data['data']['daily_stresslevel'];
    this.stress.resetDailyStresslevel(this.weeklyAverage/2).subscribe(
      (data: any = []) => {
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
    this.dialogRefFinish.close();
    window.location.href = window.location.href
  });
  }

  timer(minute: number) {
    // set Time
    let seconds: number = minute * 300;
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
        clearInterval(timer);
        this.btnState = false;
      } else {
        this.btnState = true;
      }
    }, 1000);
  }
}
