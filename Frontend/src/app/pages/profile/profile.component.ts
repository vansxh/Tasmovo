import {Component, OnInit} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {Task} from "../../services/task/task";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private auth: AuthenticationService, private taskService: TaskService, private general: GeneralService) {
  }
  /*color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;*/
  allTasks!: Task[];
  finishedTasks!: Task[];


  ngOnInit(): void {
    this.taskService.getAllTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.allTasks = <Task[]>data['data'];
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

    this.taskService.getFinishedTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.finishedTasks = <Task[]>data['data'];
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  logout() {
    this.auth.logout(['Logout']).subscribe((data: any = []) => {
      //console.log(data);
      if (data['error'] == false) {
        this.auth.deleteToken();
        window.location.href = window.location.href;
      }else {
        alert("Logout failed");
      }

    });

  }

}
