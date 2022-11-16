import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {User} from 'src/app/services/authentication/user';
import {GeneralService} from "../../services/general/general.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private auth: AuthenticationService, private router: Router, private general: GeneralService) {
  }

  loginForm!: FormGroup;
  message!: string;
  createdUser = this.auth.createdUser;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]]
    });
  }

  onLoginSubmit() {
    //Disable the user created message
    this.createdUser = false;

    this.auth.login(this.loginForm.value).subscribe((data: any = []) => {
        //Navigate to the dashboard component
        this.router.navigate(['dashboard']);
        //UID gets stores in session
        this.auth.setSession(data['data']['UID']);

    }, (error: any = []) => {
      //Check for specific error
      if (error['error']['message'] != ''){
        this.message = error['error']['message'];
        this.ngOnInit();
        return;
      }

      //Generic error responses
      this.general.errorResponse(error['status']);
      this.ngOnInit();
    });
  }


}
