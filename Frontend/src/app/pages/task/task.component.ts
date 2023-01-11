import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {PopupFinishComponent} from "../../popups/popup-finish/popup-finish.component";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';
import {NavigationService} from '../../services/navigation/navigation.service'
import {Category} from 'src/app/services/category/category';
import {CategoryService} from "../../services/category/category.service";
import {faXmark} from '@fortawesome/free-solid-svg-icons';
import {faPencil} from '@fortawesome/free-solid-svg-icons';
import {faTrash} from '@fortawesome/free-solid-svg-icons';
import {ConfirmationDialogComponent} from "../../popups/confirmation-dialog/confirmation-dialog.component";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor(private catService: CategoryService, private navigation: NavigationService, private router: Router, private dialog: MatDialog, private route: ActivatedRoute, private taskService: TaskService, private general: GeneralService) {
  }

  task!: Task;
  taskID!: number;
  category!: Category;
  subcategory!: Category;
  faXmark = faXmark;
  faEdit = faPencil;
  faTrash = faTrash;

  ngOnInit(): void {
    this.getAllTaskData();
  }

  getAllTaskData() {
    const routeParams = this.route.snapshot.params;

    if (routeParams['TAID']) {
      this.taskID = routeParams['TAID'];
    } else {
      this.taskID = this.taskService.detailTask;
    }

    // get task
    this.taskService.getTask(this.taskID).subscribe(
      (data: any = []) => {
        // get task from data
        this.task = <Task>data['data'];
        let h1 = document.getElementsByTagName("h1");

        if (window.location.pathname.includes("/task")) {
          for (let i = 0; i < h1.length; i++) {
            h1[i].innerText = this.task.task_name;
          }
        }
        // get category
        if(this.task.categoryID) {
          this.catService.getCategory(this.task.categoryID).subscribe(
            (data: any = []) => {
              // get category from data
              this.category = <Category>data['data'];

              // get subcategory
              this.catService.getCategory(this.task.subcategoryID).subscribe(
                (data: any = []) => {
                  // get category from data
                  this.subcategory = <Category>data['data'];
                },
                (error: any = []) => {
                  if (error['error']['message']) {
                    alert(error['error']['message']);
                    return;
                  }
                  this.general.errorResponse(error['status']);
                });
            },
            (error: any = []) => {
              if (error['error']['message']) {
                alert(error['error']['message']);
                return;
              }
              this.general.errorResponse(error['status']);
            });
        }
        // change heading
        if (window.innerWidth <= 768) {
          let h1 = document.getElementsByTagName("h1");
          for (let i = 0; i < h1.length; i++) {
              h1[i].innerText = this.task.task_name;
          }

          let marginMobile = document.getElementById("mobile-content-margin");
          marginMobile?.classList.add("mobile-margin-content");
        } else {
          if(document.getElementById('detail-task-heading')) {
            document.getElementById('detail-task-heading')!.innerText = this.task.task_name;
          }
          let marginMobile = document.getElementById("mobile-content-margin");
          marginMobile?.classList.remove("mobile-margin-content");
        }

      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  finishTask() {
    this.taskService.terminateTask = this.task;
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    this.dialog.open(PopupFinishComponent, dialogConfig);
  }

  unfinishTask() {
    // get task
    this.taskService.unfinishTask(this.task).subscribe(
      (data: any = []) => {
        window.location.reload();
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  editTask(): void {
    this.taskService.editTask(this.task.TAID);
  }

  deleteTask(): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        message: 'Möchtest du diesen Task wirklich löschen?'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.taskService.deleteTask(this.task.TAID).subscribe(
          (data: any = []) => {
            // update view if deleting was successful
            this.router.navigate(['/dashboard']);
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

  back(): void {
    this.navigation.back()
  }

  closePopUp(): void {
    this.taskService.closePopUp();
  }

}
