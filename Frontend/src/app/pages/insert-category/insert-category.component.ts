import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Category} from 'src/app/services/category/category';
import {CategoryService} from 'src/app/services/category/category.service';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {Task} from "../../services/task/task";

@Component({
  selector: 'app-insert-category',
  templateUrl: './insert-category.component.html',
  styleUrls: ['./insert-category.component.scss']
})
export class InsertCategoryComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private catService: CategoryService, private router: Router, private route: ActivatedRoute, private authService: AuthenticationService) {
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
          if (data['error'] == false) {
            // get category from data
            this.selectedCategory = <Category>data['data'];
            this.insertCategoryForm.patchValue(this.selectedCategory);
          } else {
            this.router.navigate(['my-categories']);
          }
        },
        (error) => {
          let response = error.status;

          switch (response) {
            case 403:
              // if it's not the user's category
              this.router.navigate(['my-categories']);
              break;
            case 404:
              alert("Kategorie konnte nicht geladen werden!");
              this.router.navigate(['my-categories']);
              break;
            default:
              this.router.navigate(['my-categories']);
          }
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
        if (data['error'] == false) this.router.navigate(['my-categories']);
      },
      (error) => {
        if(error.status == 400) alert("Kategorie konnte nicht hinzugefügt werden!");
        else this.router.navigate(['my-categories']);
      });
  }

  onEditCategorySubmit() {

    this.catService.updateCategory(this.insertCategoryForm.value).subscribe(
      (data: any = []) => {
        // if category was inserted reload categories
        if (data['error'] == false) this.router.navigate(['my-categories']);
      },
      (error) => {
        let response = error.status;

        switch (response) {
          case 403:
            // if it's not the user's category
            this.router.navigate(['my-categories']);
            break;
          case 400:
            alert("Kategorie konnte nicht bearbeitet werden!");
            this.router.navigate(['my-categories']);
            break;
          default:
            this.router.navigate(['my-categories']);
        }
      });
  }

}
