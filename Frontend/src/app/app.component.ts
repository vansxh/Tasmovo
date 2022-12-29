import {Component} from '@angular/core';
import {AuthenticationService} from './services/authentication/authentication.service';
import {Task} from "./services/task/task";
import {PopupFinishComponent} from "./popups/popup-finish/popup-finish.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PopupAddComponent} from "./popups/popup-add/popup-add.component";
import {TaskService} from './services/task/task.service';
import {PopupMydayComponent} from "./popups/popup-myday/popup-myday.component";
import {MyDayComponent} from "./pages/my-day/my-day.component";
import {MyDayService} from "./services/my-day/my-day.service";
import {NavigationService} from "./services/navigation/navigation.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Tasmovo';

  loginbtn!: boolean;
  logoutbtn!: boolean;
  newPlannedTask!: Task;

  constructor(private router: Router,private navigation: NavigationService, private service: AuthenticationService, private dialog: MatDialog, private taskService: TaskService, private myDayService: MyDayService) {
    if (this.service.isLoggedIn()) {
      this.loginbtn = false;
      this.logoutbtn = true;
    } else {
      this.loginbtn = true;
      this.logoutbtn = false;
    }
    this.newPlannedTask = new Task();
  }

  loggedIn() {
    return this.service.isLoggedIn();
  }

  addPopup(): void {
    this.onAddOpen();
  }

  onAddOpen(){
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupAddComponent, dialogConfig);
  }

  getLocation() {
    return window.location.pathname;
  }

  addPlannedTaskOpen(): void {
    this.newPlannedTask.TAID = 0;
    this.newPlannedTask.planned_date = this.myDayService.viewDateString();
    this.taskService.plannedTask = this.newPlannedTask;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupMydayComponent, dialogConfig);
  }

  toCalendarOverview(): void {
    this.router.navigate(['calendar']);
  }

}
