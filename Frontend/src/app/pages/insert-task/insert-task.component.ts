import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {Router, ActivatedRoute} from '@angular/router';
import {Task} from 'src/app/services/task/task';
import {TaskService} from '../../services/task/task.service';
import {DatePipe} from '@angular/common';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {GeneralService} from "../../services/general/general.service";
import {Category} from "../../services/category/category";
import {CategoryService} from "../../services/category/category.service";
import * as moment from 'moment';
import {Observable, of} from "rxjs";
import {NavigationService} from "../../services/navigation/navigation.service";

@Component({
  selector: 'app-insert-task',
  templateUrl: './insert-task.component.html',
  styleUrls: ['./insert-task.component.scss']
})
export class InsertTaskComponent implements OnInit {

  constructor(private navigation: NavigationService, private formbuilder: FormBuilder, private taskService: TaskService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe, private authService: AuthenticationService, private general: GeneralService, private catService: CategoryService) {
  }

  insertTaskForm!: FormGroup;
  selectedTask!: Task;
  edit!: boolean;
  categories!: Category[];
  subcategories!: Category[];
  nowDate!: string;

  ngOnInit(): void {

    this.nowDate = this.datePipe.transform(new Date(), 'yyyy-MM-dd', 'de-AT') || '';

    this.getInsertData();
    this.getDropdownCategories();

    this.insertTaskForm = this.formbuilder.group({
      TAID: [''],
      task_name: ['', [Validators.required, Validators.maxLength(20), Validators.pattern('^[a-zA-Z0-9äÄöÖüÜß \'\-]+$')]],
      deadlineDay: new FormControl(this.datePipe.transform(this.nowDate, 'yyyy-MM-DD', 'de-AT'), [Validators.required]),
      deadlineHour: ['', Validators.required],
      notes: [''],
      categoryID: [''],
      subcategoryID: ['']
    });
  }

  getInsertData() {
    const routeParams = this.route.snapshot.params;

    // modify headings
    let h1 = document.getElementsByTagName("h1");
    if (routeParams['TAID']) {
      for (let i = 0; i < h1.length; i++) {
        h1[i].innerText = "Task bearbeiten";
      }
    } else {
      for (let i = 0; i < h1.length; i++) {
        h1[i].innerText = "Neuer Task";
      }
    }

    // if TAID is transmitted get task and display values
    if (routeParams['TAID']) {

      this.edit = true;
      this.taskService.getTask(routeParams['TAID']).subscribe(
        (data: any = []) => {
          // get task from data
          this.selectedTask = <Task>data['data'];
          this.onChangeCategory(this.selectedTask.categoryID);
          // fix deadline for input form
          let deadline = new Date(this.selectedTask.deadline);
          this.selectedTask.deadlineDay = this.datePipe.transform(deadline, 'yyyy-MM-dd', 'de-AT') || '';
          this.selectedTask.deadlineHour = this.datePipe.transform(deadline, 'HH:mm', 'de-AT') || '';
          this.selectedTask.notes = this.selectedTask.notes.replaceAll("<br/>", "\r\n");
          this.selectedTask.notes = this.decodeSpecialCharacters(this.selectedTask.notes);
          this.selectedTask.task_name = this.decodeSpecialCharacters(this.selectedTask.task_name);
          this.insertTaskForm.patchValue(this.selectedTask);
          if(deadline < new Date()) {
            this.nowDate = this.datePipe.transform(deadline, 'yyyy-MM-dd', 'de-AT') || '';
          }
        },
        (error: any = []) => {
          if (error['error']['message']) {
            this.navigation.back();
            return;
          }
          this.general.errorResponse(error['status']);
        });
    }
  }

  getDropdownCategories() {
    // get all categories from a user for dropdown
    this.catService.getCategoriesByUser().subscribe(
      (data: any = []) => {
        // get categories from data
        this.categories = <Category[]>data['data'];
      },
      (error: any = []) => {
        if (error['error']['message']) {
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  // for searching through subcategories
  subCategorySearcher = (search: string): Observable<any[]> => {
    return of(this.subcategories.filter(w => w.category_name.includes(search)));
  }

  // for searching through categories
  categorySearcher = (search: string): Observable<any[]> => {
    return of(this.categories.filter(w => w.category_name.includes(search) && w.parent_categoryID === null));
  }

  onInsertTaskSubmit() {
    this.insertTaskForm.value.deadlineDay = this.insertTaskForm.value.deadlineDay.format('yyyy-MM-DD');
    this.taskService.insertTask(this.insertTaskForm.value).subscribe(
      (data: any = []) => {
        // if task was inserted go back to previous page
        this.navigation.back();
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          this.navigation.back();
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  onEditTaskSubmit() {
    this.insertTaskForm.value.deadlineDay = (moment(this.insertTaskForm.value.deadlineDay)).format('yyyy-MM-DD');
    this.taskService.updateTask(this.insertTaskForm.value).subscribe(
      (data: any = []) => {
        // if task was updated display task
        if (window.innerWidth > 768) {
          this.navigation.back();
        }
        this.taskService.detailsTask(this.insertTaskForm.value.TAID);
      },
      (error: any = []) => {
        if (error['error']['message']) {
          alert(error['error']['message']);
          this.navigation.back();
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
        if (error['error']['message']) {
          this.subcategories = [];
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  decodeSpecialCharacters(str: string){
    return this.general.decodeHtmlCharCodes(str);
  }
}
