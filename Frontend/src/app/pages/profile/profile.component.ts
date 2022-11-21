import {Component, OnInit} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {AuthenticationService} from "../../services/authentication/authentication.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private auth: AuthenticationService) {
  }
  color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;

  ngOnInit(): void {
  }

  logout() {
    //console.log(this.service.getSession());
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
