import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, Params, ActivatedRoute} from '@angular/router';
import {Task} from 'src/app/services/task/task';
import {TaskService} from '../../services/task/task.service';
import {DatePipe} from '@angular/common';
import {LOCALE_ID} from '@angular/core';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {GeneralService} from "../../services/general/general.service";
import {Category} from "../../services/category/category";
import {CategoryService} from "../../services/category/category.service";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {NgxMatTimepickerModule} from "ngx-mat-timepicker";



@Component({
  selector: 'app-insert-task',
  templateUrl: './insert-task.component.html',
  styleUrls: ['./insert-task.component.scss']
})
export class InsertTaskComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private taskService: TaskService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe, private authService: AuthenticationService, private general: GeneralService, private catService: CategoryService, private matDatePicker: MatDatepickerModule, private matTimePicker: NgxMatTimepickerModule) {
  }

  insertTaskForm!: FormGroup;
  selectedTask!: Task;
  edit!: boolean;
  categories!: Category[];
  subcategories!: Category[];
  nowDate!: string;
  formatNumber: number = 24;

  ngOnInit(): void {

    this.nowDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd', 'de-AT') || '';

    const routeParams = this.route.snapshot.params;

    // if TAID is transmitted get task and display values
    if (routeParams['TAID']) {

      this.edit = true;
      this.taskService.getTask(routeParams['TAID']).subscribe(
        (data: any = []) => {
            // get task from data
            this.selectedTask = <Task>data['data'];
            console.log(this.selectedTask);
            // fix deadline for input form
            let deadline = new Date(this.selectedTask.deadline);
            this.selectedTask.deadlineDay = this.datePipe.transform(deadline, 'yyyy-MM-dd', 'de-AT') || '';
            this.selectedTask.deadlineHour = this.datePipe.transform(deadline, 'HH:mm', 'de-AT') || '';
            this.insertTaskForm.patchValue(this.selectedTask);
        },
        (error: any = []) => {
          if(error['error']['message']) {
            this.general.specificErrorResponse(error['error']['message'], "dashboard");
            return;
          }
          this.general.errorResponse(error['status']);
        });
    }

    // get all categories from a user for dropdown
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

    this.insertTaskForm = this.formbuilder.group({
      TAID: [''],
      task_name: ['', [Validators.required, Validators.maxLength(30)]],
      deadlineDay: new FormControl(this.datePipe.transform(this.nowDate, 'yyyy-MM-DD', 'de-AT'), [Validators.required]),
      deadlineHour: ['', Validators.required],
      notes: [''],
      categoryID: [''],
      subcategoryID: ['']
    });
  }

  onInsertTaskSubmit() {
    this.insertTaskForm.value.deadlineDay = this.insertTaskForm.value.deadlineDay.format('yyyy-MM-DD');
    this.taskService.insertTask(this.insertTaskForm.value).subscribe(
      (data: any = []) => {
        // if task was inserted reload tasks
        this.router.navigate(['dashboard']);
      },
      (error: any = []) => {
        if(error['error']['message']) {
          this.general.specificErrorResponse(error['error']['message'], "dashboard");
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  onEditTaskSubmit() {
    this.insertTaskForm.value.deadlineDay = this.insertTaskForm.value.deadlineDay.format('yyyy-MM-DD');
    this.taskService.updateTask(this.insertTaskForm.value).subscribe(
      (data: any = []) => {
        // if task was inserted reload tasks
        this.router.navigate(['dashboard']);
      },
      (error: any = []) => {
        if(error['error']['message']) {
          this.general.specificErrorResponse(error['error']['message'], "dashboard");
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  onChangeCategory(event: number) {
    this.catService.getAllSubCategories(event).subscribe(
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
