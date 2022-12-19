import {Component, OnInit, ViewEncapsulation, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {Category} from "../../services/category/category";
import {CategoryService} from "../../services/category/category.service";
import { BehaviorSubject } from 'rxjs';
import {SwiperComponent} from "swiper/angular";

// import Swiper core and required modules
import SwiperCore, { Scrollbar, A11y, Keyboard, Pagination, Navigation, Virtual } from 'swiper';
import {PopupFinishComponent} from "../../popups/popup-finish/popup-finish.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import Swiper from "swiper";

// install Swiper modules
SwiperCore.use([Scrollbar, A11y, Keyboard, Pagination, Navigation, Virtual]);

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class CategoryComponent implements OnInit {

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private taskService: TaskService, private general: GeneralService, private catService: CategoryService) {
  }

  public categoryTasks!: Task[];
  public subcategories!: Category[];
  public allTasks!: Task[];
  slides$ = new BehaviorSubject<string[]>(['']);
  category!: Category;

  ngOnInit(): void {

    var swiper = new Swiper('#banner .swiper-container', {
      pagination: true,
      slidesPerView: 1,
      centeredSlides: true,
      spaceBetween: 30,
      loop: true,
      navigation: {
        nextEl: '#banner .swiper-button-next',
        prevEl: '#banner .swiper-button-prev',
      }
    });

    this.slides$.next(
      Array.from({ length: 600 }).map((el, index) => `Slide ${index + 1}`)
    );

    const routeParams = this.route.snapshot.params;

    if (routeParams['CAID']) {


      // get info of category
      this.catService.getCategory(routeParams['CAID']).subscribe(
        (data: any = []) => {
          // get tasks from data
          this.category = <Category>data['data'];
          document.getElementsByTagName("h1")[0].innerText = this.category.category_name;
        },
        (error: any = []) => {
          if(error['error']['message']) {
            alert(error['error']['message']);
            return;
          }
          this.general.errorResponse(error['status']);
        });

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
          console.log(this.allTasks);
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
    this.taskService.terminateTask = task;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupFinishComponent, dialogConfig);
  }

  detailsTask(task: Task): void {
    this.taskService.detailsTask(task.TAID);
  }

  showCategory(category: Category): void {
    this.catService.showSubCategory(category.CAID);
  }

  onSlideChange(swiper: any) {
      console.log(swiper);
  }

}
