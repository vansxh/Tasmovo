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

    if (routeParams['CAID']) {

      this.edit = true;
      this.catService.getCategory(routeParams['CAID']).subscribe(
        (data: any = []) => {

          if (data['error'] == false) {
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



      /*this.catService.getCategory(routeParams['CAID']).subscribe((data) => {
        if (data != null) {
          if (data === 'falscher Benutzer') this.router.navigate(['dashboard']);
          if (typeof data === "object") {
            this.selectedCategory = <Category>data;
            this.insertCategoryForm.patchValue(this.selectedCategory);
            if (routeParams['CAID']) this.edit = true;
            else this.edit = false;
          }
        } else alert("Kategorie konnte nicht geladen werden!");
      });*/
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
        if (data['error'] == false) this.router.navigate(['my-categories']);
      },
      (error) => {
        if(error.status == 400) alert("Kategorie konnte nicht hinzugefügt werden!");
        else this.router.navigate(['my-categories']);
      });

    /*
    this.catService.insertCategory(this.insertCategoryForm.value).subscribe(data => {
      console.log(data);
      if (data != null) this.router.navigate(['dashboard']);
      else alert("Kategorie konnte nicht hinzugefügt werden!");
    });*/
  }

  onEditCategorySubmit() {

    this.catService.updateCategory(this.insertCategoryForm.value).subscribe(
      (data: any = []) => {
        if (data['error'] == false) this.router.navigate(['my-categories']);
      },
      (error) => {
        let response = error.status;

        switch (response) {
          case 403:
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


    /*
    this.catService.updateCategory(this.insertCategoryForm.value).subscribe(data => {
      if (data != null) this.router.navigate(['dashboard']);
      else alert("Kategorie konnte nicht bearbeitet werden!");
    });*/
  }

}
