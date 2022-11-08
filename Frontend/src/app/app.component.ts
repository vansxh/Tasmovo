import { Component } from '@angular/core';
import { AuthenticationService } from './services/authentication/authentication.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Frontend';


  loginbtn!: boolean;
  logoutbtn!: boolean;

  constructor(private service: AuthenticationService) {
    if (this.service.isLoggedIn()) {
      console.log("loggedin");
      this.loginbtn = false;
      this.logoutbtn = true;
    } else {
      this.loginbtn = true;
      this.logoutbtn = false;
    }

  }

  loggedIn() {
    if (this.service.isLoggedIn()) return true;
    else return false;
  }

  logout() {
    //console.log(this.service.getSession());
    this.service.logout(this.service.getSession()).subscribe(data => {
      console.log(data);
      this.service.deleteToken();
      window.location.href = window.location.href;
    });

  }
}
