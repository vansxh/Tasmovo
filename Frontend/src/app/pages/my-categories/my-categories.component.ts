import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../services/category/category.service';
import {Category} from "../../services/category/category";
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {GeneralService} from "../../services/general/general.service";
import {TaskService} from "../../services/task/task.service";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {faCirclePlus} from '@fortawesome/free-solid-svg-icons';
import {ConfirmationDialogComponent} from "../../popups/confirmation-dialog/confirmation-dialog.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-my-categories',
  templateUrl: './my-categories.component.html',
  styleUrls: ['./my-categories.component.scss']
})
export class MyCategoriesComponent implements OnInit {

  public categories!: Category[];

  faEdit = faPencil;
  faTrash = faTrash;
  faCircleX = faCirclePlus;

  constructor(private catService: CategoryService, private authService: AuthenticationService, private general: GeneralService, private taskService: TaskService, private dialog: MatDialog) {
  }

  ngOnInit(): void {
    // modify headings
    let h1 = document.getElementsByTagName("h1");
    for (let i = 0; i < h1.length; i++) {
      h1[i].innerText = "Meine Kategorien";
    }

    this.getAllCategories();
  }

  getAllCategories() {
    // get all categories from a user
    this.catService.getCategoriesByUser().subscribe(
      (data: any = []) => {
        // get categories from data
        this.categories = <Category[]>data['data'];
      },
      (error: any = []) => {
        if (error['error']['message']) {
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Möchtest du diese Kategorie wirklich löschen?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.catService.deleteCategory(category.CAID).subscribe(
          (data: any = []) => {
            // update view if deleting was successful
            this.ngOnInit();
          },
          (error: any = []) => {
            if (error['error']['message']) {
              alert(error['error']['message']);
              return;
            }
            this.general.errorResponse(error['status']);
          });
      }
    });
  }

  editCategory(category: Category): void {
    this.catService.editCategory(category.CAID);
  }

  addCategory(): void {
    this.catService.addCategory(0);
  }

  showCategory(category: Category): void {
    this.catService.showCategory(category.CAID);
  }

  decodeSpecialCharacters(str: string){
    return this.general.decodeHtmlCharCodes(str);
  }
}
