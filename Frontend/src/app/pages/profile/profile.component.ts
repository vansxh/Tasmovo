import {AfterViewInit, Component, OnInit} from '@angular/core';
import {AuthenticationService} from "../../services/authentication/authentication.service";
import {TaskService} from "../../services/task/task.service";
import {GeneralService} from "../../services/general/general.service";
import {Task} from "../../services/task/task";
import {CategoryService} from "../../services/category/category.service";
import {Category} from "../../services/category/category";
import {User} from "../../services/authentication/user";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ErrorStateMatcher} from '@angular/material/core';
import {StresstrackingService} from "../../services/stresstracking/stresstracking.service";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, AfterViewInit {

  constructor(private auth: AuthenticationService, private taskService: TaskService, private general: GeneralService, private catService: CategoryService, private formBuilder: FormBuilder, private stress: StresstrackingService) {
  }

  allTasks!: Task[];
  finishedTasks!: Task[];
  allCategories!: Category[];
  allTasksLength!: number;
  allFinishedTasksLength!: number;
  allCategoriesLength = 0;

  currentUser!: User;

  weeklyAverage!: number;

  userForm!: FormGroup;
  changeUsername!: boolean;
  changeFirstname!: boolean;
  changeLastname!: boolean;
  changeStressLimit!: boolean;
  matcher!: ErrorStateMatcher;


  userLoaded!: boolean;
  isLoading!: boolean;


  ngOnInit(): void {
    this.isLoading = true;
    this.userLoaded = false;
    //For error messages

    this.setBooleansFalse();
    this.getWeeklyAvg();
    this.getData();
    //this.matcher = new ErrorStateMatcher();

    document.getElementsByTagName("h1")[0].innerText = "Profil";
  }

  ngAfterViewInit(): void {
    this.isLoading = false;
  }

  logout() {
    this.auth.logout(['Logout']).subscribe((data: any = []) => {
      this.auth.deleteToken();
      window.location.href = window.location.href;
    }, (error: any = []) => {
      if (error['error']['message']) {
        alert(error['error']['message']);
        return;
      }
      this.general.errorResponse(error['status']);
    });
  }

  changeForm() {
    this.userForm = this.formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(30)]],
      lastName: ['', [Validators.required, Validators.maxLength(30)]],
      username: ['', [Validators.required, Validators.minLength(4), Validators.maxLength(30)]],
      stressLimit: ['', Validators.required]
    });
    this.userForm.setValue({
      firstName: this.currentUser.firstName,
      lastName: this.currentUser.lastName,
      username: this.currentUser.username,
      stressLimit: this.currentUser.stress_limit
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
        this.currentUser = <User>data['data'];

        this.changeForm();
        this.userLoaded = true;
        //this.matcher = new ErrorStateMatcher();
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          this.userLoaded = true;
          return;
        }
        this.general.errorResponse(error['status']);
        this.userLoaded = true;
      });

  }

  getWeeklyAvg() {
    this.stress.getWeeklyAvg().subscribe((data: any = []) => {
      //console.log(data['data']['0']['Average']);
      this.weeklyAverage = data['data']['0']['Average'];
      if (this.weeklyAverage == 10.00) {
        this.weeklyAverage = 10;
      } else if (this.weeklyAverage == 0.00 || this.weeklyAverage == null) {
        this.weeklyAverage = 0;
      }
      //console.log(this.weeklyAverage);
    }, (error: any = []) => {
      if (error['error']['message']) {
        alert(error['error']['message']);
        return;
      }
      this.general.errorResponse(error['status']);
    });
  }

  setBooleansFalse() {
    this.changeFirstname = false;
    this.changeLastname = false;
    this.changeUsername = false;
    this.changeStressLimit = false;
  }

  onUserFormSubmit() {
    //console.log(this.userForm.value);
    this.auth.updateUser(this.userForm.value).subscribe((data: any = []) => {
      this.ngOnInit();
      this.ngAfterViewInit();
    }, (error: any = []) => {
      if (error['error']['message']) {
        alert(error['error']['message']);
        return;
      }
      this.general.errorResponse(error['status']);
    });
  }


}
