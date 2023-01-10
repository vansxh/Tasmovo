import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {GeneralService} from "../../services/general/general.service";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  constructor(private formBuilder: FormBuilder, private auth: AuthenticationService, private router: Router, private general: GeneralService) {
  }

  registerForm!: FormGroup;
  message!: string;

  ngOnInit(): void {
    this.registerForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.maxLength(30)]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]],
      repeatPassword: ['', Validators.required],
      mail: ['', [Validators.required, Validators.email, Validators.maxLength(30)]]
    });
  }

  onRegisterSubmit() {
    this.auth.register(this.registerForm.value).subscribe((data: any = []) => {
      //Navigate to the login component
      this.router.navigate(['login']);
      this.auth.createdUser = true;
    }, (error: any = []) => {
      //Check for specific error
      if (error['error']['message'] == "Registrieren fehlgeschlagen.") {
        this.message = "Username oder Email existiert bereits!";
        this.ngOnInit();
        return;
      }
      //Generic error responses
      this.general.errorResponse(error['status']);
      this.ngOnInit();
    });
  }

  //Function for only allowing lower case and numbers
  keyPressAlphaNumeric(event: { keyCode: number; preventDefault: () => void; }) {
    this.general.keyPressAlphaNumeric(event);
  }

}
