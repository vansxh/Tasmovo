import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Quote} from './quote';

@Injectable({
  providedIn: 'root'
})
export class QuoteService {

  constructor(private http: HttpClient) {
  }

  getQuote() {
    return this.http.get<Quote>('/Backend/routes/quote/getQuote.php');
  }

}
