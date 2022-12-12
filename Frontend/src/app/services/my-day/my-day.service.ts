import { Injectable } from '@angular/core';
import {DatePipe} from '@angular/common';

@Injectable({
  providedIn: 'root'
})
export class MyDayService {

  viewDate!: Date;

  constructor(private datePipe: DatePipe) {
    this.viewDate = new Date();
  }

  viewDateString() {
    return this.datePipe.transform(this.viewDate,'yyyy-MM-dd', 'de-AT')||''
  }
}
