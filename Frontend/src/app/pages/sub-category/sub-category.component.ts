import {Component, OnInit} from '@angular/core';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {ActivatedRoute} from "@angular/router";
import {PopupFinishComponent} from "../../popups/popup-finish/popup-finish.component";
import {MatDialog, MatDialogConfig} from "@angular/material/dialog";
import {Category} from "../../services/category/category";
import {CategoryService} from "../../services/category/category.service";

@Component({
  selector: 'app-sub-category',
  templateUrl: './sub-category.component.html',
  styleUrls: ['./sub-category.component.scss']
})
export class SubCategoryComponent implements OnInit {

  constructor(private catService: CategoryService, private route: ActivatedRoute, private taskService: TaskService, private general: GeneralService, private dialog: MatDialog) {
  }
  public categoryTasks!: Task[];
  subcategory!: Category;
  parentCategory!: Category;

  loadAllTasks = 10;
  loadFinishedTasks = 10;

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

      // get info of subcategory
      this.catService.getCategory(routeParams['CAID']).subscribe(
        (data: any = []) => {
          // get tasks from data
          this.subcategory = <Category>data['data'];
          console.log('sub: ' + this.subcategory.category_name);
          document.getElementsByTagName("h1")[0].innerText = this.subcategory.category_name;

          if(this.subcategory.parent_categoryID) {
            // get info of parent category
            this.catService.getCategory(this.subcategory.parent_categoryID).subscribe(
              (data: any = []) => {
                // get tasks from data
                this.parentCategory = <Category>data['data'];
                console.log('parent: ' + this.parentCategory.category_name);
                document.getElementsByTagName("h1")[0].innerText = this.parentCategory.category_name;
              },
              (error: any = []) => {
                if (error['error']['message']) {
                  alert(error['error']['message']);
                  return;
                }
                this.general.errorResponse(error['status']);
              });
          }

        },
        (error: any = []) => {
          if(error['error']['message']) {
            alert(error['error']['message']);
            return;
          }
          this.general.errorResponse(error['status']);
        });

    }
    this.checkWindowSize();
    window.addEventListener("resize", this.checkWindowSize);
  }

  getSubcategoryName(): string {
    console.log(this.subcategory.category_name)
    if(!this.subcategory.parent_categoryID) {
      return "Allgemein";
    } else {
      return this.subcategory.category_name;
    }
  }

  detailsTask(task: Task): void {
    this.taskService.detailsTask(task.TAID);
  }

  finishTask(task: Task): void {
    this.taskService.terminateTask = task;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupFinishComponent, dialogConfig);
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

  scrollToNotDone() {
    const id = 'notDone-container';
    const yOffset = -200;
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }

  scrollToDone() {
    const id = 'done-container';
    const yOffset = -200;
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset + yOffset;
      window.scrollTo({top: y, behavior: 'smooth'});
    }
  }

  checkWindowSize() {
    const progressbar = document.getElementById("progressbar-head")!;
    if(window.innerWidth <= 768) {
      progressbar.classList.add("top-fixed");
    } else {
      progressbar.classList.remove("top-fixed");
    }
  }

  changeDay(day: number) {
    // get buttons for changing between days
    const notDone = document.getElementById('notDone-btn');
    const done = document.getElementById('done-btn');
    // if today was clicked
    if (day === 1) {
      if (notDone && done) {
        notDone.classList.remove('btn-outline-primary');
        notDone.classList.remove('btn-light');
        notDone.classList.add('btn-primary');
        done.classList.remove('btn-primary');
        done.classList.add('btn-outline-primary');
        done.classList.add('btn-light');
      }
      // if tomorrow was clicked
    } else if (day === 2) {
      if (notDone && done) {
        notDone.classList.remove('btn-primary');
        notDone.classList.add('btn-outline-primary');
        notDone.classList.add('btn-light');
        done.classList.remove('btn-outline-primary');
        done.classList.remove('btn-light');
        done.classList.add('btn-primary');
      }
    }
  }

}
