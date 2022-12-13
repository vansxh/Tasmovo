import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor, HttpResponse
} from '@angular/common/http';
import {Observable, tap} from 'rxjs';
import { finalize } from 'rxjs/operators';
import {LoaderService} from "./services/loader/loader.service";

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

  private totalRequests = 0;

  constructor(private loadingService: LoaderService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {

    this.totalRequests++;
    let lock = false;
    // only display spinner if loading lasts longer than 100ms, credit to Luki
    setTimeout(() => {
      console.log("true");
      if (!lock && this.totalRequests === 1) this.loadingService.setLoading(true)
    }, 100)

    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        console.log("false");
        if (this.totalRequests == 0) {
          lock = true;
          this.loadingService.setLoading(false);
        }
      })
    );
  }
}
