import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {Router, Params, ActivatedRoute} from '@angular/router';
import {Task} from 'src/app/services/task/task';
import {TaskService} from '../../services/task/task.service';
import {DatePipe} from '@angular/common';
import {LOCALE_ID} from '@angular/core';
import {AuthenticationService} from 'src/app/services/authentication/authentication.service';
import {GeneralService} from "../../services/general/general.service";

@Component({
  selector: 'app-insert-task',
  templateUrl: './insert-task.component.html',
  styleUrls: ['./insert-task.component.scss']
})
export class InsertTaskComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private taskService: TaskService, private router: Router, private route: ActivatedRoute, private datePipe: DatePipe, private authService: AuthenticationService, private general: GeneralService) {
  }

  insertTaskForm!: FormGroup;
  selectedTask!: Task;
  edit!: boolean;

  ngOnInit(): void {

    const routeParams = this.route.snapshot.params;

    // if TAID is transmitted get task and display values
    if (routeParams['TAID']) {

      this.edit = true;
      this.taskService.getTask(routeParams['TAID']).subscribe(
        (data: any = []) => {
            // get task from data
            this.selectedTask = <Task>data['data'];
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

}
