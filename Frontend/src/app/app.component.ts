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
import {faRightFromBracket} from "@fortawesome/free-solid-svg-icons";
import {GeneralService} from "./services/general/general.service";

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

  faLogout = faRightFromBracket;

  constructor(private router: Router,private navigation: NavigationService, private auth: AuthenticationService, private dialog: MatDialog, private taskService: TaskService, private myDayService: MyDayService, private general: GeneralService) {
    if (this.auth.isLoggedIn()) {
      this.loginbtn = false;
      this.logoutbtn = true;
    } else {
      this.loginbtn = true;
      this.logoutbtn = false;
    }
    this.newPlannedTask = new Task();
  }

  loggedIn() {
    return this.auth.isLoggedIn();
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

  logout() {
    this.auth.logout(['Logout']).subscribe((data: any = []) => {
      this.auth.deleteToken();
      window.location.href = window.location.href;
    }, (error: any = []) => {
      if (error['error']['message']) {
        alert(error['error']['message']);
        return;
      }
      this.general.errorResponse(error['status']);
    });
  }

}
