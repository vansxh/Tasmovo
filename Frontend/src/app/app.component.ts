import {Component} from '@angular/core';
import {AuthenticationService} from './services/authentication/authentication.service';
import {Task} from "./services/task/task";
import {PopupFinishComponent} from "./popups/popup-finish/popup-finish.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {PopupAddComponent} from "./popups/popup-add/popup-add.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Tasmovo';

  loginbtn!: boolean;
  logoutbtn!: boolean;

  constructor(private service: AuthenticationService, private dialog: MatDialog) {
    if (this.service.isLoggedIn()) {
      this.loginbtn = false;
      this.logoutbtn = true;
    } else {
      this.loginbtn = true;
      this.logoutbtn = false;
    }
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
}
