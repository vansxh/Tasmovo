import {Component, OnInit} from '@angular/core';
import {Reward} from "../../services/timer/Reward";
import {TimerService} from "../../services/timer/timer.service";
import {GeneralService} from "../../services/general/general.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ErrorStateMatcher} from "@angular/material/core";
import DevExpress from "devextreme";
import {CountdownEvent, CountdownStatus} from "ngx-countdown";

@Component({
  selector: 'app-timer',
  templateUrl: './timer.component.html',
  styleUrls: ['./timer.component.scss']
})
export class TimerComponent implements OnInit {

  constructor(private timer: TimerService, private general: GeneralService, private formBuilder: FormBuilder) {
  }

  rewardForm!: FormGroup;

  timerStart: boolean | undefined;
  whileTimer: boolean | undefined;
  timerEnd: boolean | undefined;

  snack!: boolean;
  kaffee!: boolean;
  spazieren!: boolean;
  nap!: boolean;

  rewards!: Reward[];

  loadedReward = "Belohnung";
  timerSeconds = 0;

  matcher!: ErrorStateMatcher;

  degrees = 0;

  ngOnInit(): void {
    this.startState();
    this.getRewards();
    this.getCurrentTimer();

    document.getElementsByTagName("h1")[0].innerText = "Timer";
  }

  startState() {
    this.timerStart = true;
    this.whileTimer = false;
    this.timerEnd = false;

    this.initForm();
  }

  whileState() {
    this.timerStart = false;
    this.whileTimer = true;
    this.timerEnd = false;
  }

  finishState() {
    this.timerStart = false;
    this.whileTimer = false;
    this.timerEnd = true;
  }

  getRewards() {
    this.timer.getRewards().subscribe((data: any = []) => {
      this.rewards = <Reward[]>data['data'];
    }, (error: any = []) => {
      if (error['error']['message']) {
        alert(error['error']['message']);
        return;
      }
      this.general.errorResponse(error['status']);
    });
  }

  initForm() {
    this.rewardForm = this.formBuilder.group({
      rewardID: ['', Validators.required],
      hours: ['', [Validators.required, Validators.max(24), Validators.min(0)]],
      minutes: ['', [Validators.required, Validators.max(59), Validators.min(0)]],
      seconds: ['', Validators.required]
    });
    this.rewardForm.setValue({
      rewardID: '',
      hours: '00',
      minutes: '30',
      seconds: '00'
    });
  }

  startTimer() {
    this.timer.createTimer(this.rewardForm.value).subscribe((data: any = []) => {
      this.getCurrentTimer();
    }, (error: any = []) => {
      if (error['error']['message']) {
        alert(error['error']['message']);
        return;
      }
      this.general.errorResponse(error['status']);
    });
  }

  stopTimer() {
    this.timer.deleteTimer().subscribe((data: any = []) =>{
      this.ngOnInit();
    }, (error: any = []) =>{
      if (error['error']['message']) {
        alert(error['error']['message']);
        return;
      }
      this.general.errorResponse(error['status']);
    });
  }

  getCurrentTimer() {
    this.timer.getTimer().subscribe((data: any = []) => {
      this.loadedReward = data['data']['reward'];
      this.timerSeconds = data['data']['duration'];

      this.whileState();
    }, (error: any = []) => {
      this.startState();
    });
  }

  //Check if Timer is finished
  handleEvent(e: CountdownEvent) {
    if(e.status == CountdownStatus.done){
      this.finishState();
    }
  }

  //Random rotation of image on startState
  spinImage(){
    let rand = Math.random()*360;
    rand = Math.floor(rand);
    this.degrees = rand;
  }

}
