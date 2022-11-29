import {HttpClient} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {User} from './user';
import {v4 as uuidv4} from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private http: HttpClient) {
  }

  public createdUser!: boolean;
  redirectUrl!: string;

  register(user: User) {
    user.UID = uuidv4();
    return this.http.post('/Backend/routes/user/register.php', user);
  }

  login(user: User) {
    return this.http.post('/Backend/routes/user/login.php', user);
  }

  logout(message: Array<string>) {
    return this.http.post('/Backend/routes/user/logout.php', message);
  }

  getUser(){
    return this.http.get('/Backend/routes/user/getUser.php');
  }

  updateUser(user: User){
    return this.http.put('/Backend/routes/user/updateUser.php', user);
  }

  setSession(token: string) {
    sessionStorage.setItem('token', token);
  }

  getSession(): string {
    return String(sessionStorage.getItem('token'));
  }

  deleteToken() {
    sessionStorage.removeItem('token');
  }

  getLogin() {
    return sessionStorage.getItem('token');
  }

  isLoggedIn() {
    const token = this.getLogin();
    //console.log(token);
    if (token != null) {
      return true;
    } else {
      return false;
    }
  }
}
