import {Component, OnInit} from '@angular/core';
import {start} from "@popperjs/core";
import {Reward} from "../../services/timer/Reward";
import {TimerService} from "../../services/timer/timer.service";
import {GeneralService} from "../../services/general/general.service";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

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

  rewards!: Reward[];

  ngOnInit(): void {
    this.startState();
    this.getRewards();

    this.rewardForm = this.formBuilder.group({
      reward: ['', Validators.required]
    });
  }

  startState(){
    this.timerStart = true;
    this.whileTimer = false;
    this.timerEnd = false;
  }

  whileState(){
    this.timerStart = false;
    this.whileTimer = true;
    this.timerEnd = false;
  }

  finishState(){
    this.timerStart = false;
    this.whileTimer = false;
    this.timerEnd = true;
  }

  getRewards(){
    this.timer.getRewards().subscribe((data: any = []) =>{
      this.rewards = <Reward[]>data['data'];
    },(error: any = []) =>{
      if(error['error']['message']) {
        alert(error['error']['message']);
        return;
      }
      this.general.errorResponse(error['status']);
    });
  }

}
