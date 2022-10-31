import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { Task } from 'src/app/services/task/task';
import { TaskService } from '../../services/task/task.service';

@Component({
  selector: 'app-insert-task',
  templateUrl: './insert-task.component.html',
  styleUrls: ['./insert-task.component.scss']
})
export class InsertTaskComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private taskService: TaskService, private router: Router, private route: ActivatedRoute) { }

  insertTaskForm!: FormGroup;
  selectedTask!: Task;
  edit!: boolean;

  ngOnInit(): void {

    const routeParams = this.route.snapshot.params;

    this.taskService.getTask(routeParams['TAID']).subscribe((data: Task) => {
      this.selectedTask = data;
      this.insertTaskForm.patchValue(data);
      if(routeParams['TAID']) this.edit = true;
      else this.edit = false;
      console.log(this.selectedTask);
    });

    this.insertTaskForm = this.formbuilder.group({
      TAID: [''],
      task_name: ['', [Validators.required, Validators.maxLength(30)]],
      deadline: ['', [Validators.required]],
      notes: ['']/*,
      categoryID: [''],
      groupID: ['']*/
    });

  }

  onInsertTaskSubmit(){
    this.taskService.insertTask(this.insertTaskForm.value).subscribe(data => {
      this.router.navigate(['dashboard']);
    });
  }

  onEditTaskSubmit() {
    this.taskService.updateTask(this.insertTaskForm.value).subscribe(() => {
      this.router.navigate(['dashboard']);
    });
  }

}
