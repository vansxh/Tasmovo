import {Component, OnInit} from '@angular/core';
import {CategoryService} from 'src/app/services/category/category.service';
import {Category} from 'src/app/services/category/category';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {Router} from '@angular/router';
import {FormBuilder, FormControl, FormGroup} from "@angular/forms";
import {Observable, startWith, map} from "rxjs";
import {TaskService} from "../../services/task/task.service";
import {Task} from "../../services/task/task";
import {GeneralService} from "../../services/general/general.service";
import {faSearch} from "@fortawesome/free-solid-svg-icons";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  public categories!: Category[];

  formGroup!: FormGroup;
  options!: Task[];
  allTasksArray!: Task[];
  taskNames!: string[];
  filteredOptions!: any;

  faSearch = faSearch;

  constructor(private authService: AuthenticationService, private router: Router, private taskService: TaskService, private general: GeneralService, private fb: FormBuilder) {
  }

  ngOnInit(): void {
    // change heading
    let h1 = document.getElementsByTagName("h1");
    for (let i = 0; i < h1.length; i++) {  h1[i].innerText = "Übersicht";}

    this.initForm();
    this.getAllTasks();
  }

  allTasks(): void {
    this.router.navigate(['/all-tasks']);
  }

  singleTasks(): void {
    this.router.navigate(['/single-tasks']);
  }

  allCategories(): void {
    this.router.navigate(['/my-categories']);
  }

  myDay(): void {
    this.router.navigate(['/my-day']);
  }


  initForm(){
    this.formGroup = this.fb.group({
      'tasks' : ['']
    });
    // @ts-ignore
    this.formGroup.get('tasks').valueChanges.subscribe(response => {
      this.filterData(response);
    })
  }

  filterData(enteredData: string){
    this.filteredOptions = this.options.filter(item => {
      return item['task_name'].toLowerCase().indexOf(enteredData.toLowerCase()) > -1
    })
  }

  getAllTasks(){
    this.taskService.getAllTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.options = <Task[]>data['data'];
        //console.log(this.allTasksArray);
      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });
  }

  detailsTask(task: Task): void {
    this.initForm();
    this.taskService.detailsTask(task.TAID);
  }

}
