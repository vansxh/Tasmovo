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

  keyPressTitles(event: { keyCode: number; preventDefault: () => void; }){
    const inp = String.fromCharCode(event.keyCode);

    //!@#$%^&*)(+=.<>{}\[\]:;'"|~`_-
    if (/[a-zA-Z0-9'-]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressMail(event: { keyCode: number; preventDefault: () => void; }){
    const inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z.@-]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  keyPressNames(event: { keyCode: number; preventDefault: () => void; }){
    const inp = String.fromCharCode(event.keyCode);

    if (/[a-zA-Z'-äÄöÖüÜß]/.test(inp)) {
      return true;
    } else {
      event.preventDefault();
      return false;
    }
  }

  preventSpaces(event: { keyCode: number; preventDefault: () => void; }){
    const inp = String.fromCharCode(event.keyCode);

    if (/[ ]/.test(inp)) {
      event.preventDefault();
      return false;
    } else {
      return true;
    }
  }

  decodeHtmlCharCodes(str: string) {
    return str.replace(/(&#(\d+);)/g, function(match, capture, charCode) {
      return String.fromCharCode(charCode);
    });
  }



}
