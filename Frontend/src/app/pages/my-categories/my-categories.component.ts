import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../../services/category/category.service';
import {Category} from "../../services/category/category";
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {GeneralService} from "../../services/general/general.service";
import {TaskService} from "../../services/task/task.service";
import {Task} from "../../services/task/task";

@Component({
  selector: 'app-my-categories',
  templateUrl: './my-categories.component.html',
  styleUrls: ['./my-categories.component.scss']
})
export class MyCategoriesComponent implements OnInit {

  public categories!: Category[];

  constructor(private catService: CategoryService, private authService: AuthenticationService, private general: GeneralService, private taskService: TaskService) {
  }

  ngOnInit(): void {

    // get all categories from a user
    this.catService.getCategoriesByUser().subscribe(
      (data: any = []) => {
          // get categories from data
          this.categories = <Category[]>data['data'];
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

    document.getElementsByTagName("h1")[0].innerText = "Meine Kategorien";

  }

  deleteCategory(category: Category): void {
    this.catService.deleteCategory(category.CAID).subscribe(
      (data: any = []) => {
        // update view if deleting was successful
        this.ngOnInit();
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  editCategory(category: Category): void {
    this.catService.editCategory(category.CAID);
  }

  addCategory(): void {
    this.catService.addCategory();
  }

  showCategory(category: Category): void {
    this.catService.showCategory(category.CAID);
  }

  getNumberTasks(category: Category): number {
    this.taskService.getCategoryTasks(category.CAID).subscribe(
      (data: any = []) => {
        // get tasks from data
        console.log(data['data'].length);
        //return data['data'].length;
        //this.categoryTasks = <Task[]>data['data'];
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
    return 0;
  }

}
