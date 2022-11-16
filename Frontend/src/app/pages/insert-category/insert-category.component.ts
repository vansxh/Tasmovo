import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Category} from 'src/app/services/category/category';
import {CategoryService} from 'src/app/services/category/category.service';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {Task} from "../../services/task/task";
import {GeneralService} from "../../services/general/general.service";

@Component({
  selector: 'app-insert-category',
  templateUrl: './insert-category.component.html',
  styleUrls: ['./insert-category.component.scss']
})
export class InsertCategoryComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private catService: CategoryService, private router: Router, private route: ActivatedRoute, private authService: AuthenticationService, private general: GeneralService) {
  }

  insertCategoryForm!: FormGroup;
  selectedCategory!: Category;
  edit!: boolean;

  ngOnInit(): void {

    const routeParams = this.route.snapshot.params;

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
          if(error['error']['message']) {
            this.general.specificErrorResponse(error['error']['message'], "my-categories");
            return;
          }
          this.general.errorResponse(error['status']);
        });
    }

    this.insertCategoryForm = this.formbuilder.group({
      CAID: [''],
      userID: [''],
      category_name: ['', [Validators.required, Validators.maxLength(30)]]
    });

  }

  onInsertCategorySubmit() {

    this.catService.insertCategory(this.insertCategoryForm.value).subscribe(
      (data: any = []) => {
        // if category was inserted reload categories
        this.router.navigate(['my-categories']);
      },
      (error: any = []) => {
        if(error['error']['message']) {
          this.general.specificErrorResponse(error['error']['message'], "my-categories");
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  onEditCategorySubmit() {

    this.catService.updateCategory(this.insertCategoryForm.value).subscribe(
      (data: any = []) => {
        // if category was inserted reload categories
        this.router.navigate(['my-categories']);
      },
      (error: any = []) => {
        if(error['error']['message']) {
          this.general.specificErrorResponse(error['error']['message'], "my-categories");
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

}
