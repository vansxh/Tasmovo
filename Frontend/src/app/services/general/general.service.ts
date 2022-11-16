import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private router: Router) {
  }

  //Function for handling general errors
  errorResponse(status: number) {
    switch (status) {
      case 400:
        alert("Der Server kann die Anfrage nicht bearbeiten.");
        break;
      case 403:
        alert("Der User hat keinen Zugriff.");
        break;
      case 404:
        alert("Die Antwort konnte nicht geladen werden!");
        break;
      default:
        this.router.navigate(['dashboard']);
    }
  }

  //Function for handling specific errors with alerts
  specificErrorResponse(message: string, redirect: string) {
    alert(message);
    this.router.navigate([redirect]);
  }


  //Function for only allowing numbers and lowercase letters
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
