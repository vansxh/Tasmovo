import { Component, OnInit } from '@angular/core';
import { CategoryService } from 'src/app/services/category/category.service';
import { Category } from 'src/app/services/category/category';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  public categories!: Category[];

  constructor(private catService: CategoryService, private authService: AuthenticationService) { }

  ngOnInit(): void {

    console.log(this.authService.getSession());

    this.catService.getCategoriesByUser(this.authService.getSession()).subscribe((data: Category[]) => {
      if(data != null) {
        this.categories = data;
      } else alert("Tasks konnten nicht geladen werden!")
    });

  }

  deleteCategory(category: Category): void{
    this.catService.deleteCategory(category.CAID).subscribe(data => {
      console.log(data);
      if(data != null) this.ngOnInit();
      else alert("Task konnte nicht gelöscht werden!")
    });
  }

  editCategory(category: Category): void{
    this.catService.editCategory(category.CAID);
  }
  
  addCategory(): void{
    this.catService.addCategory();
  }

  allCategories(): void{
    this.catService.allCategories();
  }

}
