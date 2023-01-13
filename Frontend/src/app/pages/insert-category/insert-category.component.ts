import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Category} from 'src/app/services/category/category';
import {CategoryService} from 'src/app/services/category/category.service';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {GeneralService} from "../../services/general/general.service";
import {NavigationService} from "../../services/navigation/navigation.service";
import {Observable, of} from "rxjs";

@Component({
  selector: 'app-insert-category',
  templateUrl: './insert-category.component.html',
  styleUrls: ['./insert-category.component.scss']
})
export class InsertCategoryComponent implements OnInit {

  constructor(private navigation: NavigationService, private formBuilder: FormBuilder, private catService: CategoryService, private router: Router, private route: ActivatedRoute, private authService: AuthenticationService, private general: GeneralService) {
  }

  insertCategoryForm!: FormGroup;
  selectedCategory!: Category;
  edit: boolean = false;
  categories!: Category[];
  isParentCat: boolean = false;

  ngOnInit(): void {

    this.insertCategoryForm = this.formBuilder.group({
      CAID: [''],
      userID: [''],
      category_name: ['', [Validators.required, Validators.maxLength(30)]],
      parent_categoryID: ['']
    });

    this.getInsertData();
  }

  getInsertData() {
    const routeParams = this.route.snapshot.params;

    // modify headings
    let h1 = document.getElementsByTagName("h1");

    if (routeParams['CAID']) {
      for (let i = 0; i < h1.length; i++) {
        h1[i].innerText = "Kategorie bearbeiten";
      }
    } else {
      for (let i = 0; i < h1.length; i++) {
        h1[i].innerText = "Neue Kategorie";
      }
    }

    // get all categories from a user for dropdown
    this.catService.getCategoriesByUser().subscribe(
      (data: any = []) => {
        // get categories from data
        this.categories = <Category[]>data['data'];
        if (routeParams['CAID']) {
          this.categories = this.categories.filter(function (category) {
            return category.CAID !== Number(routeParams['CAID']);
          });
        }
      },
      (error: any = []) => {
        if (error['error']['message']) {
          return;
        }
        this.general.errorResponse(error['status']);
      });

    // if CAID is transmitted get category and display values
    if (routeParams['CAID']) {

      this.edit = true;
      this.catService.getCategory(routeParams['CAID']).subscribe(
        (data: any = []) => {
          // get category from data
          this.selectedCategory = <Category>data['data'];
          this.insertCategoryForm.patchValue(this.selectedCategory);
        },
        (error: any = []) => {
          if (error['error']['message']) {
            this.navigation.back();
            return;
          }
          this.general.errorResponse(error['status']);
        });

      // get all sub categories
      this.catService.getAllSubCategories(routeParams['CAID']).subscribe(
        (data: any = []) => {
          // get subcategories from data
          this.isParentCat = true;
        },
        (error: any = []) => {
          if (error['error']['message']) {
            this.isParentCat = false;
            return;
          }
          this.general.errorResponse(error['status']);
        });
    } else {
      if(this.catService.parentCAID != 0) {
        this.insertCategoryForm.patchValue({
          parent_categoryID: this.catService.parentCAID
        });
      }
    }
  }

  // for searching through categories
  categorySearcher = (search: string): Observable<any[]> => {
    return of(this.categories.filter(w => w.category_name.includes(search) && w.parent_categoryID === null));
  }

  onInsertCategorySubmit() {
    this.catService.insertCategory(this.insertCategoryForm.value).subscribe(
      (data: any = []) => {
        // if category was inserted go back to previous page
        this.navigation.back();
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          this.navigation.back();
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  onEditCategorySubmit() {
    this.catService.updateCategory(this.insertCategoryForm.value).subscribe(
      (data: any = []) => {
        // if category was updated go back to previous page
        this.navigation.back();
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          this.navigation.back();
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }
}
