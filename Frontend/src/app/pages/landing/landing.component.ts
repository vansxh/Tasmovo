import {Component, OnInit} from '@angular/core';
import {Quote} from "../../services/quote/quote";
import {QuoteService} from "../../services/quote/quote.service";
import {GeneralService} from "../../services/general/general.service";

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss']
})
export class LandingComponent implements OnInit {

  public dailyQuote!: Quote;

  constructor(private quoteService: QuoteService, private general: GeneralService) {
  }

  ngOnInit(): void {
    this.getQuote();
  }

  getQuote() {
    // get random quote
    this.quoteService.getQuote().subscribe(
      (data: any = []) => {
        this.dailyQuote = <Quote>data['data'];
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  decodeSpecialCharacters(str: string){
    return this.general.decodeHtmlCharCodes(str);
  }
}
