import {Component} from '@angular/core';
import {AuthenticationService} from './services/authentication/authentication.service';

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
      //console.log("loggedin");
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

  /*logout() {
    //console.log(this.service.getSession());
    this.service.logout(['Logout']).subscribe((data: any = []) => {
      //console.log(data);
      if (data['error'] == false) {
        this.service.deleteToken();
        window.location.href = window.location.href;
      }else {
        alert("Logout failed");
      }

    });

  }*/
}
