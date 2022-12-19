import { Injectable } from '@angular/core'
import { Location } from '@angular/common'
import { Router, NavigationEnd } from '@angular/router'

@Injectable({
  providedIn: 'root'
})
export class NavigationService {

  // use Array for saving user's history in app
  private history: string[] = []

  constructor(private router: Router, private location: Location) {
    // safe all urls in history
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects)
      }
      console.log(this.history);
    })
  }

  back(): void {
    this.history.pop()
    if (this.history.length > 0) {
      this.location.back()
    } else {
      this.router.navigateByUrl('/')
    }
  }

}
