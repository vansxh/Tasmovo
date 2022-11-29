import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {Category} from "../../services/category/category";
import {CategoryService} from "../../services/category/category.service";
import {SwiperComponent} from "swiper/angular";

// import Swiper core and required modules
import SwiperCore, {A11y, Navigation, Pagination, Scrollbar} from 'swiper';

// install Swiper modules
SwiperCore.use([Navigation, Pagination, Scrollbar, A11y]);

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryComponent implements OnInit {

  constructor(private route: ActivatedRoute, private taskService: TaskService, private general: GeneralService, private catService: CategoryService) {
  }

  public categoryTasks!: Task[];
  public subcategories!: Category[];
  public allTasks!: Task[];

  ngOnInit(): void {
    const routeParams = this.route.snapshot.params;

    if (routeParams['CAID']) {


      // get tasks of parent category
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

      // get all tasks
      this.taskService.getAllTasks().subscribe(
        (data: any = []) => {
          // get tasks from data
          this.allTasks = <Task[]>data['data'];
        },
        (error: any = []) => {
          if(error['error']['message']) {
            alert(error['error']['message']);
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

  onSlideChange(swiper: any) {
      console.log(swiper);
  }

}
