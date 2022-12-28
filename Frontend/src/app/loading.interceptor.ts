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
  private timeout!: ReturnType<typeof setTimeout>;

  constructor(private loadingService: LoaderService) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<any>> {
    this.totalRequests++;
    // only display spinner if loading lasts longer than 100ms, credit to Luki
    if(this.totalRequests === 1) {
      this.timeout = setTimeout(() => {
        //this.loadingService.setLoading(true)
      }, 400)
    }

    return next.handle(request).pipe(
      finalize(() => {
        this.totalRequests--;
        if (this.totalRequests == 0) {
          clearTimeout(this.timeout);
          //this.loadingService.setLoading(false);
        }
      })
    );
  }
}
