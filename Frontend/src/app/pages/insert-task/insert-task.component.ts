import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { TaskService } from '../../services/task/task.service';

@Component({
  selector: 'app-insert-task',
  templateUrl: './insert-task.component.html',
  styleUrls: ['./insert-task.component.scss']
})
export class InsertTaskComponent implements OnInit {

  constructor(private formbuilder: FormBuilder, private TaskService: TaskService, private router: Router) { }

  insertTaskForm!: FormGroup;

  ngOnInit(): void {
    this.insertTaskForm = this.formbuilder.group({
      taskName: ['', Validators.required, Validators.maxLength(30)],
      deadline: ['', [Validators.required]],
      notes: ['']/*,
      categoryID: [''],
      groupID: ['']*/
    });
  }

  onInsertTaskSubmit(){
    console.log(this.insertTaskForm.value);

    this.TaskService.insertTask(this.insertTaskForm.value).subscribe(data => {
      this.router.navigate(['dashboard']);
    });
  }

}
