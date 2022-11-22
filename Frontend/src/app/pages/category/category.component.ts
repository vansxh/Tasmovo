import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {Category} from "../../services/category/category";
import {CategoryService} from "../../services/category/category.service";

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss']
})
export class CategoryComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskService: TaskService, private general: GeneralService, private catService: CategoryService) {
  }

  public categoryTasks!: Task[];
  public subcategories!: Category[];

  ngOnInit(): void {
    const routeParams = this.route.snapshot.params;

    if (routeParams['CAID']) {
      // get  next tasks
      this.taskService.getCategoryTasks(routeParams['CAID']).subscribe(
        (data: any = []) => {
          // get tasks from data
          this.categoryTasks = <Task[]>data['data'];
        },
        (error: any = []) => {
          if(error['error']['message']) {
            alert(error['error']['message']);
            return;
          }
          this.general.errorResponse(error['status']);
        });

      // get all sub categories
      this.catService.getAllSubCategories(routeParams['CAID']).subscribe(
        (data: any = []) => {
          // get subcategories from data
          this.subcategories = <Category[]>data['data'];
        },
        (error: any = []) => {
          if(error['error']['message']) {
            alert(error['error']['message']);
            this.subcategories = [];
            return;
          }
          this.general.errorResponse(error['status']);
        });
    }
  }

  finishTask(task: Task): void {
    this.taskService.finishTask(task).subscribe(
      (data: any = []) => {
        // update view if finishing was successful
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

  showCategory(category: Category): void {
    this.catService.showSubCategory(category.CAID);
  }

}
