import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {Task} from "../../services/task/task";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {PopupFinishComponent} from "../../popups/popup-finish/popup-finish.component";
import {MatDialog, MatDialogConfig} from '@angular/material/dialog';
import {Router} from '@angular/router';
import { NavigationService } from '../../services/navigation/navigation.service'
import { Category } from 'src/app/services/category/category';
import {CategoryService} from "../../services/category/category.service";

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrls: ['./task.component.scss']
})
export class TaskComponent implements OnInit {

  constructor(private catService: CategoryService ,private navigation: NavigationService, private router: Router, private dialog: MatDialog, private route: ActivatedRoute, private taskService: TaskService, private general: GeneralService) { }

  task!: Task;
  taskID!: number;
  category!: Category;
  subcategory!: Category;

  ngOnInit(): void {

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

        // get category
        this.catService.getCategory(this.task.categoryID).subscribe(
          (data: any = []) => {
            // get category from data
            this.category = <Category>data['data'];
            console.log(this.category);

            // get subcategory
            this.catService.getCategory(this.task.subcategoryID).subscribe(
              (data: any = []) => {
                // get category from data
                this.subcategory = <Category>data['data'];
                console.log(this.subcategory);
              },
              (error: any = []) => {
                if(error['error']['message']) {
                  alert(error['error']['message']);
                  return;
                }
                this.general.errorResponse(error['status']);
              });
          },
          (error: any = []) => {
            if(error['error']['message']) {
              alert(error['error']['message']);
              return;
            }
            this.general.errorResponse(error['status']);
          });

        // change heading
        if(window.innerWidth <= 768) {
          document.getElementsByTagName('h1')[0].innerText = this.task.task_name;
        } else {
          document.getElementById('detail-task-heading')!.innerText = this.task.task_name;
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
        if(error['error']['message']) {
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
    this.taskService.deleteTask(this.task.TAID).subscribe(
      (data: any = []) => {
        // update view if deleting was successful
        this.router.navigate(['/dashboard']);
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  back(): void {
    this.navigation.back()
  }

  closePopUp(): void {
    this.taskService.closePopUp();
  }

}
