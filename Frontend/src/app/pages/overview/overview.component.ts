import {Component, OnInit} from '@angular/core';
import {CategoryService} from 'src/app/services/category/category.service';
import {Category} from 'src/app/services/category/category';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {Router} from '@angular/router';
import {FormControl} from "@angular/forms";
import {Observable, startWith, map} from "rxjs";
import {TaskService} from "../../services/task/task.service";
import {Task} from "../../services/task/task";
import {GeneralService} from "../../services/general/general.service";

@Component({
  selector: 'app-overview',
  templateUrl: './overview.component.html',
  styleUrls: ['./overview.component.scss']
})
export class OverviewComponent implements OnInit {

  public categories!: Category[];

  myControl = new FormControl('');
  options: string[] = [];
  allTasksArray!: Task[];
  taskNames!: string[];
  filteredOptions!: Observable<string[]>;

  constructor(private authService: AuthenticationService, private router: Router, private taskService: TaskService, private general: GeneralService) {
  }

  ngOnInit(): void {
    document.getElementsByTagName("h1")[0].innerText = "Übersicht";

    this.taskService.getAllTasks().subscribe(
      (data: any = []) => {
        // get tasks from data
        this.allTasksArray = <Task[]>data['data'];
        //console.log(this.allTasksArray);
        for (let a in this.allTasksArray){
          //console.log(this.allTasksArray[a]);
          this.options.push(this.allTasksArray[a]['task_name']);
        }

      },
      (error: any = []) => {
        if(error['error']['message']) {
          alert(error['error']['message']);
          return;
        }
        this.general.errorResponse(error['status']);
      });

    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }

}
