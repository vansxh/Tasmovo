import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {User} from 'src/app/services/authentication/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private auth: AuthenticationService, private router: Router) {
  }

  loginForm!: FormGroup;
  userError!: boolean;
  message!: string;
  createdUser = this.auth.createdUser;

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLoginSubmit() {
    this.createdUser = false;

    this.auth.login(this.loginForm.value).subscribe((data: any = []) => {
      //Check if there is a response
      if (data != null) {
        //Navigate to the dashboard component
        const redirect = this.auth.redirectUrl ? this.auth.redirectUrl : '/dashboard';
        this.router.navigate([redirect]);
        //UID gets stores in session
        this.auth.setSession(data['data']['UID']);
      }
    }, error => {
      this.userError = true;
      this.ngOnInit();
    });
  }


}
