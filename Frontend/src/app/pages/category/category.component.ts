import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {Category} from "../../services/category/category";
import {CategoryService} from "../../services/category/category.service";
import {faPencil} from "@fortawesome/free-solid-svg-icons";
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {faCirclePlus} from '@fortawesome/free-solid-svg-icons';

// import Swiper core and required modules
import SwiperCore, {Scrollbar, A11y, Keyboard, Pagination, Navigation, Virtual} from 'swiper';
import {PopupFinishComponent} from "../../popups/popup-finish/popup-finish.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import Swiper from "swiper";
import {ConfirmationDialogComponent} from "../../popups/confirmation-dialog/confirmation-dialog.component";

// install Swiper modules
SwiperCore.use([Scrollbar, A11y, Keyboard, Pagination, Navigation, Virtual]);

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class CategoryComponent implements OnInit {

  constructor(private dialog: MatDialog, private route: ActivatedRoute, private taskService: TaskService, private general: GeneralService, private catService: CategoryService, private router: Router) {
  }

  public categoryTasks!: Task[];
  public subcategories!: Category[];
  public allTasks!: Task[];
  category!: Category;

  faEdit = faPencil;
  faTrash = faTrash;
  faCircleX = faCirclePlus;

  ngOnInit(): void {

    new Swiper('#banner .swiper-container', {
      pagination: true,
      slidesPerView: 2,
      centeredSlides: true,
      spaceBetween: 10,
      loop: true,
      navigation: {
        nextEl: '#banner .swiper-button-next',
        prevEl: '#banner .swiper-button-prev',
      }
    });

    // get data and modify headings
    this.getCategoryData();
  }

  getCategoryData() {
    let h1 = document.getElementsByTagName("h1");
    const routeParams = this.route.snapshot.params;

    if (routeParams['CAID']) {

      // get info of category
      this.catService.getCategory(routeParams['CAID']).subscribe(
        (data: any = []) => {
          // get category from data
          this.category = <Category>data['data'];
          for (let i = 0; i < h1.length; i++) {
            h1[i].innerText = this.decodeSpecialCharacters(this.category.category_name);
          }
        },
        (error: any = []) => {
          if (error['error']['message']) {
            this.router.navigate(['my-categories']);
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
          if (error['error']['message']) {
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
          if (error['error']['message']) {
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
          if (error['error']['message']) {
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

  deleteCategory(category: Category): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Möchtest du diese Subkategorie wirklich löschen?'
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
    this.catService.addCategory(this.category.CAID);
  }

  decodeSpecialCharacters(str: string){
    return this.general.decodeHtmlCharCodes(str);
  }
}
