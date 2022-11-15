import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ValidateEqualModule} from 'ng-validate-equal';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private auth: AuthenticationService, private router: Router) {
  }

  registerForm!: FormGroup;
  userError!: boolean;
  message!: string;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]]
    });
  }

  onRegisterSubmit() {
    this.auth.register(this.registerForm.value).subscribe((data: any = []) => {
      //Check if there is no response error
      if (data['error'] == false) {
        //Navigate to the login component
        this.router.navigate(['login']);
        this.auth.createdUser = true;
      }
    }, error => {
      this.message = "Username or email already exists!";
      this.userError = true;
      this.ngOnInit();
    });
  }

  //Function for only allowing lower case and numbers
  keyPressAlphaNumeric(event: { keyCode: number; preventDefault: () => void; }) {
    const inp = String.fromCharCode(event.keyCode);

    if (/[a-z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}
