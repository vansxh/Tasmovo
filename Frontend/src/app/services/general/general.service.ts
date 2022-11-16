import {Injectable} from '@angular/core';
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  constructor(private router: Router) {
  }

  //Function for handling general errors
  errorResponse(status: number): void {
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
  specificErrorResponse(message: string, redirect: string) : void{
    alert(message);
    this.router.navigate([redirect]);
  }

}
