import {Component, OnInit} from '@angular/core';
import {CategoryService} from 'src/app/services/category/category.service';
import {Category} from 'src/app/services/category/category';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  public categories!: Category[];

  constructor(private authService: AuthenticationService, private router: Router) {
  }

  ngOnInit(): void {
    document.getElementsByTagName("h1")[0].innerText = "Übersicht";

  }

  allTasks(): void {
    this.router.navigate(['/all-tasks']);
  }

  singleTasks(): void {
    this.router.navigate(['/single-tasks']);
  }

  allCategories(): void {
    this.router.navigate(['/my-categories']);
  }

  myDay(): void {
    this.router.navigate(['/my-day']);
  }

}
