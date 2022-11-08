import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Category } from 'src/app/services/category/category';
import { CategoryService } from 'src/app/services/category/category.service';
import { AuthenticationService } from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-insert-category',
  templateUrl: './insert-category.component.html',
  styleUrls: ['./insert-category.component.scss']
})
export class InsertCategoryComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private catService: CategoryService, private router: Router, private route: ActivatedRoute, private authService: AuthenticationService) { }

  insertCategoryForm!: FormGroup;
  selectedCategory!: Category;
  edit!: boolean;

  ngOnInit(): void {

    const routeParams = this.route.snapshot.params;

    if(routeParams['CAID']) {
      this.catService.getCategory(routeParams['CAID']).subscribe((data) => {
        if(data != null) {
          if(data === 'falscher Benutzer') this.router.navigate(['dashboard']);
          if(typeof data === "object") {
            this.selectedCategory = <Category>data;
            this.insertCategoryForm.patchValue(this.selectedCategory);
            if(routeParams['CAID']) this.edit = true;
            else this.edit = false;
          }
        } else alert ("Kategorie konnte nicht geladen werden!");
      });
    }

    this.insertCategoryForm = this.formbuilder.group({
      CAID: [''],
      userID: [''],
      category_name: ['', [Validators.required, Validators.maxLength(30)]]
    });

  }

  onInsertCategorySubmit(){
    console.log(this.insertCategoryForm.value);
    this.catService.insertCategory(this.insertCategoryForm.value, this.authService.getSession()).subscribe(data => {
      console.log(data);
      if(data != null) this.router.navigate(['dashboard']);
      else alert("Kategorie konnte nicht hinzugefügt werden!");
    });
  }

  onEditCategorySubmit() {
    this.catService.updateCategory(this.insertCategoryForm.value, this.authService.getSession()).subscribe(data => {
      console.log(data);
      if(data != null) this.router.navigate(['dashboard']);
      else alert("Kategorie konnte nicht bearbeitet werden!");
    });
  }

}
