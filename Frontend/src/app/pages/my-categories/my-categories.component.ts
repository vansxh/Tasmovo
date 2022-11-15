import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../services/category/category.service';
import {Category} from "../../services/category/category";
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-my-categories',
  templateUrl: './my-categories.component.html',
  styleUrls: ['./my-categories.component.scss']
})
export class MyCategoriesComponent implements OnInit {

  public categories!: Category[];

  constructor(private catService: CategoryService, private authService: AuthenticationService) {
  }

  ngOnInit(): void {

    // get all categories from a user
    this.catService.getCategoriesByUser().subscribe(
      (data: any = []) => {
        if (data['error'] == false) {
          // get categories from data
          this.categories = <Category[]>data['data'];
        } else alert("Kategorien konnten nicht geladen werden!")
      },
      (error) => {
        if(error.status == 404) alert("Kategorien konnten nicht geladen werden!");
      });

  }

  deleteCategory(category: Category): void {
    this.catService.deleteCategory(category.CAID).subscribe(
      (data: any = []) => {
        // update view if deleting was successful
        if (data['error'] == false) this.ngOnInit();
        else alert("Kategorie konnte nicht gelöscht werden!")
      },
      (error) => {
        if(error.status == 404) alert("Kategorie konnte nicht gelöscht werden!");
      });
  }

  editCategory(category: Category): void {
    this.catService.editCategory(category.CAID);
  }

  addCategory(): void {
    this.catService.addCategory();
  }

}
