import {Component, OnInit} from '@angular/core';
import {ThemePalette} from '@angular/material/core';
import {ProgressSpinnerMode} from '@angular/material/progress-spinner';
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {Task} from "../../services/task/task";
import {CategoryService} from "../../services/category/category.service";
import {Category} from "../../services/category/category";
import {User} from "../../services/authentication/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

  constructor(private auth: AuthenticationService, private taskService: TaskService, private general: GeneralService, private catService: CategoryService, private formBuilder: FormBuilder) {
  }

  /*color: ThemePalette = 'primary';
  mode: ProgressSpinnerMode = 'determinate';
  value = 50;*/
  allTasks!: Task[];
  finishedTasks!: Task[];
  allCategories!: Category[];
  allTasksLength!: number;
  allFinishedTasksLength!: number;
  allCategoriesLength!: number;
  currentUser!: User;
  userForm!: FormGroup;


  ngOnInit(): void {
    this.changeForm();

    this.getData();
  }

  logout() {
    this.auth.logout(['Logout']).subscribe((data: any = []) => {
      //console.log(data);
      if (data['error'] == false) {
        this.auth.deleteToken();
        window.location.href = window.location.href;
      } else {
        alert("Logout failed");
      }
    });
  }

  changeForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.maxLength(30)]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(30)]]
    });
  }

  getData() {
    this.taskService.getAllTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.allTasks = <Task[]>data['data'];
        this.allTasksLength = this.allTasks.length;
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

    this.taskService.getFinishedTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.finishedTasks = <Task[]>data['data'];
        this.allFinishedTasksLength = this.finishedTasks.length;
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

    this.catService.getAllCategoriesByUser().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.allCategories = <Category[]>data['data'];
        this.allCategoriesLength = this.allCategories.length;
      },
      (error: any = []) => {
        if (error['status'] == 404) {
          this.allCategoriesLength = 0;
        } else {
          this.general.errorResponse(error['status']);
        }

      });

    this.auth.getUser().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.currentUser = data['data'];
        this.currentUser.firstName = data['data']['first_name'];
        this.currentUser.lastName = data['data']['last_name'];
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);

      });
  }

}
