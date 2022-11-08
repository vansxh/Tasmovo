import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Route, Router } from '@angular/router';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';
import { User } from 'src/app/services/authentication/user';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private auth: AuthenticationService, private router: Router) { }

  loginForm!: FormGroup;
  userError!: boolean;
  message!: string;
  createdUser = this.auth.createdUser;
  currentUser!: User;

  ngOnInit(): void {
    if (this.auth.isLoggedIn()) {
      this.router.navigate(['dashboard']);
    }
    
    this.loginForm = this.formbuilder.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onLoginSubmit() {
    this.auth.createdUser = false;

    if (this.loginForm.value.username == '' || this.loginForm.value.username == '') {
      this.message = "Felder sind leer!";
      this.userError = true;
    } else {

      this.auth.login(this.loginForm.value).subscribe((data: User) => {
        //console.log(data);
        if (data != null) {
        console.log("JUHU"); 
        const redirect = this.auth.redirectUrl ? this.auth.redirectUrl : '/dashboard';
        this.router.navigate([redirect]);
        //console.log(data.UserID);
        //this.currentUser = data;
        //console.log(data.UserID);
        //console.log(data.UID);
        this.auth.setSession(data.UID);
        }
        
      }, error => {
        this.message = "Username oder Passwort ist falsch!";
        this.userError = true;
        this.ngOnInit();
      });
    }
  }


}
