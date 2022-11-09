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

  constructor(private formbuilder: FormBuilder, private auth: AuthenticationService, private router: Router) {

  }

  model = {
    password: null,
    confirmpassword: null
  }

  registerForm!: FormGroup;
  userError!: boolean;
  message!: string;

  ngOnInit(): void {

    this.registerForm = this.formbuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      username: ['', Validators.required],
      password: ['', Validators.required],
      repeatpassword: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email]]
    });
  }

  onRegisterSubmit() {
    if (this.registerForm.value.firstName == '' || this.registerForm.value.lastName == '' || this.registerForm.value.username == '' || this.registerForm.value.password == '' || this.registerForm.value.mail == '') {
      //console.log("Hey");
      this.message = "Es müssen alle Felder befüllt sein!"
      this.userError = true;
    } else {
      this.auth.register(this.registerForm.value).subscribe(data => {
        console.log(data);
        this.router.navigate(['login']);
        //this.createdUser = true;
        this.auth.createdUser = true;
      }, error => {
        this.message = "Username oder Mail existiert schon!";
        this.userError = true;
        this.ngOnInit();
      });
    }
  }

  keyPressAlphaNumeric(event: { keyCode: number; preventDefault: () => void; }) {

    var inp = String.fromCharCode(event.keyCode);

    if (/[a-z0-9]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

}
