import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, Params, ActivatedRoute} from '@angular/router';
import {Task} from 'src/app/services/task/task';
import {TaskService} from '../../services/task/task.service';
import {DatePipe} from '@angular/common';
import {LOCALE_ID} from '@angular/core';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';

@Component({
  selector: 'app-insert-task',
  templateUrl: './insert-task.component.html',
  styleUrls: ['./insert-task.component.scss']
})
export class InsertTaskComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private taskService: TaskService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe, private authService: AuthenticationService) {
  }

  insertTaskForm!: FormGroup;
  selectedTask!: Task;
  edit!: boolean;

  ngOnInit(): void {

    const routeParams = this.route.snapshot.params;

    if (routeParams['TAID']) {
      this.edit = true;
      this.taskService.getTask(routeParams['TAID']).subscribe(
        (data: any = []) => {

          if (data['error'] == false) {
            this.selectedTask = <Task>data['data'];
            let deadline = new Date(this.selectedTask.deadline);
            this.selectedTask.deadlineDay = this.datePipe.transform(deadline, 'yyyy-MM-dd', 'de-AT') || '';
            this.selectedTask.deadlineHour = this.datePipe.transform(deadline, 'HH:mm', 'de-AT') || '';
            //console.log(this.selectedTask);
            this.insertTaskForm.patchValue(this.selectedTask);
          } else {
            this.router.navigate(['dashboard']);
          }
        },
        (error) => {
          let response = error.status;

          switch (response) {
            case 403:
              this.router.navigate(['dashboard']);
              break;
            case 404:
              alert("Task konnte nicht geladen werden!");
              this.router.navigate(['dashboard']);
              break;
            default:
              this.router.navigate(['dashboard']);
          }
        });
    }

    this.insertTaskForm = this.formbuilder.group({
      TAID: [''],
      task_name: ['', [Validators.required, Validators.maxLength(30)]],
      deadlineDay: ['', [Validators.required]],
      deadlineHour: ['', [Validators.required]],
      notes: ['']/*,
      categoryID: [''],
      groupID: ['']*/
    });
  }

  onInsertTaskSubmit() {
    this.taskService.insertTask(this.insertTaskForm.value).subscribe(
      (data: any = []) => {
        if (data['error'] == false) this.router.navigate(['dashboard']);
      },
      (error) => {
        if(error.status == 400) alert("Task konnte nicht hinzugefügt werden!");
        else this.router.navigate(['dashboard']);
      });
  }

  onEditTaskSubmit() {
    this.taskService.updateTask(this.insertTaskForm.value).subscribe(
      (data: any = []) => {
        if (data['error'] == false) this.router.navigate(['dashboard']);
      },
        (error) => {
          let response = error.status;

          switch (response) {
            case 403:
              this.router.navigate(['dashboard']);
              break;
            case 400:
              alert("Task konnte nicht bearbeitet werden!");
              this.router.navigate(['dashboard']);
              break;
            default:
              this.router.navigate(['dashboard']);
          }
        });
  }

}
