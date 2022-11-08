import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { User } from './user';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) { }

  public createdUser!: boolean;
  redirectUrl!: string;

  register(user: User){
    user.UID = uuidv4();
    return this.http.post('http://flock-1902.students.fhstp.ac.at/Backend/routes/user/register.php', user);
  }

  login(user: User){
    return this.http.post<User>('http://flock-1902.students.fhstp.ac.at/Backend/routes/user/login.php', user);
  }

  setSession(token: string){
    sessionStorage.setItem('token', token);
  }

  getSession(): string{
    return String(sessionStorage.getItem('token'));
  }

  deleteToken(){
    sessionStorage.removeItem('token');
  }

  isLoggedIn(){
    const token = this.getSession();
    //console.log(token);
    if (token != 'null' || token != null) {
      return true;
    }else{
      return false;
    }
  }
}
